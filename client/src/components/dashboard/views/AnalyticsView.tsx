import React from 'react';
import { BarChart3, ShieldCheck, Clock, Zap, AlertCircle } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-obsidian-800">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-500" />
            Verification Analytics & Performance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Real-time grounding metrics, latency tracking, and zero-guess fallback statistics.
          </p>
        </div>

        <div className="px-3 py-1 rounded-xl bg-brand-500/10 text-brand-600 dark:text-accent-cyan border border-brand-500/20 text-xs font-mono">
          Last 30 Days Telemetry
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-obsidian-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Avg Grounding Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">99.8%</div>
          <div className="text-[10px] font-mono text-emerald-500 mt-1">100% Verifiable Citations</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-obsidian-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Query Response Time</span>
            <Clock className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">142 ms</div>
          <div className="text-[10px] font-mono text-accent-cyan mt-1">Ultra Low Latency</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-obsidian-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Non-Guess Fallbacks</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">24 Triggers</div>
          <div className="text-[10px] font-mono text-amber-500 mt-1">0% Hallucination Inventions</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-obsidian-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Paragraph Chunks Indexed</span>
            <Zap className="w-4 h-4 text-accent-violet" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">914 Chunks</div>
          <div className="text-[10px] font-mono text-purple-400 mt-1">Across 4 Datasets</div>
        </div>
      </div>

      {/* Visual Charts Shell Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Grounding Confidence Distribution */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
            <span>Citation Grounding Distribution</span>
            <span className="text-xs font-mono text-slate-400">Target Goal: 99%+</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600 dark:text-slate-300">Exact Paragraph Citation (95-100% Match)</span>
                <span className="text-emerald-500 font-bold">96.4%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-obsidian-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96.4%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600 dark:text-slate-300">Section Level Context (85-94% Match)</span>
                <span className="text-accent-cyan font-bold">3.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-obsidian-800 overflow-hidden">
                <div className="h-full bg-accent-cyan rounded-full" style={{ width: '3.2%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600 dark:text-slate-300">Explicit Non-Guess Fallback</span>
                <span className="text-amber-500 font-bold">0.4%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-obsidian-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '0.4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Top Queried Document Categories */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
            Query Volume by Document Category
          </h3>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Attendance & Condonation Rules</span>
              <span className="font-mono font-bold text-brand-500">642 Queries (45%)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Examination & Grade Appeals</span>
              <span className="font-mono font-bold text-accent-cyan">418 Queries (29%)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Course Withdrawal & Registration</span>
              <span className="font-mono font-bold text-accent-violet">210 Queries (15%)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Library & Facilities Overdues</span>
              <span className="font-mono font-bold text-emerald-500">158 Queries (11%)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
