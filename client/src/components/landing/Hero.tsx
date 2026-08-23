import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, FileText, Search, ExternalLink } from 'lucide-react';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Background Gradients & Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/20 to-accent-violet/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-accent-cyan/15 rounded-full blur-2xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-accent-cyan shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-ping"></span>
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
            <span>KNOWSPHERE AI PLATFORM • MILESTONE 1</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Ask Anything.{' '}
            <span className="text-gradient block sm:inline">
              Trust Everything You Can Verify.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
            Eliminate AI hallucinations from college handbooks, FAQ repositories, and enterprise policies. Every answer is strictly grounded with pinpoint source citations.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-violet hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-obsidian-700 bg-white/70 dark:bg-obsidian-900/60 hover:border-brand-500/50 backdrop-blur-md transition-all duration-300 shadow-sm"
            >
              <FileText className="w-4 h-4 text-brand-500 dark:text-accent-cyan" />
              <span>Explore Interactive Demo</span>
            </a>
          </div>

          {/* Key Value Micro Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero-Guess Fallback Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Paragraph-Level Citation Tracing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-accent-cyan" />
              <span>Interactive Knowledge Graph Shell</span>
            </div>
          </div>

        </div>

        {/* Hero Interactive Card Preview Mock */}
        <div className="mt-14 relative max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 overflow-hidden border border-slate-200/80 dark:border-obsidian-700/80">
            
            {/* Window Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-obsidian-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs font-mono text-slate-400 dark:text-slate-400">
                  KnowSphere Engine v1.0 • Verification Workbench
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED 100%
                </span>
              </div>
            </div>

            {/* Query Input Simulation */}
            <div className="mb-6 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-obsidian-950/80 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-sans text-sm">
                <Search className="w-4 h-4 text-brand-500 dark:text-accent-cyan" />
                <span className="font-medium">“What is the minimum attendance requirement for final exam eligibility?”</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 px-2 py-1 rounded bg-slate-200 dark:bg-obsidian-800">
                Sample Query
              </span>
            </div>

            {/* Answer Box + Grounding Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-700 dark:text-accent-cyan flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> GROUNDED RESPONSE
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      Confidence: 99.4%
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    Students must maintain a minimum of <strong>75% attendance</strong> in all registered courses to be eligible to sit for the final semester examinations. Students with attendance between 65% and 74% may apply for condonation on valid medical grounds.
                  </p>
                </div>
              </div>

              {/* Source Document Citation Card */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-brand-500" /> SOURCE CITATION
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-xs font-mono text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 leading-tight">
                  <p className="text-[11px] font-bold text-brand-500 dark:text-accent-cyan mb-1">
                    [Doc #1] Student Handbook 2026
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Section 4.2 • Page 18
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic mt-1.5 border-l-2 border-brand-500 pl-2">
                    "...clause 4.2: Attendance criteria mandates 75% aggregate..."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
