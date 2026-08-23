import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  documentId: string;
  datasetId: string;
  name: string;
  category: string;
  fileType: string;
  sizeBytes: number;
  chunksCount: number;
  trustScore: number;
  status: 'Indexed' | 'Processing' | 'Failed';
  createdAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    documentId: { type: String, required: true, unique: true, index: true },
    datasetId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    fileType: { type: String, default: 'txt' },
    sizeBytes: { type: Number, default: 0 },
    chunksCount: { type: Number, default: 0 },
    trustScore: { type: Number, default: 100 },
    status: { type: String, enum: ['Indexed', 'Processing', 'Failed'], default: 'Processing' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
