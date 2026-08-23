import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, Search, Plus } from 'lucide-react';
import type { DocumentItem } from '../../../types';

export const DocumentsView: React.FC = () => {
  const [documents] = useState<DocumentItem[]>([
    { id: 'doc-1', name: 'College Student Handbook 2026.pdf', category: 'Academic Rules', size: '4.8 MB', status: 'Indexed', trustScore: 100, uploadedAt: '2026-08-20', chunksCount: 412 },
    { id: 'doc-2', name: 'Academic Evaluation Code.pdf', category: 'Examination', size: '2.3 MB', status: 'Indexed', trustScore: 99.4, uploadedAt: '2026-08-21', chunksCount: 184 },
    { id: 'doc-3', name: 'Library & Digital Resource Guide.pdf', category: 'Facilities', size: '1.1 MB', status: 'Indexed', trustScore: 100, uploadedAt: '2026-08-22', chunksCount: 88 },
    { id: 'doc-4', name: 'Campus Safety & Hostel Policy.pdf', category: 'Administration', size: '3.4 MB', status: 'Indexed', trustScore: 98.7, uploadedAt: '2026-08-23', chunksCount: 230 },
  ]);

  return (
    <div className="space-y-6">
      
      {/* File Upload Header Box */}
      <div className="glass-card rounded-3xl p-8 border border-dashed border-brand-500/40 dark:border-brand-500/30 text-center space-y-4 relative overflow-hidden bg-gradient-to-b from-brand-500/5 to-transparent">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 mx-auto flex items-center justify-center text-brand-600 dark:text-accent-cyan shadow-md">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Ingest Document Knowledge Set
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1">
            Drag and drop college handbooks, FAQ sheets, or PDFs to parse paragraphs and construct verifiable citations.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-accent-cyan shadow-md hover:opacity-95 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Select PDF / DOCX Files</span>
          </button>
        </div>
      </div>

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
              {documents.length} Files
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-400 w-full sm:w-64">
              <Search className="w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Filter documents..."
                className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full"
              />
            </div>
          </div>
        </div>

        {/* Table */}
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
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-obsidian-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-500" />
                    <span>{doc.name}</span>
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
                    <button className="text-slate-400 hover:text-rose-500 transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
