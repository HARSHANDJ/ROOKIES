import React from 'react';
import { BrainCircuit, ShieldCheck, Globe, Share2, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center text-white">
                <BrainCircuit className="w-4 h-4 text-obsidian-950" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-wider text-white">
                KNOWSPHERE <span className="text-accent-cyan text-xs">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              “Ask Anything. Trust Everything You Can Verify.”
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Hallucination Guaranteed
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="font-display font-semibold text-xs text-slate-200 tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li><a href="#how-it-works" className="hover:text-accent-cyan transition-colors">How It Works</a></li>
              <li><a href="#trust-concept" className="hover:text-accent-cyan transition-colors">Verification Architecture</a></li>
              <li><a href="#features" className="hover:text-accent-cyan transition-colors">Feature Suite</a></li>
              <li><a href="#demo" className="hover:text-accent-cyan transition-colors">Interactive Query Sandbox</a></li>
            </ul>
          </div>

          {/* Dashboard Modules */}
          <div>
            <h4 className="font-display font-semibold text-xs text-slate-200 tracking-wider uppercase mb-4">
              Dashboard Shell
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li><span className="hover:text-accent-cyan cursor-pointer">Ask Knowledge Workbench</span></li>
              <li><span className="hover:text-accent-cyan cursor-pointer">Document Ingestion Catalog</span></li>
              <li><span className="hover:text-accent-cyan cursor-pointer">Sample Datasets Hub</span></li>
              <li><span className="hover:text-accent-cyan cursor-pointer">Entity Knowledge Graph</span></li>
              <li><span className="hover:text-accent-cyan cursor-pointer">Evaluation & Citation Lab</span></li>
            </ul>
          </div>

          {/* Security & Verification */}
          <div>
            <h4 className="font-display font-semibold text-xs text-slate-200 tracking-wider uppercase mb-4">
              Verification Standards
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Designed for enterprise handbooks, college policies, and critical compliance documentation.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                <Layers className="w-4 h-4" />
              </span>
            </div>

          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KNOWSPHERE AI. Milestone 1 Foundation Release.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for zero-hallucination document intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
