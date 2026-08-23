import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IChunk extends MongooseDocument {
  chunkId: string;
  documentId: string;
  datasetId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  embedding: number[];
  characterCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const ChunkSchema: Schema = new Schema(
  {
    chunkId: { type: String, required: true, unique: true, index: true },
    documentId: { type: String, required: true, index: true },
    datasetId: { type: String, required: true, index: true },
    documentName: { type: String, required: true },
    pageNumber: { type: Number, required: true, default: 1 },
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    characterCount: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound indexes for performant retrieval
ChunkSchema.index({ datasetId: 1, documentId: 1, chunkIndex: 1 });

export const ChunkModel = mongoose.model<IChunk>('Chunk', ChunkSchema);
