import React, { useState } from 'react';
import { Network, Sparkles, FileText, Layers, ZoomIn, ZoomOut, RefreshCw, ChevronRight } from 'lucide-react';

export const KnowledgeGraphView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    label: string;
    type: string;
    connectedTo: string[];
    summary: string;
  }>({
    id: 'node-1',
    label: 'Attendance Policy (Section 4.2)',
    type: 'Document Section',
    connectedTo: ['75% Mandatory Threshold', 'Medical Condonation (65%-74%)', 'Final Exam Eligibility'],
    summary: 'Core regulation mandating aggregate physical attendance for end-semester examinations.',
  });



  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-obsidian-800">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-accent-cyan" />
            Knowledge Entity Graph
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Visual structural graph mapping relationship connections across handbook sections, clauses, and regulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 text-xs font-mono text-slate-500">
            6 Nodes • 12 Edge References
          </span>
        </div>
      </div>

      {/* Main Canvas + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Canvas Visualizer Box */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 min-h-[420px] relative flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
          
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
              <span className="text-xs font-mono text-slate-300">Entity Topology Visualizer</span>
            </div>

            <div className="flex items-center gap-1.5 bg-obsidian-900/80 p-1 rounded-xl border border-obsidian-800">
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Graph Node Clusters Mock */}
          <div className="my-auto py-12 relative flex items-center justify-center">
            
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#00f2fe" strokeWidth="2" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#10b981" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#7928ca" strokeWidth="2" />
              <line x1="25%" y1="25%" x2="20%" y2="75%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4" />
            </svg>

            {/* Central Node */}
            <div
              onClick={() => setSelectedNode({
                id: 'node-1',
                label: 'Attendance Policy (Section 4.2)',
                type: 'Document Section',
                connectedTo: ['75% Mandatory Threshold', 'Medical Condonation (65%-74%)', 'Final Exam Eligibility'],
                summary: 'Core regulation mandating aggregate physical attendance for end-semester examinations.',
              })}
              className="relative z-10 flex flex-col items-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-accent-cyan p-1 shadow-glow-cyan transform hover:scale-110 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-obsidian-950 rounded-full flex items-center justify-center">
                  <Network className="w-7 h-7 text-accent-cyan" />
                </div>
              </div>
              <span className="mt-2 text-xs font-mono font-bold text-accent-cyan bg-obsidian-900/90 px-2.5 py-1 rounded-full border border-accent-cyan/30">
                Attendance Policy
              </span>
            </div>

            {/* Satellite Nodes */}
            <div
              onClick={() => setSelectedNode({
                id: 'node-2',
                label: '75% Mandatory Threshold',
                type: 'Clause Rule',
                connectedTo: ['Attendance Policy (Section 4.2)', 'Final Exam Eligibility'],
                summary: 'Mandatory minimum aggregate physical or hybrid attendance required for end semester exam admission.',
              })}
              className="absolute top-6 left-12 flex flex-col items-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="mt-1 text-[10px] font-mono text-emerald-400">75% Threshold</span>
            </div>

            <div
              onClick={() => setSelectedNode({
                id: 'node-3',
                label: 'Medical Condonation',
                type: 'Procedure',
                connectedTo: ['Attendance Policy (Section 4.2)', 'Chief Medical Officer Certificate'],
                summary: 'Procedure for attendance relaxation between 65% and 74% upon valid medical emergency.',
              })}
              className="absolute top-6 right-12 flex flex-col items-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400 hover:scale-110 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <span className="mt-1 text-[10px] font-mono text-purple-400">Condonation</span>
            </div>

            <div
              onClick={() => setSelectedNode({
                id: 'node-4',
                label: 'Final Exam Eligibility',
                type: 'Outcome Node',
                connectedTo: ['Attendance Policy (Section 4.2)', '75% Mandatory Threshold'],
                summary: 'Official hall ticket issuance rule for semester end assessments.',
              })}
              className="absolute bottom-6 flex flex-col items-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="mt-1 text-[10px] font-mono text-amber-400">Exam Eligibility</span>
            </div>

          </div>

          <div className="text-[11px] font-mono text-slate-400 z-10 flex items-center justify-between border-t border-obsidian-800 pt-3">
            <span>Graph Layout: Force-Directed Entity Topology</span>
            <span>Scale: 1.0x</span>
          </div>
        </div>

        {/* Node Detail Inspector */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-obsidian-800">
            Selected Entity Inspector
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Node Title</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedNode.label}</div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Entity Classification</span>
              <div className="font-mono text-accent-cyan mt-0.5">{selectedNode.type}</div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Description</span>
              <p className="text-slate-600 dark:text-slate-300 font-sans mt-0.5 leading-relaxed">
                {selectedNode.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-obsidian-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Connected Relationships</span>
              <div className="mt-2 space-y-1.5">
                {selectedNode.connectedTo.map((rel, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>{rel}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
