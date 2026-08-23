import React, { useState } from 'react';
import { Search, Sparkles, FileText, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoSample {
  question: string;
  answer: string;
  sourceDoc: string;
  sourceSection: string;
  quotedText: string;
  isSupported: boolean;
  confidence: number;
}

export const ExploreDemo: React.FC = () => {
  const navigate = useNavigate();

  const samples: DemoSample[] = [
    {
      question: "What is the deadline for dropping a course without academic penalty?",
      answer: "Students may drop any elective course without academic penalty within the first 3 weeks of the semester (by 5:00 PM on Friday of Week 3).",
      sourceDoc: "College Student Handbook 2026",
      sourceSection: "Section 3.4 • Registration & Course Adjustments",
      quotedText: "Clause 3.4.2: Course withdrawal without academic penalty is permitted up to 5:00 PM on Friday of Week 3.",
      isSupported: true,
      confidence: 99.8,
    },
    {
      question: "What are the rules for requesting a makeup exam for illness?",
      answer: "A student who misses a mid-semester examination due to medical emergencies must submit an official medical certificate signed by the Chief Medical Officer within 48 hours.",
      sourceDoc: "Academic Regulations & Evaluation Code",
      sourceSection: "Section 8.1 • Examinations & Absenteeism",
      quotedText: "Clause 8.1.5: Medical makeup examination requests require CMO certified documentation within 48 hours of exam date.",
      isSupported: true,
      confidence: 98.6,
    },
    {
      question: "What is the tuition fee discount for international exchange programs in 2027?",
      answer: "I do not have sufficient information in the provided document set to answer this question. The current handbook only covers academic policies for 2026 and does not mention 2027 exchange tuition rates.",
      sourceDoc: "None (Out of Context Boundary)",
      sourceSection: "System Fallback Triggered",
      quotedText: "No matching clause found in active document collection.",
      isSupported: false,
      confidence: 0,
    },
  ];

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const current = samples[activeIdx];

  return (
    <section id="demo" className="py-20 relative bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE DEMO PREVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Test the Grounding Engine
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Select a sample natural language question to see how KnowSphere AI extracts verified passages or explicitly triggers zero-guess fallback.
          </p>
        </div>

        {/* Sample Question Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto mb-10">
          {samples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                activeIdx === idx
                  ? 'bg-brand-600 text-white border-accent-cyan shadow-lg shadow-brand-500/30'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {s.question}
            </button>
          ))}
        </div>

        {/* Live Interactive Preview Box */}
        <div className="max-w-4xl mx-auto bg-obsidian-950 border border-obsidian-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
          {/* Query Bar */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 mb-6">
            <Search className="w-5 h-5 text-accent-cyan" />
            <span className="text-sm sm:text-base font-semibold text-white font-sans">
              {current.question}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Answer Display */}
            <div className="md:col-span-2 space-y-4">
              <div className={`p-5 rounded-2xl border ${
                current.isSupported
                  ? 'bg-brand-950/40 border-brand-800/80 text-slate-200'
                  : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${
                    current.isSupported ? 'text-accent-cyan' : 'text-amber-400'
                  }`}>
                    {current.isSupported ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {current.isSupported ? 'VERIFIED GROUNDED RESPONSE' : 'EXPLICIT NON-GUESS FALLBACK'}
                  </span>

                  {current.isSupported && (
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      {current.confidence}% Match
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed font-sans">
                  {current.answer}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Source Isolation Active
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-accent-cyan font-semibold hover:underline flex items-center gap-1"
                >
                  Open Full Dashboard →
                </button>
              </div>
            </div>

            {/* Citation & Source Inspector */}
            <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-400" />
                  PROVENANCE DATA
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Target Document</div>
                  <div className="text-xs font-semibold text-white">{current.sourceDoc}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Section Reference</div>
                  <div className="text-xs font-mono text-brand-300">{current.sourceSection}</div>
                </div>

                <div className="pt-2 border-t border-obsidian-800">
                  <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Exact Passage Highlight</div>
                  <div className="text-xs text-slate-300 font-mono p-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 italic leading-snug">
                    "{current.quotedText}"
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
