import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Search, 
  Plus, 
  RefreshCw, 
  FileCode, 
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { api } from '../../../services/api';
import type { DocumentItem, DatasetItem } from '../../../types';

export const DocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedDatasetFilter, setSelectedDatasetFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // File Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Raw Text Modal State
  const [showTextModal, setShowTextModal] = useState<boolean>(false);
  const [textTitle, setTextTitle] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [textCategory, setTextCategory] = useState<string>('Academic Policy');
  const [textDataset, setTextDataset] = useState<string>('academic-policy');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [docsRes, datasetsRes] = await Promise.all([
        api.getDocuments(selectedDatasetFilter),
        api.getDatasets(),
      ]);
      setDocuments(docsRes);
      setDatasets(datasetsRes);
    } catch (err: any) {
      console.error('Failed to load documents data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDatasetFilter]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setStatusMsg(null);

    try {
      const res = await api.uploadDocument(file, 'academic-policy', 'General');
      setStatusMsg({
        type: 'success',
        message: `Successfully processed "${file.name}"! Created ${res.document.chunksCount} chunks with vector embeddings.`,
      });
      loadData();
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        message: err.message || 'File upload processing failed',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textTitle.trim() || !textContent.trim()) return;

    setIsUploading(true);
    setStatusMsg(null);

    try {
      const res = await api.processText(textTitle, textContent, textDataset, textCategory);
      setStatusMsg({
        type: 'success',
        message: `Text document "${textTitle}" processed into ${res.document.chunksCount} vector chunks!`,
      });
      setShowTextModal(false);
      setTextTitle('');
      setTextContent('');
      loadData();
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        message: err.message || 'Failed to process text content',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" and all its vector chunks?`)) return;

    try {
      await api.deleteDocument(id);
      setStatusMsg({
        type: 'success',
        message: `Deleted "${name}" from Knowledge Base.`,
      });
      loadData();
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        message: err.message || 'Failed to delete document',
      });
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.md,.json"
        className="hidden"
      />

      {/* File Upload Box */}
      <div className="glass-card rounded-3xl p-8 border border-dashed border-brand-500/40 dark:border-brand-500/30 text-center space-y-4 relative overflow-hidden bg-gradient-to-b from-brand-500/5 to-transparent">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 mx-auto flex items-center justify-center text-brand-600 dark:text-accent-cyan shadow-md">
          {isUploading ? <RefreshCw className="w-7 h-7 animate-spin" /> : <UploadCloud className="w-7 h-7" />}
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Ingest Document Knowledge Set
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1 max-w-lg mx-auto">
            Upload PDF or Text documents to automatically run text extraction, cleaning, chunking, vector embedding generation, and MongoDB storage.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-accent-cyan shadow-md hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Upload PDF / TXT Document</span>
          </button>

          <button
            onClick={() => setShowTextModal(true)}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-obsidian-800 hover:bg-slate-300 dark:hover:bg-obsidian-700 transition-all flex items-center gap-2"
          >
            <FileCode className="w-4 h-4 text-brand-500" />
            <span>Paste Direct Text Snippet</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between font-mono ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.message}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Document Catalog Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-obsidian-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Indexed Document Repository
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-obsidian-800 text-slate-500">
              {filteredDocs.length} Files
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter Dataset Dropdown */}
            <select
              value={selectedDatasetFilter}
              onChange={(e) => setSelectedDatasetFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="all">All Datasets</option>
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.title}
                </option>
              ))}
            </select>

            {/* Search filter input */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-400 w-full sm:w-48">
              <Search className="w-3.5 h-3.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter docs..."
                className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full"
              />
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
            <span>Loading Document Knowledge Store...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500 font-mono">No documents found. Upload a PDF or paste text to ingest knowledge.</p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-obsidian-800 font-mono text-[10px] text-slate-400 uppercase">
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chunks</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-obsidian-800">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-obsidian-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                      <div>
                        <div>{doc.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{doc.documentId || doc.id}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{doc.category}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{doc.size}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{doc.chunksCount} chunks</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-emerald-500">{doc.trustScore}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.name)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Delete Document & Chunks"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Paste Direct Text Modal */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-obsidian-900 rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-obsidian-800">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                Ingest Direct Text Document
              </h3>
              <button
                onClick={() => setShowTextModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="e.g., Campus Housing Guidelines 2026.txt"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Dataset ID</label>
                  <input
                    type="text"
                    value={textDataset}
                    onChange={(e) => setTextDataset(e.target.value)}
                    placeholder="academic-policy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={textCategory}
                    onChange={(e) => setTextCategory(e.target.value)}
                    placeholder="Academic Rules"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Text Content</label>
                <textarea
                  required
                  rows={6}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste section text, clauses, or policy paragraphs..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-800 dark:text-slate-100 outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTextModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-accent-cyan hover:opacity-95 shadow-md"
                >
                  {isUploading ? 'Processing...' : 'Run Extraction & Chunking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
