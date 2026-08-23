import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-obsidian-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan p-0.5 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-accent-cyan" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-wider text-slate-900 dark:text-white flex items-center gap-1">
              KNOWSPHERE <span className="text-accent-cyan text-sm font-semibold px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight -mt-1">
              VERIFIABLE KNOWLEDGE CORE
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#how-it-works" className="hover:text-brand-500 dark:hover:text-accent-cyan transition-colors">
            How It Works
          </a>
          <a href="#trust-concept" className="hover:text-brand-500 dark:hover:text-accent-cyan transition-colors flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Verification Engine
          </a>
          <a href="#features" className="hover:text-brand-500 dark:hover:text-accent-cyan transition-colors">
            Platform Features
          </a>
          <a href="#demo" className="hover:text-brand-500 dark:hover:text-accent-cyan transition-colors">
            Interactive Demo
          </a>
        </nav>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-obsidian-700 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-accent-cyan" />
            Explore Demo
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-violet hover:opacity-95 shadow-md shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
