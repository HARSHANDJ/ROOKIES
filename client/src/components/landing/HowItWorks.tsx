import React from 'react';
import { UploadCloud, GitFork, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: UploadCloud,
      title: 'Document Ingestion',
      description: 'Upload college handbooks, FAQ pages, course catalogues, or academic regulations in PDF, DOCX, or text format.',
      badge: 'Multi-Format Ingest',
      color: 'from-brand-500 to-cyan-500',
    },
    {
      num: '02',
      icon: GitFork,
      title: 'Knowledge Graphing',
      description: 'System parses sections, clauses, and domain entities into a structured knowledge graph representation.',
      badge: 'Structural Graphing',
      color: 'from-cyan-500 to-brand-600',
    },
    {
      num: '03',
      icon: Cpu,
      title: 'Grounded Query Pipeline',
      description: 'Natural language questions are mapped strictly against verified document passages with zero external assumptions.',
      badge: 'Zero-Hallucination Query',
      color: 'from-brand-600 to-accent-violet',
    },
    {
      num: '04',
      icon: ShieldCheck,
      title: 'Verifiable Citation',
      description: 'Receive accurate answers backed by instant highlighted quotes and exact paragraph & page references.',
      badge: 'Passage Highlight',
      color: 'from-accent-violet to-emerald-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative bg-slate-100/50 dark:bg-obsidian-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-accent-cyan border border-brand-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How KnowSphere Engine Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            From raw institutional documentation to pinpoint, audit-ready answer verification in four streamlined steps.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className="glass-card rounded-3xl p-6 relative flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-obsidian-700/80"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full text-white bg-gradient-to-r ${step.color} shadow-sm`}>
                      STEP {step.num}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400">
                      {step.badge}
                    </span>
                  </div>

                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-center text-brand-500 dark:text-accent-cyan mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-400 dark:text-obsidian-600">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
