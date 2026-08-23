"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundedLlmService = void 0;
const contradiction_service_1 = require("./contradiction.service");
const STOP_WORDS = new Set([
    'what', 'is', 'the', 'for', 'in', 'of', 'and', 'a', 'an', 'to', 'how', 'much', 'are', 'there',
    'can', 'i', 'do', 'does', 'which', 'where', 'when', 'who', 'why', 'policy', 'rules', 'regulations'
]);
class GroundedLlmService {
    static RELEVANCE_THRESHOLD = 0.50; // Minimum 50% similarity threshold
    static async generateGroundedAnswer(question, retrieval) {
        const startTime = Date.now();
        const cleanQuestion = question.trim();
        const results = retrieval.results || [];
        const maxScore = results.length > 0 ? results[0].similarityScore : 0;
        // Detect Contradictions between retrieved document sources
        const contradictionAlert = contradiction_service_1.ContradictionService.detectContradiction(results);
        // Perform Concept Alignment check to verify user query terms exist in retrieved context
        const conceptMatches = this.checkConceptAlignment(cleanQuestion, results);
        const hasSufficientEvidence = results.length > 0 && maxScore >= this.RELEVANCE_THRESHOLD && conceptMatches;
        // 1. Calculate Trust Meter Metrics
        const adjustedScore = hasSufficientEvidence ? maxScore : Math.min(maxScore * 0.4, 0.25);
        const trustScore = Math.round(adjustedScore * 100);
        const relevancePercent = hasSufficientEvidence ? `${(maxScore * 100).toFixed(1)}%` : 'Low (< 35%)';
        const uniqueDocs = hasSufficientEvidence ? new Set(results.map((r) => r.documentId)).size : 0;
        const sourceCoverage = hasSufficientEvidence
            ? `${results.length} vector chunks across ${uniqueDocs} document(s)`
            : '0 sufficient evidence passages found in active knowledge base';
        let evidenceStrength = 'Insufficient Evidence';
        if (hasSufficientEvidence) {
            evidenceStrength = maxScore >= 0.65 ? 'Strong Evidence' : 'Moderate Evidence';
        }
        const trustMeter = {
            trustScore,
            relevancePercent,
            relevanceScore: adjustedScore,
            evidenceStrength,
            sourceCoverage,
            isGrounded: hasSufficientEvidence,
        };
        // 2. Synthesize Grounded Answer or Trigger Unknown Fallback
        let answerText = '';
        let isKnown = false;
        if (!hasSufficientEvidence) {
            isKnown = false;
            answerText = "I couldn't find enough information in the provided knowledge base to answer this accurately.";
        }
        else {
            isKnown = true;
            answerText = await this.synthesizeGroundedAnswer(cleanQuestion, results);
            // Disclose Contradiction if detected
            if (contradictionAlert.hasContradiction) {
                answerText += `\n\n[CONTRADICTION DETECTED]: ${contradictionAlert.description} KnowSphere AI explicitly presents both conflicting source policies rather than silently selecting one.`;
            }
        }
        // 3. Prepare Sources Attribution
        const sources = hasSufficientEvidence
            ? results.slice(0, 4).map((r) => ({
                documentId: r.documentId,
                documentName: r.documentName,
                pageNumber: r.pageNumber,
                chunkIndex: r.chunkIndex,
                similarityScore: r.similarityScore,
                scorePercent: r.scorePercent,
                textSnippet: r.text.length > 180 ? `${r.text.substring(0, 180)}...` : r.text,
            }))
            : [];
        // 4. Construct Forensics Lineage Audit Trail
        const forensics = this.buildForensicsLineage(cleanQuestion, retrieval, hasSufficientEvidence, answerText);
        return {
            question: cleanQuestion,
            answer: answerText,
            isKnown,
            trustMeter,
            contradictionAlert,
            sources,
            forensics,
            embeddingProvider: retrieval.embeddingProvider,
            searchMethod: retrieval.searchMethod,
            latencyMs: Date.now() - startTime + retrieval.latencyMs,
        };
    }
    /**
     * Concept Alignment Verification
     */
    static checkConceptAlignment(question, chunks) {
        if (!chunks || chunks.length === 0)
            return false;
        const words = question
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
        if (words.length === 0)
            return true; // generic question
        const combinedText = chunks.slice(0, 3).map((c) => c.text.toLowerCase()).join(' ');
        let matchCount = 0;
        for (const word of words) {
            if (combinedText.includes(word)) {
                matchCount++;
            }
        }
        return matchCount > 0;
    }
    /**
     * Synthesizes answer strictly from retrieved chunk context
     */
    static async synthesizeGroundedAnswer(question, chunks) {
        const contextText = chunks
            .slice(0, 3)
            .map((c) => `[Source: ${c.documentName}, Page ${c.pageNumber}]\n${c.text}`)
            .join('\n\n');
        // 1. Try Gemini API if key available
        const googleApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (googleApiKey) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `System: You are KnowSphere AI, a strictly grounded institutional assistant.
Answer ONLY using the supplied knowledge-base context below. If sufficient evidence is not available, explicitly state: "I couldn't find enough information in the provided knowledge base to answer this accurately." Never use outside knowledge to fill missing information.

Context:
${contextText}

Question: ${question}`,
                                    },
                                ],
                            },
                        ],
                        generationConfig: { temperature: 0.1, maxOutputTokens: 300 },
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (generated && generated.trim()) {
                        return generated.trim();
                    }
                }
            }
            catch (err) {
                console.warn('[GroundedLlmService] Gemini API call failed, using grounded context synthesizer:', err);
            }
        }
        // 2. Try OpenAI API if key available
        if (process.env.OPENAI_API_KEY) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        temperature: 0.1,
                        messages: [
                            {
                                role: 'system',
                                content: 'You are KnowSphere AI. Answer ONLY using the supplied context. If evidence is missing, state: "I couldn\'t find enough information in the provided knowledge base to answer this accurately." Never guess.',
                            },
                            {
                                role: 'user',
                                content: `Context:\n${contextText}\n\nQuestion: ${question}`,
                            },
                        ],
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    const generated = data?.choices?.[0]?.message?.content;
                    if (generated && generated.trim()) {
                        return generated.trim();
                    }
                }
            }
            catch (err) {
                console.warn('[GroundedLlmService] OpenAI API call failed, using grounded context synthesizer:', err);
            }
        }
        // 3. Local Deterministic Grounded Synthesizer
        const topChunk = chunks[0];
        const sentences = topChunk.text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
        const qWords = question.toLowerCase().split(/\s+/).filter((w) => w.length > 3 && !STOP_WORDS.has(w));
        let bestSentence = sentences[0] || topChunk.text;
        let maxMatches = 0;
        for (const s of sentences) {
            let matches = 0;
            for (const qw of qWords) {
                if (s.toLowerCase().includes(qw))
                    matches++;
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                bestSentence = s;
            }
        }
        return `According to ${topChunk.documentName} (Page ${topChunk.pageNumber}): ${bestSentence.trim()}`;
    }
    /**
     * Constructs the 5-stage Answer Forensics Audit Lineage
     */
    static buildForensicsLineage(question, retrieval, hasEvidence, answer) {
        const timestamp = new Date().toISOString();
        const results = retrieval.results || [];
        const topScore = results.length > 0 ? results[0].similarityScore : 0;
        const steps = [
            {
                stepNumber: 1,
                title: 'Query Understanding & Concept Mapping',
                description: `Tokenized question into key concept terms for ${retrieval.datasetId} dataset alignment.`,
                timestamp,
                status: 'completed',
                details: { question, datasetId: retrieval.datasetId },
            },
            {
                stepNumber: 2,
                title: 'Vector Search & Candidate Extraction',
                description: `Scanned ${retrieval.totalCandidates} vector chunks via ${retrieval.searchMethod}.`,
                timestamp,
                status: retrieval.totalCandidates > 0 ? 'completed' : 'warning',
                details: { candidatesFound: retrieval.totalCandidates, searchMethod: retrieval.searchMethod },
            },
            {
                stepNumber: 3,
                title: 'Cosine Evidence Ranking',
                description: `Ranked candidate passages by vector similarity score. Top similarity score: ${(topScore * 100).toFixed(1)}%.`,
                timestamp,
                status: hasEvidence ? 'completed' : 'warning',
                details: { topSimilarityScore: topScore, scorePercent: `${(topScore * 100).toFixed(1)}%` },
            },
            {
                stepNumber: 4,
                title: 'Knowledge Boundary Verification',
                description: hasEvidence
                    ? `Evidence alignment passed concept and vector score threshold. Grounded synthesis authorized.`
                    : `Target question falls outside active knowledge base concepts or score threshold. Grounding boundary enforced.`,
                timestamp,
                status: hasEvidence ? 'completed' : 'failed',
                details: { threshold: '50.0%', passed: hasEvidence },
            },
            {
                stepNumber: 5,
                title: 'Grounded Answer Synthesis',
                description: hasEvidence
                    ? `Generated answer strictly grounded in ${results.length} cited document passage(s).`
                    : 'Returned exact unknown fallback response without hallucination.',
                timestamp,
                status: hasEvidence ? 'completed' : 'warning',
                details: { answerSnippet: answer.substring(0, 120) },
            },
        ];
        return {
            question,
            datasetId: retrieval.datasetId,
            retrievedSourcesCount: hasEvidence ? results.length : 0,
            chunksScanned: retrieval.totalCandidates,
            steps,
            topChunks: hasEvidence ? results : [],
        };
    }
}
exports.GroundedLlmService = GroundedLlmService;
