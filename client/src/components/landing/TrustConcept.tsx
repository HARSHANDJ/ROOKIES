import React from 'react';
import { ShieldCheck, AlertTriangle, Check, X, FileSearch } from 'lucide-react';

export const TrustConcept: React.FC = () => {
  return (
    <section id="trust-concept" className="py-20 relative border-t border-slate-200/80 dark:border-obsidian-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CORE PHILOSOPHY & VERIFICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Why Standard AI Fails & How KnowSphere Solves It
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            Conventional chatbots invent plausibly sounding facts when documents lack explicit answers. KnowSphere AI enforces mathematical grounding and explicit non-hallucination protocols.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Unverified AI Card */}
          <div className="glass-card rounded-3xl p-8 border-rose-500/30 dark:border-rose-900/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-obsidian-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Standard AI Chatbots</h3>
                  <span className="text-xs text-rose-500 font-mono">Generative Hallucination Risk</span>
                </div>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span>Guesses answers when information is missing from documents</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span>Provides fake or non-existent page & section citations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span>Mixes general internet training data into strict college policies</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span>No audit trail or visual sentence highlight for compliance check</span>
              </li>
            </ul>
          </div>

          {/* KnowSphere Grounded Engine Card */}
          <div className="glass-card rounded-3xl p-8 border-emerald-500/40 dark:border-emerald-900/50 shadow-glow-cyan relative overflow-hidden bg-gradient-to-b from-white/90 to-emerald-500/5 dark:from-obsidian-900/90 dark:to-emerald-950/20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-obsidian-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">KnowSphere AI Core</h3>
                  <span className="text-xs text-emerald-500 font-mono font-semibold">Strict Verification & Citation</span>
                </div>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Explicitly states <strong>"Information Not Found in Context"</strong> rather than guessing</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Pinpoint paragraph, clause, and page number citation mapping</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Strict boundary isolation — relies <strong>ONLY</strong> on uploaded document sets</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Interactive side-by-side source passage highlighting for human verification</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Dynamic Verification Banner */}
        <div className="mt-12 max-w-5xl mx-auto p-6 rounded-2xl bg-obsidian-900 text-white border border-obsidian-700 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-accent-cyan shrink-0">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-white">Verification Benchmark Standard</h4>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Evaluated against college handbooks, course catalogs, grading policies, and institutional FAQs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center px-4 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700">
              <div className="text-lg font-bold font-mono text-emerald-400">100%</div>
              <div className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">Citation Grounding</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700">
              <div className="text-lg font-bold font-mono text-accent-cyan">0.0%</div>
              <div className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">Hallucination Rate</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
