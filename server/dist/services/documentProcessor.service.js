"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessorService = void 0;
const pdfParse = require('pdf-parse');
const Document_1 = require("../models/Document");
const Chunk_1 = require("../models/Chunk");
const db_1 = require("../config/db");
const inMemoryStore_1 = require("../storage/inMemoryStore");
const embeddings_service_1 = require("./embeddings.service");
class DocumentProcessorService {
    /**
     * Main Document Ingestion Pipeline:
     * UPLOAD -> TEXT EXTRACTION -> CLEANING -> CHUNKING -> EMBEDDINGS -> MONGODB / STORE
     */
    static async processDocument(input) {
        const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const datasetId = input.datasetId || 'default-dataset';
        const name = input.fileName || 'Untitled Document.txt';
        const category = input.category || 'General';
        console.log(`[DocumentProcessor] Processing document: "${name}" (ID: ${documentId}, Dataset: ${datasetId})`);
        // 1. EXTRACT TEXT & PAGE NUMBERS
        const pages = await this.extractTextAndPages(input);
        if (!pages || pages.length === 0 || pages.every((p) => !p.text.trim())) {
            throw new Error(`Text extraction produced empty content for file "${name}".`);
        }
        let totalRawLength = 0;
        pages.forEach((p) => (totalRawLength += p.text.length));
        // 2. CLEANING & CHUNKING
        const chunksToEmbed = [];
        let globalChunkIndex = 0;
        const chunkSize = 500;
        const chunkOverlap = 100;
        for (const page of pages) {
            const cleanedText = this.cleanText(page.text);
            if (!cleanedText)
                continue;
            const pageChunks = this.chunkText(cleanedText, chunkSize, chunkOverlap);
            for (const textChunk of pageChunks) {
                if (textChunk.trim().length < 15)
                    continue; // skip tiny noise chunks
                chunksToEmbed.push({
                    pageNumber: page.pageNumber,
                    chunkIndex: globalChunkIndex++,
                    text: textChunk.trim(),
                });
            }
        }
        if (chunksToEmbed.length === 0) {
            throw new Error(`Chunking produced 0 valid text chunks for file "${name}".`);
        }
        // 3. GENERATE EMBEDDINGS & PREPARE CHUNK RECORDS
        console.log(`[DocumentProcessor] Generating embeddings for ${chunksToEmbed.length} chunks...`);
        const chunkItems = [];
        let usedProvider = 'local-tfidf';
        for (const item of chunksToEmbed) {
            const chunkId = `chk-${documentId}-${item.chunkIndex}`;
            const embedRes = await embeddings_service_1.EmbeddingsService.generateEmbedding(item.text);
            usedProvider = embedRes.provider;
            chunkItems.push({
                chunkId,
                documentId,
                datasetId,
                documentName: name,
                pageNumber: item.pageNumber,
                chunkIndex: item.chunkIndex,
                text: item.text,
                embedding: embedRes.embedding,
                characterCount: item.text.length,
                metadata: {
                    category,
                    extractedAt: new Date().toISOString(),
                },
                createdAt: new Date(),
            });
        }
        // 4. PREPARE DOCUMENT METADATA
        const docItem = {
            documentId,
            datasetId,
            name,
            category,
            fileType: input.fileType || this.inferFileType(name),
            sizeBytes: input.fileBuffer ? input.fileBuffer.length : Buffer.byteLength(input.rawText || '', 'utf8'),
            chunksCount: chunkItems.length,
            trustScore: 100,
            status: 'Indexed',
            createdAt: new Date(),
        };
        // 5. MONGODB STORAGE WITH IN-MEMORY FALLBACK
        let storageUsed = 'in-memory';
        // Always mirror to In-Memory Store
        inMemoryStore_1.inMemoryStore.saveDocument(docItem);
        inMemoryStore_1.inMemoryStore.saveChunks(chunkItems);
        const dbStatus = (0, db_1.getDbStatus)();
        if (dbStatus.isConnected) {
            try {
                await Document_1.DocumentModel.create({
                    documentId: docItem.documentId,
                    datasetId: docItem.datasetId,
                    name: docItem.name,
                    category: docItem.category,
                    fileType: docItem.fileType,
                    sizeBytes: docItem.sizeBytes,
                    chunksCount: docItem.chunksCount,
                    trustScore: docItem.trustScore,
                    status: docItem.status,
                    createdAt: docItem.createdAt,
                });
                const mongoChunks = chunkItems.map((c) => ({
                    chunkId: c.chunkId,
                    documentId: c.documentId,
                    datasetId: c.datasetId,
                    documentName: c.documentName,
                    pageNumber: c.pageNumber,
                    chunkIndex: c.chunkIndex,
                    text: c.text,
                    embedding: c.embedding,
                    characterCount: c.characterCount,
                    metadata: c.metadata,
                    createdAt: c.createdAt,
                }));
                await Chunk_1.ChunkModel.insertMany(mongoChunks);
                storageUsed = 'mongodb';
                console.log(`[DocumentProcessor] Successfully saved document & ${chunkItems.length} chunks to MongoDB`);
            }
            catch (err) {
                console.warn(`[DocumentProcessor Warning] Failed to write to MongoDB, fallback to in-memory: ${err.message}`);
            }
        }
        else {
            console.log(`[DocumentProcessor] MongoDB unavailable. Document stored in active in-memory repository.`);
        }
        return {
            documentId,
            datasetId,
            name,
            chunksCount: chunkItems.length,
            pagesCount: pages.length,
            status: 'Indexed',
            storageUsed,
            embeddingProvider: usedProvider,
            createdAt: docItem.createdAt,
        };
    }
    /**
     * STEP 1: Text & Page Extraction logic for PDF and Plain Text files
     */
    static async extractTextAndPages(input) {
        // If rawText provided directly
        if (input.rawText) {
            return this.partitionTextIntoPages(input.rawText);
        }
        if (!input.fileBuffer) {
            return [];
        }
        const fileType = (input.fileType || this.inferFileType(input.fileName)).toLowerCase();
        if (fileType === 'pdf') {
            try {
                const pages = [];
                // Custom pagerender to capture text page by page in pdf-parse
                let currentPage = 1;
                const pdfData = await pdfParse(input.fileBuffer, {
                    pagerender: (pageData) => {
                        return pageData.getTextContent().then((textContent) => {
                            let lastY, text = '';
                            for (const item of textContent.items) {
                                if (lastY == item.transform[5] || !lastY) {
                                    text += item.str;
                                }
                                else {
                                    text += '\n' + item.str;
                                }
                                lastY = item.transform[5];
                            }
                            const pageNum = currentPage++;
                            pages.push({ pageNumber: pageNum, text });
                            return text;
                        });
                    },
                });
                if (pages.length > 0) {
                    return pages;
                }
                // Fallback if pagerender yielded no items
                if (pdfData.text) {
                    return this.partitionTextIntoPages(pdfData.text);
                }
            }
            catch (err) {
                console.warn(`[DocumentProcessor] pdf-parse warning: ${err.message}. Treating as text buffer.`);
            }
        }
        // Default: convert Buffer to UTF-8 string and partition
        const utf8Text = input.fileBuffer.toString('utf-8');
        return this.partitionTextIntoPages(utf8Text);
    }
    /**
     * Partition continuous text into numbered pages based on form feeds (\f) or character blocks
     */
    static partitionTextIntoPages(fullText) {
        // Check if form feeds (\f) exist
        if (fullText.includes('\f')) {
            const parts = fullText.split('\f');
            return parts.map((partText, idx) => ({
                pageNumber: idx + 1,
                text: partText,
            })).filter((p) => p.text.trim().length > 0);
        }
        // Partition continuous text into simulated pages (~1800 characters per page)
        const pageSize = 1800;
        const pages = [];
        let currentIdx = 0;
        let pageNum = 1;
        while (currentIdx < fullText.length) {
            const endIdx = Math.min(currentIdx + pageSize, fullText.length);
            const text = fullText.substring(currentIdx, endIdx);
            pages.push({ pageNumber: pageNum++, text });
            currentIdx = endIdx;
        }
        return pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }];
    }
    /**
     * STEP 2: Text Cleaning & Normalization
     */
    static cleanText(raw) {
        return raw
            .replace(/\0/g, '') // remove null bytes
            .replace(/\r\n/g, '\n') // normalize newline
            .replace(/(\w+)-\n(\w+)/g, '$1$2') // rejoin hyphenated words at line breaks
            .replace(/[ \t]+/g, ' ') // collapse multi-spaces
            .replace(/\n{3,}/g, '\n\n') // max 2 consecutive newlines
            .trim();
    }
    /**
     * STEP 3: Recursive Character Chunking with Overlap
     */
    static chunkText(text, chunkSize, overlap) {
        const chunks = [];
        let start = 0;
        while (start < text.length) {
            let end = Math.min(start + chunkSize, text.length);
            // Try to break at a paragraph or sentence boundary if possible
            if (end < text.length) {
                const lastPeriod = text.lastIndexOf('.', end);
                const lastNewline = text.lastIndexOf('\n', end);
                const bestBreak = Math.max(lastPeriod, lastNewline);
                if (bestBreak > start + chunkSize * 0.5) {
                    end = bestBreak + 1;
                }
            }
            const chunk = text.substring(start, end).trim();
            if (chunk) {
                chunks.push(chunk);
            }
            start = end - overlap;
            if (start >= text.length - overlap) {
                break;
            }
        }
        return chunks;
    }
    static inferFileType(filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        return ext || 'txt';
    }
}
exports.DocumentProcessorService = DocumentProcessorService;
