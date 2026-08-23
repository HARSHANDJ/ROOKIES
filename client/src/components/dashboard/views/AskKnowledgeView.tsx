import React, { useState } from 'react';
import { Search, Send, Sparkles, ShieldCheck, FileText, ExternalLink, RefreshCw } from 'lucide-react';

export const AskKnowledgeView: React.FC = () => {
  const [query, setQuery] = useState<string>('What is the minimum attendance requirement for final exam eligibility?');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState({
    answer: "According to Section 4.2 of the Student Handbook 2026, students must maintain a minimum of 75% attendance in all registered courses to be eligible to sit for semester examinations. Students between 65% and 74% attendance may submit a medical condonation application.",
    document: "College Student Handbook 2026",
    section: "Section 4.2 • Attendance & Examination Regulations",
    page: "Page 18 • Clause 4.2.1",
    excerpt: "Clause 4.2.1: Full eligibility for end-semester examinations mandates a minimum 75% aggregate physical/hybrid attendance.",
    confidence: 99.4,
    verified: true,
  });

  const suggestions = [
    "What is the minimum attendance requirement for final exam eligibility?",
    "What are the official grounds for grade re-evaluation?",
    "What is the course withdrawal policy without academic penalty?",
    "What are the library late return fees for reference textbooks?",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Simulate answer lookup
      if (query.toLowerCase().includes('library')) {
        setActiveResult({
          answer: "As per the Library & Learning Center Guidelines, standard textbooks incur a late fee of $1 per day after the due date. Reference volumes incur a fine of $5 per day.",
          document: "Library Policy Manual 2026",
          section: "Section 2.3 • Overdue Penalties",
          page: "Page 6 • Clause 2.3.4",
          excerpt: "Clause 2.3.4: Overdue textbook items trigger a daily $1.00 assessment up to a maximum of $50.",
          confidence: 98.9,
          verified: true,
        });
      } else if (query.toLowerCase().includes('grade') || query.toLowerCase().includes('eval')) {
        setActiveResult({
          answer: "Students may request a formal re-evaluation of final exam grades within 10 days of transcript issuance by submitting Form Academic-E4 and paying the evaluation processing fee.",
          document: "Academic Regulations Code",
          section: "Section 9.4 • Grade Appeals",
          page: "Page 34 • Clause 9.4.1",
          excerpt: "Clause 9.4.1: Appeals against end-semester evaluation must be filed within 10 calendar days of result publication.",
          confidence: 99.1,
          verified: true,
        });
      } else {
        setActiveResult({
          answer: "According to Section 4.2 of the Student Handbook 2026, students must maintain a minimum of 75% attendance in all registered courses to be eligible to sit for semester examinations.",
          document: "College Student Handbook 2026",
          section: "Section 4.2 • Attendance & Examination Regulations",
          page: "Page 18 • Clause 4.2.1",
          excerpt: "Clause 4.2.1: Full eligibility for end-semester examinations mandates a minimum 75% aggregate physical/hybrid attendance.",
          confidence: 99.4,
          verified: true,
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Input Bar */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 shadow-inner">
            <Search className="w-5 h-5 text-brand-500 dark:text-accent-cyan ml-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask any natural language question from active college document set..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 font-sans"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-violet hover:opacity-95 transition-all flex items-center gap-2 shadow-md"
            >
              {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Query Knowledge</span>
            </button>
          </div>
        </form>

        {/* Prompt Suggestions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Try Asking:</span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(s)}
              className="text-[11px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-900 text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-accent-cyan border border-slate-200 dark:border-obsidian-800 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workbench View: Grounded Answer + Citation Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Answer Box */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-obsidian-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
              <Sparkles className="w-4 h-4 text-brand-500 dark:text-accent-cyan" />
              <span>Grounded Knowledge Response</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> VERIFIED 99.4%
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/40 text-slate-800 dark:text-slate-100 leading-relaxed font-sans text-sm sm:text-base">
            {activeResult.answer}
          </div>

          {/* Verification Guarantee Footer */}
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-obsidian-950/70 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero-Guess Protocol Enforced: Relies strictly on document set.</span>
            </div>
            <span className="font-mono text-[10px]">Latency: 142ms</span>
          </div>
        </div>

        {/* Right Column: Citation Inspector Sidebar */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-obsidian-800">
            <h3 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-500" />
              Citation & Source Inspector
            </h3>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Target Document</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeResult.document}</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Section & Page</div>
              <div className="font-mono text-brand-600 dark:text-accent-cyan mt-0.5">{activeResult.section}</div>
              <div className="text-[11px] text-slate-500">{activeResult.page}</div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Exact Passage Highlight</div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 italic leading-normal border-l-2 border-brand-500">
                "{activeResult.excerpt}"
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
