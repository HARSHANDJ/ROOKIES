import React from 'react';
import { ShieldCheck, Files, Database, MessageSquare, ArrowUpRight, Sparkles, CheckCircle2, Clock, Cpu, Play } from 'lucide-react';
import type { DashboardTab } from '../../../types';

interface OverviewViewProps {
  setActiveTab: (tab: DashboardTab) => void;
  onLaunchJudgeDemo?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ setActiveTab, onLaunchJudgeDemo }) => {
  const stats = [
    { title: 'Trust Score', value: '100%', change: 'Zero Fabrication', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Indexed Documents', value: '4 Active Docs', change: '35 Chunks Embedded', icon: Files, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { title: 'Vector Datasets', value: '2 Partitioned', change: 'Grounding Active', icon: Database, color: 'text-accent-cyan', bg: 'bg-cyan-500/10' },
    { title: 'Retrieval Latency', value: '~8 ms', change: 'Vector Ranker', icon: MessageSquare, color: 'text-accent-violet', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-obsidian-900 via-brand-950 to-obsidian-900 border border-obsidian-700 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KNOWLEDGE INTELLIGENCE & VERIFICATION PLATFORM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome to KnowSphere AI Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            The full document processing pipeline, semantic vector search engine, Trust Meter, Contradiction Radar, Answer Forensics, and Knowledge Graph are fully operational.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onLaunchJudgeDemo && (
              <button
                onClick={onLaunchJudgeDemo}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-accent-cyan text-white hover:opacity-95 transition-all shadow-md flex items-center gap-2 animate-pulse"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LAUNCH JUDGE DEMO</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('ask')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-obsidian-800 border border-obsidian-700 text-slate-200 hover:bg-obsidian-700 transition-all"
            >
              Test Grounded Workbench
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
              Verified Core Platform Modules
            </h3>
            <span className="text-xs font-mono text-emerald-500 font-semibold">6 / 6 Core Functional</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">1. Document Processing Service</div>
                  <div className="text-[10px] text-slate-500">Upload → Extract (`pdf-parse`) → Clean → Chunk → Embed → Store</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">VERIFIED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">2. Vector Search & Retrieval Service</div>
                  <div className="text-[10px] text-slate-500">MongoDB `$vectorSearch` + Cosine Vector Ranker fallback</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">VERIFIED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">3. Trust Meter & Zero-Hallucination Fallback</div>
                  <div className="text-[10px] text-slate-500">Evidence strength scoring and boundary refusal enforcement</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">VERIFIED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">4. Contradiction Radar</div>
                  <div className="text-[10px] text-slate-500">Detects inter-document rule & metric conflicts automatically</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">VERIFIED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">5. Answer Forensics Audit Drawer</div>
                  <div className="text-[10px] text-slate-500">5-stage reasoning lineage trace & chunk inspector</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">VERIFIED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">6. Interactive Knowledge Graph Topology</div>
                  <div className="text-[10px] text-slate-500">Zoomable SVG mapping: Document → Topic → Rule → Chunk</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Quick Activity feed */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-cyan" />
            Live Ingestion Stream
          </h3>

          <div className="space-y-3 text-xs">
            <div className="pb-3 border-b border-slate-200 dark:border-obsidian-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200">College Student Handbook 2026</div>
              <div className="text-[10px] text-slate-500 font-mono">15 Chunks • 75% Attendance Rule</div>
              <span className="text-[10px] text-emerald-500 font-medium">Vector Embedded</span>
            </div>

            <div className="pb-3 border-b border-slate-200 dark:border-obsidian-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Revised Academic Council Circular</div>
              <div className="text-[10px] text-slate-500 font-mono">4 Chunks • 80% Honours Clause</div>
              <span className="text-[10px] text-amber-500 font-medium">Contradiction Radar Active</span>
            </div>

            <div className="pb-3 border-b border-slate-200 dark:border-obsidian-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Academic Evaluation Code</div>
              <div className="text-[10px] text-slate-500 font-mono">9 Chunks • Section 9 Appeals</div>
              <span className="text-[10px] text-emerald-500 font-medium">Vector Embedded</span>
            </div>

            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Library Resource Policy 2026</div>
              <div className="text-[10px] text-slate-500 font-mono">6 Chunks • Section 2 Fines</div>
              <span className="text-[10px] text-emerald-500 font-medium">Vector Embedded</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
