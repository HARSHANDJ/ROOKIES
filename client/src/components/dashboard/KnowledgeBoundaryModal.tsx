import React from 'react';
import { 
  X, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import type { KnowledgeBoundaryData } from '../../types';

interface KnowledgeBoundaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  boundary: KnowledgeBoundaryData | null;
  onSelectTopic: (topic: string) => void;
}

export const KnowledgeBoundaryModal: React.FC<KnowledgeBoundaryModalProps> = ({
  isOpen,
  onClose,
  boundary,
  onSelectTopic,
}) => {
  if (!isOpen || !boundary) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass-card bg-white dark:bg-obsidian-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-obsidian-800 max-w-4xl w-full space-y-6 shadow-2xl relative my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-obsidian-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-accent-cyan shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Knowledge Boundary Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                Visualizing strict system domain boundaries: What KnowSphere AI knows, partially knows, and refuses to guess.
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

        {/* 3 Boundary Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: WHAT THE AI KNOWS */}
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-display font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>WHAT THE AI KNOWS</span>
            </div>

            <div className="space-y-3">
              {boundary.knows.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectTopic(item.topic);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-100/70 dark:bg-obsidian-950/70 border border-slate-200 dark:border-obsidian-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">
                      {item.confidence}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    {item.evidence}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200/50 dark:border-obsidian-800/50">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-brand-500" /> {item.document}
                    </span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      Test <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: PARTIAL KNOWLEDGE */}
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-2 font-display font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>PARTIAL KNOWLEDGE</span>
            </div>

            <div className="space-y-3">
              {boundary.partial.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectTopic(item.topic);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-100/70 dark:bg-obsidian-950/70 border border-slate-200 dark:border-obsidian-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {item.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-500">
                      {item.confidence}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    {item.evidence}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200/50 dark:border-obsidian-800/50">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-amber-500" /> {item.document}
                    </span>
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      Test <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: WHAT THE AI DOESN'T KNOW */}
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-display font-bold text-xs">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>WHAT THE AI DOESN'T KNOW</span>
            </div>

            <div className="space-y-3">
              {boundary.doesNotKnow.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectTopic(item.topic);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-100/70 dark:bg-obsidian-950/70 border border-slate-200 dark:border-obsidian-800 hover:border-rose-500/50 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {item.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-500">
                      Out of Bounds
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    {item.reason}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200/50 dark:border-obsidian-800/50">
                    <span className="flex items-center gap-1 text-rose-500">
                      <HelpCircle className="w-3 h-3" /> Triggers Fallback
                    </span>
                    <span className="text-rose-500 font-semibold flex items-center gap-1">
                      Test <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Note */}
        <div className="pt-4 border-t border-slate-200 dark:border-obsidian-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Strict Zero-Guess Protocol: Prevents hallucinating outside knowledge bounds.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-xs bg-slate-200 dark:bg-obsidian-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-obsidian-700 transition-colors"
          >
            Close Boundary Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
