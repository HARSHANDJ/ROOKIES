import React from 'react';
import { Database, ShieldCheck, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import type { DatasetItem } from '../../../types';

export const DatasetsView: React.FC = () => {
  const datasets: DatasetItem[] = [
    {
      id: 'ds-1',
      title: 'College Student Handbook 2026',
      description: 'Official institutional handbook covering admission, attendance rules (75% threshold), grading codes, and discipline guidelines.',
      documentCount: 6,
      tags: ['Attendance', 'Grading', 'Discipline', 'Admissions'],
      size: '12.4 MB',
      verified: true,
    },
    {
      id: 'ds-2',
      title: 'Campus Academic FAQ Repository',
      description: 'Curated 150+ question-answer pairs covering course drops, condonation applications, medical leaves, and credit transfers.',
      documentCount: 4,
      tags: ['FAQs', 'Course Drop', 'Condonation', 'Credits'],
      size: '4.2 MB',
      verified: true,
    },
    {
      id: 'ds-3',
      title: 'Library & Digital Lab Guidelines',
      description: 'Borrowing limits, late fee structures ($1/day), lab reservations, and electronic journal access protocols.',
      documentCount: 3,
      tags: ['Library', 'Overdue Fees', 'Lab Access'],
      size: '2.8 MB',
      verified: true,
    },
    {
      id: 'ds-4',
      title: 'Examination & Evaluation Code',
      description: 'Formal exam rules, re-evaluation request windows (10 days), grading scales, and backlog examination procedures.',
      documentCount: 5,
      tags: ['Exams', 'Re-evaluation', 'Transcripts'],
      size: '8.1 MB',
      verified: true,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-obsidian-800">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-accent-cyan" />
            Sample Knowledge Datasets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Pre-packaged institutional document sets ready for instant zero-hallucination querying.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>4 Pre-Loaded Verified Sets</span>
        </div>
      </div>

      {/* Grid of Dataset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {datasets.map((ds) => (
          <div
            key={ds.id}
            className="glass-card-interactive rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-brand-600 dark:text-accent-cyan flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {ds.documentCount} Target Files ({ds.size})
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Grounding Verified
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                {ds.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed mb-4">
                {ds.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {ds.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-obsidian-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-obsidian-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Status: Active Ready</span>
              <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center gap-1.5">
                <span>Load Dataset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
