import React from 'react';
import { ShieldCheck, Files, Database, MessageSquare, ArrowUpRight, Sparkles, CheckCircle2, Clock, Cpu } from 'lucide-react';
import type { DashboardTab } from '../../../types';

interface OverviewViewProps {
  setActiveTab: (tab: DashboardTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ setActiveTab }) => {
  const stats = [
    { title: 'Trust Score', value: '99.8%', change: '+0.2%', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Indexed Documents', value: '14 Handbooks', change: 'Updated', icon: Files, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { title: 'Sample Datasets', value: '4 Ready', change: 'Active', icon: Database, color: 'text-accent-cyan', bg: 'bg-cyan-500/10' },
    { title: 'Total Queries Solved', value: '1,428', change: '100% Grounded', icon: MessageSquare, color: 'text-accent-violet', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-obsidian-900 via-brand-950 to-obsidian-900 border border-obsidian-700 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MILESTONE 1 FOUNDATION READY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome to KnowSphere AI Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Your environment is fully initialized with React TypeScript, Tailwind visual system, Node.js backend structure, and MongoDB connection module.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ask')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-accent-cyan text-slate-950 hover:opacity-95 transition-all shadow-md"
            >
              Open Ask Knowledge Workbench
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-obsidian-800 border border-obsidian-700 text-slate-200 hover:bg-obsidian-700 transition-all"
            >
              Manage Document Sets
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-obsidian-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{st.title}</span>
                <div className={`w-8 h-8 rounded-lg ${st.bg} ${st.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display mb-1">
                {st.value}
              </div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>{st.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: System Readiness + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Readiness Checklist */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-obsidian-800">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-500" />
              Milestone 1 System Verification Checklist
            </h3>
            <span className="text-xs font-mono text-emerald-500 font-semibold">4 / 4 Core Active</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">React + TypeScript Frontend</div>
                  <div className="text-[10px] text-slate-500">Routing & Tailwind Design Tokens Loaded</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">OPERATIONAL</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Node.js Express Backend Structure</div>
                  <div className="text-[10px] text-slate-500">Health endpoints available at localhost:5000/api/health</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">OPERATIONAL</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">MongoDB Connection Module</div>
                  <div className="text-[10px] text-slate-500">Auto-fallback & connection state handler ready</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">CONFIGURED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">7 Dashboard Module Shells</div>
                  <div className="text-[10px] text-slate-500">Overview, Ask, Docs, Datasets, Graph, Analytics, Eval</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">READY</span>
            </div>
          </div>
        </div>

        {/* Quick Activity feed */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-cyan" />
            Recent Ingestion Stream
          </h3>

          <div className="space-y-3 text-xs">
            <div className="pb-3 border-b border-slate-200 dark:border-obsidian-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200">College Handbook 2026</div>
              <div className="text-[10px] text-slate-500 font-mono">148 Pages • 412 Paragraph Chunks</div>
              <span className="text-[10px] text-emerald-500 font-medium">100% Grounded Citation</span>
            </div>

            <div className="pb-3 border-b border-slate-200 dark:border-obsidian-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Academic FAQ Collection</div>
              <div className="text-[10px] text-slate-500 font-mono">35 Questions • 8 Categories</div>
              <span className="text-[10px] text-emerald-500 font-medium">Verified Citation</span>
            </div>

            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Library & Lab Policy</div>
              <div className="text-[10px] text-slate-500 font-mono">18 Pages • 54 Paragraph Chunks</div>
              <span className="text-[10px] text-emerald-500 font-medium">Indexed</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
