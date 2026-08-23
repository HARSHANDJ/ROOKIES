import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  RefreshCw, 
  Compass, 
  Layers, 
  AlertTriangle, 
  BarChart3,
  Bot,
  MessageSquare
} from 'lucide-react';
import { api } from '../../../services/api';
import type { 
  ChatMessage, 
  GroundedAnswerResult, 
  DatasetItem, 
  ForensicsLineage, 
  KnowledgeBoundaryData 
} from '../../../types';
import { AnswerForensicsPanel } from '../AnswerForensicsPanel';
import { KnowledgeBoundaryModal } from '../KnowledgeBoundaryModal';

interface AskKnowledgeViewProps {
  initialQuery?: string | null;
}

export const AskKnowledgeView: React.FC<AskKnowledgeViewProps> = ({ initialQuery }) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [selectedDataset, setSelectedDataset] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Datasets state
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);

  // Chat messages history
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Answer Forensics drawer state
  const [activeForensics, setActiveForensics] = useState<ForensicsLineage | null>(null);
  const [showForensics, setShowForensics] = useState<boolean>(false);

  // Knowledge Boundary modal state
  const [boundaryData, setBoundaryData] = useState<KnowledgeBoundaryData | null>(null);
  const [showBoundary, setShowBoundary] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Handle Judge Demo triggered query
  useEffect(() => {
    if (initialQuery) {
      handleAskQuestion(initialQuery);
    }
  }, [initialQuery]);

  // Load initial dataset metadata & knowledge boundary data
  useEffect(() => {
    Promise.all([api.getDatasets(), api.getKnowledgeBoundary()])
      .then(([ds, bound]) => {
        setDatasets(ds);
        setBoundaryData(bound);
      })
      .catch((err) => console.warn('Initialization error:', err));

    // Run initial seed conversation message
    handleAskQuestion('What is the minimum attendance requirement for final exam eligibility?');
  }, []);

  const handleAskQuestion = async (queryToAsk: string) => {
    if (!queryToAsk.trim() || isGenerating) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: queryToAsk.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const result: GroundedAnswerResult = await api.askChatQuestion(queryToAsk, selectedDataset);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedResult: result,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Ask Chat Error:', err);
      setErrorMsg(err.message || 'Failed to generate grounded response.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(inputQuery);
  };

  const openForensics = (forensics: ForensicsLineage) => {
    setActiveForensics(forensics);
    setShowForensics(true);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* Top Header Controls Bar */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-obsidian-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan p-0.5 shadow-md">
            <div className="w-full h-full bg-obsidian-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-cyan" />
            </div>
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Ask Knowledge Grounded Workbench
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Strict Zero-Out-of-Domain RAG Assistant with Trust Meter & Lineage Forensics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dataset Selector */}
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Datasets</option>
            {datasets.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.title}
              </option>
            ))}
          </select>

          {/* Knowledge Boundary Button */}
          <button
            onClick={() => setShowBoundary(true)}
            className="px-3.5 py-2 rounded-xl font-bold text-xs text-brand-600 dark:text-accent-cyan bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Knowledge Boundary</span>
          </button>
        </div>
      </div>

      {/* Main Chat Feed Container */}
      <div className="flex-1 glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 flex flex-col justify-between overflow-hidden shadow-inner bg-slate-50/40 dark:bg-obsidian-950/40">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <Bot className="w-12 h-12 text-brand-500 animate-pulse" />
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Grounded Knowledge Assistant Ready
              </h3>
              <p className="text-xs text-slate-500 max-w-md">
                Ask any question from the active institutional knowledge base. The assistant strictly enforces zero-hallucination rules.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Assistant Icon */}
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-0.5 shrink-0 mt-1">
                  <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center text-accent-cyan">
                    <Bot className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* User Bubble */}
              {msg.sender === 'user' ? (
                <div className="max-w-2xl bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-3xl rounded-tr-sm p-4 text-sm font-sans shadow-md">
                  {msg.text}
                </div>
              ) : (
                /* Assistant Distinctive Grounded Answer Card */
                msg.groundedResult && (
                  <div className="max-w-3xl w-full space-y-4">
                    <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-obsidian-800 space-y-5 bg-white/90 dark:bg-obsidian-900/90 shadow-xl">
                      
                      {/* Card Header & Status Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-obsidian-800">
                        <div className="flex items-center gap-2 font-display font-bold text-xs text-slate-900 dark:text-white">
                          <Sparkles className="w-4 h-4 text-brand-500 dark:text-accent-cyan" />
                          <span>Grounded Knowledge Response</span>
                        </div>

                        {msg.groundedResult.isKnown ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> 100% GROUNDED EVIDENCED
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> BOUNDARY FALLBACK ENFORCED
                          </span>
                        )}
                      </div>

                      {/* Grounded Answer Content Box */}
                      <div className={`p-5 rounded-2xl text-sm sm:text-base leading-relaxed font-sans border ${
                        msg.groundedResult.isKnown 
                          ? 'bg-brand-50/50 dark:bg-brand-950/20 border-brand-200 dark:border-brand-900/40 text-slate-900 dark:text-slate-100'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200'
                      }`}>
                        {msg.groundedResult.answer}
                      </div>

                      {/* CONTRADICTION RADAR CARD */}
                      {msg.groundedResult.contradictionAlert?.hasContradiction && (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-3">
                          <div className="flex items-center gap-2 font-display font-bold text-xs text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                            <span>⚠ CONTRADICTION RADAR: Potential Knowledge Conflict Detected</span>
                          </div>

                          <p className="text-xs text-amber-900 dark:text-amber-200 font-sans leading-relaxed">
                            {msg.groundedResult.contradictionAlert.description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {msg.groundedResult.contradictionAlert.sourceA && (
                              <div className="p-3 rounded-xl bg-white/80 dark:bg-obsidian-950/80 border border-amber-500/20 text-xs space-y-1 font-mono">
                                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
                                  Source A: {msg.groundedResult.contradictionAlert.sourceA.documentName}
                                </div>
                                <p className="text-slate-800 dark:text-slate-200">
                                  "{msg.groundedResult.contradictionAlert.sourceA.extractedClaim}"
                                </p>
                              </div>
                            )}

                            {msg.groundedResult.contradictionAlert.sourceB && (
                              <div className="p-3 rounded-xl bg-white/80 dark:bg-obsidian-950/80 border border-amber-500/20 text-xs space-y-1 font-mono">
                                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
                                  Source B: {msg.groundedResult.contradictionAlert.sourceB.documentName}
                                </div>
                                <p className="text-slate-800 dark:text-slate-200">
                                  "{msg.groundedResult.contradictionAlert.sourceB.extractedClaim}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 1. TRUST METER FEATURE WIDGET */}
                      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-obsidian-950/80 border border-slate-200 dark:border-obsidian-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <BarChart3 className="w-4 h-4 text-brand-500" />
                            Grounding Evidence Trust Meter
                          </span>
                          <span className="font-mono text-xs font-bold text-emerald-500">
                            {msg.groundedResult.trustMeter.trustScore}% Score
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-obsidian-800 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              msg.groundedResult.trustMeter.trustScore >= 60
                                ? 'bg-gradient-to-r from-emerald-500 to-accent-cyan'
                                : 'bg-gradient-to-r from-amber-500 to-rose-500'
                            }`}
                            style={{ width: `${Math.max(10, msg.groundedResult.trustMeter.trustScore)}%` }}
                          />
                        </div>

                        {/* Metrics Pills */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <div className="p-2 rounded-xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 text-center">
                            <div className="text-[9px] font-mono uppercase text-slate-400">Retrieval Relevance</div>
                            <div className="font-mono font-bold text-xs text-brand-600 dark:text-accent-cyan mt-0.5">
                              {msg.groundedResult.trustMeter.relevancePercent}
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 text-center">
                            <div className="text-[9px] font-mono uppercase text-slate-400">Evidence Strength</div>
                            <div className={`font-mono font-bold text-xs mt-0.5 ${
                              msg.groundedResult.trustMeter.evidenceStrength === 'Strong Evidence' ? 'text-emerald-500' : 'text-amber-500'
                            }`}>
                              {msg.groundedResult.trustMeter.evidenceStrength}
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 text-center">
                            <div className="text-[9px] font-mono uppercase text-slate-400">Source Coverage</div>
                            <div className="font-mono font-semibold text-[10px] text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-1">
                              {msg.groundedResult.trustMeter.sourceCoverage}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cited Sources & Action Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        
                        {/* Source Tag Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">Cited Sources:</span>
                          {msg.groundedResult.sources.length > 0 ? (
                            msg.groundedResult.sources.map((src, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3 text-brand-500" />
                                {src.documentName} (Pg {src.pageNumber})
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 italic">None (Out of Domain)</span>
                          )}
                        </div>

                        {/* 2. ANSWER FORENSICS FEATURE BUTTON */}
                        <button
                          onClick={() => openForensics(msg.groundedResult!.forensics)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:opacity-95 transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>View Answer Forensics</span>
                        </button>
                      </div>

                    </div>
                  </div>
                )
              )}

            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono py-2">
              <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
              <span>Scanning vector index & synthesizing grounded answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Prompt Suggestions */}
        <div className="pt-4 border-t border-slate-200 dark:border-obsidian-800 space-y-3 shrink-0">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 shadow-sm">
              <MessageSquare className="w-4 h-4 text-brand-500 ml-2" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any question to test grounded knowledge retrieval..."
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !inputQuery.trim()}
              className="px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-cyan hover:opacity-95 transition-all flex items-center gap-2 shadow-md disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Assistant</span>
            </button>
          </form>

          {/* Quick Prompt Test Chips (Includes In-Domain & Out-of-Domain) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] font-mono text-slate-400 mr-1">Test Scenarios:</span>

            {/* In-Domain Queries */}
            <button
              onClick={() => handleAskQuestion('What is the minimum attendance requirement for final exam eligibility?')}
              className="text-[11px] px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-mono"
            >
              [In-Domain] Attendance 75% Rule
            </button>

            <button
              onClick={() => handleAskQuestion('What are the official grounds for grade re-evaluation?')}
              className="text-[11px] px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-mono"
            >
              [In-Domain] Grade Appeals
            </button>

            {/* Out-of-Domain Queries (Testing Fallback) */}
            <button
              onClick={() => handleAskQuestion('What is the campus quantum physics rocket propulsion policy?')}
              className="text-[11px] px-3 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-mono"
            >
              [Out-of-Domain] Rocket Propulsion Policy
            </button>

            <button
              onClick={() => handleAskQuestion('What are the university cafeteria meal plan rates?')}
              className="text-[11px] px-3 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-mono"
            >
              [Out-of-Domain] Cafeteria Meal Rates
            </button>
          </div>

        </div>

      </div>

      {/* 2. ANSWER FORENSICS PANEL DRAWER */}
      <AnswerForensicsPanel
        isOpen={showForensics}
        onClose={() => setShowForensics(false)}
        forensics={activeForensics}
      />

      {/* 3. KNOWLEDGE BOUNDARY MODAL */}
      <KnowledgeBoundaryModal
        isOpen={showBoundary}
        onClose={() => setShowBoundary(false)}
        boundary={boundaryData}
        onSelectTopic={(topic) => handleAskQuestion(`What is the policy regarding ${topic}?`)}
      />

    </div>
  );
};
