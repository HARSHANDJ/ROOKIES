import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import type { ForensicsLineage, SearchResultItem } from '../../types';

interface AnswerForensicsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  forensics: ForensicsLineage | null;
}

export const AnswerForensicsPanel: React.FC<AnswerForensicsPanelProps> = ({
  isOpen,
  onClose,
  forensics,
}) => {
  const [selectedChunk, setSelectedChunk] = useState<SearchResultItem | null>(null);

  if (!isOpen || !forensics) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-obsidian-900 h-full shadow-2xl border-l border-slate-200 dark:border-obsidian-800 flex flex-col justify-between overflow-hidden">
        
        {/* Panel Header */}
        <div className="p-6 border-b border-slate-200 dark:border-obsidian-800 flex items-center justify-between bg-slate-50/50 dark:bg-obsidian-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-accent-cyan">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Answer Forensics Audit Lineage
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Full 5-Stage Grounded Retrieval & Synthesis Pipeline Trace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Query Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Target Audit Question</div>
            <div className="font-bold text-sm text-slate-900 dark:text-white font-sans">
              "{forensics.question}"
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
              <span>Dataset: <strong className="text-brand-600 dark:text-accent-cyan">{forensics.datasetId}</strong></span>
              <span>Scanned Chunks: <strong>{forensics.chunksScanned}</strong></span>
              <span>Cited Sources: <strong>{forensics.retrievedSourcesCount}</strong></span>
            </div>
          </div>

          {/* 5-Stage Pipeline Lineage Stepper */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-500" />
              Reasoning Lineage Steps ({forensics.steps.length})
            </h4>

            <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-obsidian-800">
              {forensics.steps.map((step) => {
                let statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
                let statusBg = 'bg-emerald-500/10 border-emerald-500/20';

                if (step.status === 'warning') {
                  statusIcon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
                  statusBg = 'bg-amber-500/10 border-amber-500/20';
                } else if (step.status === 'failed') {
                  statusIcon = <XCircle className="w-4 h-4 text-rose-500" />;
                  statusBg = 'bg-rose-500/10 border-rose-500/20';
                }

                return (
                  <div key={step.stepNumber} className="relative pl-10">
                    <div className="absolute left-2 top-3 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-obsidian-900 border border-slate-300 dark:border-obsidian-700 flex items-center justify-center text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 shadow-sm z-10">
                      {step.stepNumber}
                    </div>

                    <div className={`p-4 rounded-2xl border ${statusBg} space-y-1`}>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                          {statusIcon}
                          <span>{step.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Step #{step.stepNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Retrieved Candidate Passages */}
          {forensics.topChunks && forensics.topChunks.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-obsidian-800">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-500" />
                Retrieved Vector Chunks ({forensics.topChunks.length})
              </h4>

              <div className="space-y-3">
                {forensics.topChunks.map((chunk) => (
                  <div
                    key={`${chunk.documentId}-${chunk.chunkIndex}`}
                    onClick={() => setSelectedChunk(chunk)}
                    className="p-4 rounded-2xl bg-slate-100/70 dark:bg-obsidian-950/70 border border-slate-200 dark:border-obsidian-800 hover:border-brand-500/50 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-brand-500" />
                        <span>{chunk.documentName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {chunk.scorePercent} Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono italic line-clamp-2">
                      "{chunk.text}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>Page {chunk.pageNumber} • Chunk #{chunk.chunkIndex}</span>
                      <span className="text-brand-500 font-semibold flex items-center gap-1">
                        Inspect Chunk Text <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Chunk Inspector Sub-Card */}
          {selectedChunk && (
            <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-brand-500/20">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-500" />
                  <span>Inspecting Chunk: {selectedChunk.documentName}</span>
                </div>
                <button
                  onClick={() => setSelectedChunk(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              <div className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed p-3 rounded-xl bg-white dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
                "{selectedChunk.text}"
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-500 pt-1">
                <div>Page: <strong className="text-slate-700 dark:text-slate-200">{selectedChunk.pageNumber}</strong></div>
                <div>Chunk Index: <strong className="text-slate-700 dark:text-slate-200">#{selectedChunk.chunkIndex}</strong></div>
                <div>Similarity: <strong className="text-emerald-500">{selectedChunk.scorePercent}</strong></div>
              </div>
            </div>
          )}

        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-obsidian-800 bg-slate-50/50 dark:bg-obsidian-950/50 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Zero-Guess Audited Lineage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-200 dark:bg-obsidian-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-obsidian-700 transition-colors"
          >
            Close Audit Drawer
          </button>
        </div>

      </div>
    </div>
  );
};
