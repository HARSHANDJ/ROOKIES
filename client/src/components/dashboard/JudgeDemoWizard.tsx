import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Database, 
  AlertTriangle, 
  Play, 
  BarChart3,
  Bot
} from 'lucide-react';
import type { DashboardTab } from '../../types';

interface JudgeDemoWizardProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: DashboardTab) => void;
  onRunQuery: (query: string) => void;
}

export const JUDGE_DEMO_STEPS = [
  {
    stepNumber: 1,
    title: 'Select Active Sample Knowledge Base',
    subtitle: 'Partitioned Vector Datasets',
    description: 'KnowSphere AI indexes institutional handbooks, evaluation codes, and policy circulars into vector space.',
    actionLabel: 'Select Academic Policy Dataset',
    targetTab: 'datasets' as DashboardTab,
    icon: Database,
  },
  {
    stepNumber: 2,
    title: 'Ask an In-Domain Question',
    subtitle: 'Known Institutional Query',
    description: 'Ask: "What is the minimum attendance requirement for final exam eligibility?"',
    actionLabel: 'Submit Known Question',
    targetTab: 'ask' as DashboardTab,
    sampleQuery: 'What is the minimum attendance requirement for final exam eligibility?',
    icon: Bot,
  },
  {
    stepNumber: 3,
    title: 'Inspect Grounded Answer & Trust Meter',
    subtitle: 'Zero-Hallucination Evidence',
    description: 'Observe the 100% Grounded Answer card, vector similarity score (68.6%), and evidence strength indicators.',
    actionLabel: 'Inspect Trust Meter',
    targetTab: 'ask' as DashboardTab,
    icon: ShieldCheck,
  },
  {
    stepNumber: 4,
    title: 'Verify Cited Source Metadata',
    subtitle: 'Verifiable Document Citations',
    description: 'Each answer pill attributes the exact document name, page number, and chunk index.',
    actionLabel: 'Highlight Source Pills',
    targetTab: 'ask' as DashboardTab,
    icon: Sparkles,
  },
  {
    stepNumber: 5,
    title: 'Open Answer Forensics Audit Drawer',
    subtitle: '5-Stage Reasoning Lineage',
    description: 'Inspect the complete 5-stage trace: Query Mapping → Candidate Extraction → Cosine Ranking → Boundary Verification → Grounded Synthesis.',
    actionLabel: 'Open Answer Forensics',
    targetTab: 'ask' as DashboardTab,
    icon: Layers,
  },
  {
    stepNumber: 6,
    title: 'Ask an Out-of-Domain Question',
    subtitle: 'Testing Boundary Enforcement',
    description: 'Ask: "What is the campus quantum physics rocket propulsion policy?"',
    actionLabel: 'Submit Out-of-Domain Question',
    targetTab: 'ask' as DashboardTab,
    sampleQuery: 'What is the campus quantum physics rocket propulsion policy?',
    icon: Compass,
  },
  {
    stepNumber: 7,
    title: 'Demonstrate Refusal & Zero-Guess Fallback',
    subtitle: 'Enforcing Knowledge Limits',
    description: 'Notice that the AI refuses to guess or hallucinate, returning: "I couldn\'t find enough information in the provided knowledge base to answer this accurately."',
    actionLabel: 'Verify Refusal Behavior',
    targetTab: 'ask' as DashboardTab,
    icon: ShieldCheck,
  },
  {
    stepNumber: 8,
    title: 'Demonstrate Contradiction Radar',
    subtitle: 'Conflicting Information Detection',
    description: 'Observe how the system flags a ⚠ Potential Knowledge Conflict when 75% Handbook rule collides with 80% Honours Circular.',
    actionLabel: 'Highlight Contradiction Alert',
    targetTab: 'ask' as DashboardTab,
    icon: AlertTriangle,
  },
  {
    stepNumber: 9,
    title: 'Explore Interactive Knowledge Graph',
    subtitle: 'Topology Node Connections',
    description: 'Navigate the visual topology mapping: Document → Topic → Entity/Rule → Chunk.',
    actionLabel: 'Open Knowledge Graph',
    targetTab: 'graph' as DashboardTab,
    icon: Compass,
  },
  {
    stepNumber: 10,
    title: 'Review System Evaluation Statistics',
    subtitle: 'Platform Verification Complete',
    description: 'KnowSphere AI is an auditable Knowledge Intelligence & Verification Platform.',
    actionLabel: 'Finish Judge Demo',
    targetTab: 'analytics' as DashboardTab,
    icon: BarChart3,
  },
];

export const JudgeDemoWizard: React.FC<JudgeDemoWizardProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onRunQuery,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentStep = JUDGE_DEMO_STEPS[currentStepIndex];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < JUDGE_DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStep = JUDGE_DEMO_STEPS[nextIdx];
      setActiveTab(nextStep.targetTab);
      if (nextStep.sampleQuery) {
        onRunQuery(nextStep.sampleQuery);
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setActiveTab(JUDGE_DEMO_STEPS[prevIdx].targetTab);
    }
  };

  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass-card bg-white dark:bg-obsidian-900 rounded-3xl p-6 sm:p-8 border border-brand-500/40 max-w-2xl w-full space-y-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-obsidian-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan p-0.5 shadow-md">
              <div className="w-full h-full bg-obsidian-950 rounded-[14px] flex items-center justify-center text-accent-cyan">
                <Play className="w-5 h-5 ml-0.5" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase font-bold text-accent-cyan tracking-wider">
                Guided Demonstration Tour
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                KnowSphere AI Judge Demo Mode
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500">
              Demonstration Step <strong className="text-brand-600 dark:text-accent-cyan">#{currentStep.stepNumber}</strong> of 10
            </span>
            <span className="font-bold text-emerald-500">{currentStep.subtitle}</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-obsidian-800 overflow-hidden flex">
            {JUDGE_DEMO_STEPS.map((s, idx) => (
              <div
                key={s.stepNumber}
                className={`h-full flex-1 border-r border-obsidian-900 transition-all duration-300 ${
                  idx <= currentStepIndex ? 'bg-gradient-to-r from-brand-600 to-accent-cyan' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Active Step Content Card */}
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 space-y-4 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 shrink-0">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                {currentStep.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Module: {currentStep.targetTab.toUpperCase()}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-sans leading-relaxed">
            {currentStep.description}
          </p>

          {currentStep.sampleQuery && (
            <div className="p-3 rounded-xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 text-xs font-mono text-brand-600 dark:text-accent-cyan">
              Query: "{currentStep.sampleQuery}"
            </div>
          )}
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab(currentStep.targetTab);
                if (currentStep.sampleQuery) {
                  onRunQuery(currentStep.sampleQuery);
                }
              }}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-800 dark:text-slate-100 bg-slate-200 dark:bg-obsidian-800 hover:bg-slate-300 dark:hover:bg-obsidian-700 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{currentStep.actionLabel}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-accent-cyan hover:opacity-95 transition-all flex items-center gap-2 shadow-md"
            >
              <span>{currentStepIndex === JUDGE_DEMO_STEPS.length - 1 ? 'Finish Demo' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
