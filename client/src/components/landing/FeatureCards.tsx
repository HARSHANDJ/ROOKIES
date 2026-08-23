import React from 'react';
import { ShieldCheck, Network, FolderKanban, BarChart3, TestTube2, Sparkles, Database } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Strict Answer Grounding',
      description: 'Answers are generated strictly from target knowledge boundaries with mandatory paragraph quote citations.',
      badge: 'Zero Hallucination',
    },
    {
      icon: Network,
      title: 'Knowledge Graph Visualization',
      description: 'Explore relationships between handbook clauses, departmental rules, and academic topics in an interactive graph shell.',
      badge: 'Graph Engine',
    },
    {
      icon: FolderKanban,
      title: 'Multi-Document Ingestion',
      description: 'Manage college handbooks, FAQ sheets, and administrative policies in a structured document management table.',
      badge: 'Document Catalog',
    },
    {
      icon: Database,
      title: 'Pre-Packaged Sample Datasets',
      description: 'Test out-of-the-box knowledge sets including Academic Regulations 2026, Library Policy, and Campus FAQ.',
      badge: 'Sample Knowledge',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Verification Metrics',
      description: 'Monitor response grounding confidence, document citation rates, and query latency across all interactions.',
      badge: 'Metrics Suite',
    },
    {
      icon: TestTube2,
      title: 'Evaluation Laboratory',
      description: 'Run automated benchmarking suites to score factual accuracy, hallucination resistance, and precision.',
      badge: 'Benchmark Lab',
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-violet/10 text-accent-violet dark:text-accent-cyan border border-accent-violet/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTERPRISE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Built for Maximum Verifiability
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            Everything you need to deploy reliable, traceable AI query interfaces over complex institutional documentation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const IconComp = feat.icon;
            return (
              <div
                key={i}
                className="glass-card-interactive rounded-3xl p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-accent-cyan group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-obsidian-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-obsidian-800 flex items-center text-xs text-brand-600 dark:text-accent-cyan font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore Shell View</span>
                  <span className="ml-1">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
