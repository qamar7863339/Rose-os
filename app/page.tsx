'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import ChatWorkspace from '@/components/features/chat/ChatWorkspace';
import AgentModeWorkspace from '@/components/features/agent-mode/AgentModeWorkspace';
import AgentsView from '@/components/features/agents/AgentsView';
import OverviewView from '@/components/features/overview/OverviewView';
import ClientsView from '@/components/features/clients/ClientsView';
import ClientWorkspaceView from '@/components/features/clients/ClientWorkspaceView';
import ClientPortalView from '@/components/features/client-portal/ClientPortalView';
import CrmView from '@/components/features/crm/CrmView';
import ProjectsView from '@/components/features/projects/ProjectsView';
import AutomationsView from '@/components/features/automations/AutomationsView';
import IntegrationsView from '@/components/features/integrations/IntegrationsView';
import KnowledgeView from '@/components/features/knowledge/KnowledgeView';
import AnalyticsView from '@/components/features/analytics/AnalyticsView';
import BillingView from '@/components/features/billing/BillingView';
import SettingsView from '@/components/features/settings/SettingsView';
import HelpView from '@/components/features/help/HelpView';

import PublicPortalView from '@/components/features/public/PublicPortalView';

function ViewDispatcher() {
  const { currentView, userRole, userProfile, firebaseUser } = useApp();
  const isAuthenticated = Boolean(userProfile && firebaseUser);

  // If user is unauthenticated and tries to access private views, render PublicPortalView
  const isPrivateView =
    currentView.startsWith('business/') ||
    currentView.startsWith('automation/') ||
    currentView.startsWith('management/') ||
    currentView === 'settings';

  if (!isAuthenticated && isPrivateView) {
    return <PublicPortalView />;
  }

  // If in Client Portal View, render client interface
  if (userRole === 'client' || currentView.startsWith('client/')) {
    return <ClientPortalView />;
  }

  // Admin View Dispatcher
  switch (currentView) {
    case 'workspace/chat':
      return <ChatWorkspace />;
    case 'workspace/agent-mode':
      return <AgentModeWorkspace />;
    case 'workspace/agents':
      return <AgentsView />;
    case 'business/overview':
      return <OverviewView />;
    case 'business/clients':
      return <ClientsView />;
    case 'business/client-workspace':
      return <ClientWorkspaceView />;
    case 'business/crm':
      return <CrmView />;
    case 'business/projects':
    case 'business/tasks':
      return <ProjectsView />;
    case 'automation/automations':
    case 'automation/workflows':
      return <AutomationsView />;
    case 'automation/connectors':
    case 'automation/integrations':
      return <IntegrationsView />;
    case 'management/knowledge':
      return <KnowledgeView />;
    case 'management/analytics':
    case 'management/usage':
      return <AnalyticsView />;
    case 'management/billing':
      return <BillingView />;
    case 'settings':
      return <SettingsView />;
    case 'help':
      return <HelpView />;
    default:
      return <ChatWorkspace />;
  }
}

export default function Home() {
  return (
    <AppProvider>
      <AppLayout>
        <ViewDispatcher />
      </AppLayout>
    </AppProvider>
  );
}
