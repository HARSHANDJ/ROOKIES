import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Play } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { StatusBadge } from '../common/StatusBadge';
import type { SystemHealth } from '../../types';

interface DashboardHeaderProps {
  title: string;
  onLaunchJudgeDemo?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, onLaunchJudgeDemo }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      } else {
        setHealth(null);
      }
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-obsidian-800 bg-white/80 dark:bg-obsidian-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
      
      {/* Title */}
      <div className="flex items-center gap-4">
        <h1 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize">
          {title}
        </h1>

        {/* DB Connection Health Badge */}
        {health?.database.isConnected ? (
          <StatusBadge status="connected" label={`MongoDB (${health.database.name || 'knowsphere'})`} />
        ) : (
          <StatusBadge status="warning" label="DB Standby Mode" />
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* LAUNCH JUDGE DEMO BUTTON */}
        {onLaunchJudgeDemo && (
          <button
            onClick={onLaunchJudgeDemo}
            className="px-4 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-cyan hover:opacity-95 transition-all flex items-center gap-1.5 shadow-md animate-pulse"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>LAUNCH JUDGE DEMO</span>
          </button>
        )}

        {/* Quick Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 text-xs text-slate-400">
          <Search className="w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search documents or queries..."
            className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 w-40"
          />
        </div>

        {/* Refresh DB Status Button */}
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
          title="Check Server & MongoDB Connection"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-500' : ''}`} />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-obsidian-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center text-white text-xs font-bold shadow">
            KS
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200">Admin Lead</div>
            <div className="text-[10px] text-slate-400 font-mono">Knowledge Lead</div>
          </div>
        </div>

      </div>

    </header>
  );
};
