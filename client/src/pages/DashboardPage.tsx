import React, { useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import type { DashboardTab } from '../types';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} />
  );
};
