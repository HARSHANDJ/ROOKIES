import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Files, 
  Database, 
  Network, 
  BarChart3, 
  TestTube2, 
  BrainCircuit, 
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DashboardTab } from '../../types';


interface DashboardSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'ask' as DashboardTab, label: 'Ask Knowledge', icon: MessageSquareText, badge: 'Core' },
    { id: 'documents' as DashboardTab, label: 'Documents', icon: Files },
    { id: 'datasets' as DashboardTab, label: 'Datasets', icon: Database },
    { id: 'graph' as DashboardTab, label: 'Knowledge Graph', icon: Network },
    { id: 'analytics' as DashboardTab, label: 'Analytics', icon: BarChart3 },
    { id: 'eval-lab' as DashboardTab, label: 'Evaluation Lab', icon: TestTube2, badge: 'Lab' },
  ];

  return (
    <aside className="w-64 bg-white/90 dark:bg-obsidian-900/90 border-r border-slate-200 dark:border-obsidian-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 backdrop-blur-xl">
      
      {/* Top Header & Brand */}
      <div>
        <div className="p-4 border-b border-slate-200 dark:border-obsidian-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan p-0.5 shadow-md">
              <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-accent-cyan" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-extrabold text-sm tracking-wide text-slate-900 dark:text-white flex items-center gap-1">
                KNOWSPHERE <span className="text-[10px] text-accent-cyan font-mono px-1 rounded bg-brand-500/10">AI</span>
              </h2>
              <p className="text-[10px] font-mono text-slate-400">Milestone 1 Core</p>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="px-3 pt-3">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Landing</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-4 space-y-1">
          <div className="px-3 text-[10px] font-mono font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2">
            Workspace Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-obsidian-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-200 dark:border-obsidian-800">
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <span>Platform Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Grounding Engine Ready
          </p>
        </div>
      </div>

    </aside>
  );
};
