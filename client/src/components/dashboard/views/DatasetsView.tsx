import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../../services/api';
import type { DatasetItem } from '../../../types';

export const DatasetsView: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([
    {
      id: 'academic-policy',
      title: 'Academic Policy & Regulations',
      description: 'Official institutional handbook covering admission, attendance rules (75% threshold), grading codes, and discipline guidelines.',
      documentCount: 2,
      chunkCount: 14,
      tags: ['Attendance', 'Grading', 'Discipline', 'Admissions'],
      size: '12.4 MB',
      verified: true,
    },
    {
      id: 'campus-facilities',
      title: 'Campus Facilities & Library Policy',
      description: 'Borrowing limits, late fee structures ($1/day), lab reservations, and electronic journal access protocols.',
      documentCount: 1,
      chunkCount: 6,
      tags: ['Library', 'Overdue Fees', 'Lab Access'],
      size: '2.8 MB',
      verified: true,
    },
  ]);

  useEffect(() => {
    api.getDatasets()
      .then((apiDatasets) => {
        if (apiDatasets && apiDatasets.length > 0) {
          setDatasets((prev) => {
            const combined = [...apiDatasets];
            for (const item of prev) {
              if (!combined.some((d) => d.id === item.id)) {
                combined.push(item);
              }
            }
            return combined;
          });
        }
      })
      .catch((err) => console.warn('Dataset fetch fallback:', err));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-obsidian-800">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-accent-cyan" />
            Knowledge Base Datasets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Active knowledge dataset partitions ready for zero-hallucination semantic search.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>{datasets.length} Active Vector Datasets</span>
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
                  {ds.documentCount} Documents ({ds.chunkCount || 10} Chunks)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Grounding Indexed
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
              <span className="text-[11px] font-mono text-slate-400">Dataset ID: {ds.id}</span>
              <button
                onClick={() => alert(`Dataset "${ds.title}" is active and selected for semantic retrieval.`)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center gap-1.5"
              >
                <span>Active</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
