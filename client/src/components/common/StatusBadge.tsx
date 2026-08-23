import React from 'react';
import { ShieldCheck, Database, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'connected' | 'disconnected' | 'verified' | 'warning';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  if (status === 'connected' || status === 'verified') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        {status === 'verified' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Database className="w-3.5 h-3.5" />}
        <span>{label || (status === 'verified' ? '100% Verifiable' : 'MongoDB Connected')}</span>
      </div>
    );
  }

  if (status === 'warning') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <AlertCircle className="w-3.5 h-3.5" />
        <span>{label || 'Fallback Mode'}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      <Database className="w-3.5 h-3.5" />
      <span>{label || 'DB Standby'}</span>
    </div>
  );
};
