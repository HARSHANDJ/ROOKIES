import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import type { DashboardTab } from '../../types';
import { OverviewView } from './views/OverviewView';
import { AskKnowledgeView } from './views/AskKnowledgeView';
import { DocumentsView } from './views/DocumentsView';
import { DatasetsView } from './views/DatasetsView';
import { KnowledgeGraphView } from './views/KnowledgeGraphView';
import { AnalyticsView } from './views/AnalyticsView';
import { EvalLabView } from './views/EvalLabView';
import { JudgeDemoWizard } from './JudgeDemoWizard';

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [showJudgeDemo, setShowJudgeDemo] = useState<boolean>(false);
  const [demoQuery, setDemoQuery] = useState<string | null>(null);

  const getTabTitle = (tab: DashboardTab) => {
    switch (tab) {
      case 'overview': return 'Platform Overview';
      case 'ask': return 'Ask Knowledge Workbench';
      case 'documents': return 'Document Catalog';
      case 'datasets': return 'Sample Datasets';
      case 'graph': return 'Knowledge Graph Topology';
      case 'analytics': return 'Grounding Analytics';
      case 'eval-lab': return 'Evaluation & Citation Lab';
      default: return 'Dashboard';
    }
  };

  const handleRunDemoQuery = (query: string) => {
    setDemoQuery(query);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView
            setActiveTab={setActiveTab}
            onLaunchJudgeDemo={() => setShowJudgeDemo(true)}
          />
        );
      case 'ask':
        return <AskKnowledgeView initialQuery={demoQuery} />;
      case 'documents':
        return <DocumentsView />;
      case 'datasets':
        return <DatasetsView />;
      case 'graph':
        return <KnowledgeGraphView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'eval-lab':
        return <EvalLabView />;
      default:
        return (
          <OverviewView
            setActiveTab={setActiveTab}
            onLaunchJudgeDemo={() => setShowJudgeDemo(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={getTabTitle(activeTab)}
          onLaunchJudgeDemo={() => setShowJudgeDemo(true)}
        />
        
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderActiveView()}
        </main>
      </div>

      {/* JUDGE DEMO WIZARD MODAL */}
      <JudgeDemoWizard
        isOpen={showJudgeDemo}
        onClose={() => setShowJudgeDemo(false)}
        setActiveTab={setActiveTab}
        onRunQuery={handleRunDemoQuery}
      />
    </div>
  );
};
