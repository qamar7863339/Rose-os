'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { NavigationView } from '@/types';
import {
  Search,
  MessageSquare,
  Bot,
  Users,
  Briefcase,
  GitBranch,
  Layers,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Action' | 'Clients' | 'Agents';
  icon: React.ElementType;
  action: () => void;
}

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentView,
    createNewChat,
    clients,
    agents,
    viewClientWorkspace,
  } = useApp();

  const [query, setQuery] = useState('');

  const handleClose = () => {
    setQuery('');
    setCommandPaletteOpen(false);
  };

  if (!commandPaletteOpen) return null;

  const items: PaletteItem[] = [
    {
      id: 'act-new-chat',
      title: 'New AI Conversation',
      subtitle: 'Start a fresh ChatGPT-style prompt thread',
      category: 'Action',
      icon: Plus,
      action: () => {
        createNewChat();
        handleClose();
      },
    },
    {
      id: 'nav-chat',
      title: 'AI Assistant',
      subtitle: 'Primary conversational workspace',
      category: 'Navigation',
      icon: MessageSquare,
      action: () => {
        setCurrentView('workspace/chat');
        handleClose();
      },
    },
    {
      id: 'nav-agent-mode',
      title: 'Agent Mode',
      subtitle: 'Autonomous multi-step execution environment',
      category: 'Navigation',
      icon: Bot,
      action: () => {
        setCurrentView('workspace/agent-mode');
        handleClose();
      },
    },
    {
      id: 'nav-agents',
      title: 'AI Agents Hub',
      subtitle: 'Manage receptionists, support, and sales agents',
      category: 'Navigation',
      icon: Bot,
      action: () => {
        setCurrentView('workspace/agents');
        handleClose();
      },
    },
    {
      id: 'nav-clients',
      title: 'Clients Directory',
      subtitle: 'Client accounts, spend, and allocated agents',
      category: 'Navigation',
      icon: Users,
      action: () => {
        setCurrentView('business/clients');
        handleClose();
      },
    },
    {
      id: 'nav-crm',
      title: 'CRM Pipeline',
      subtitle: 'Manage leads, deal stages, and customer contacts',
      category: 'Navigation',
      icon: Briefcase,
      action: () => {
        setCurrentView('business/crm');
        handleClose();
      },
    },
    {
      id: 'nav-projects',
      title: 'Projects & Tasks',
      subtitle: 'Track client deliverables and agent automation tasks',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        setCurrentView('business/projects');
        handleClose();
      },
    },
    {
      id: 'nav-automations',
      title: 'Automations & Workflows',
      subtitle: 'Event triggers, multi-action chains, and test runs',
      category: 'Navigation',
      icon: GitBranch,
      action: () => {
        setCurrentView('automation/workflows');
        handleClose();
      },
    },
    {
      id: 'nav-integrations',
      title: 'Connectors & Integrations',
      subtitle: 'Gmail, Calendar, WhatsApp, HubSpot, Stripe',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        setCurrentView('automation/integrations');
        handleClose();
      },
    },
    {
      id: 'nav-knowledge',
      title: 'Knowledge Base',
      subtitle: 'Vector indexed documents, SOPs, and guidelines',
      category: 'Navigation',
      icon: FileText,
      action: () => {
        setCurrentView('management/knowledge');
        handleClose();
      },
    },
    {
      id: 'nav-analytics',
      title: 'Analytics & Usage',
      subtitle: 'Hours saved, token telemetry, and execution volume',
      category: 'Navigation',
      icon: BarChart3,
      action: () => {
        setCurrentView('management/analytics');
        handleClose();
      },
    },
    {
      id: 'nav-billing',
      title: 'Billing & Subscriptions',
      subtitle: 'Agency tier, client allocations, and invoices',
      category: 'Navigation',
      icon: CreditCard,
      action: () => {
        setCurrentView('management/billing');
        handleClose();
      },
    },
    {
      id: 'nav-settings',
      title: 'System Settings',
      subtitle: 'Profile, workspace preferences, and security',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        setCurrentView('settings');
        handleClose();
      },
    },
    // Dynamic Clients
    ...clients.map((c) => ({
      id: `client-${c.id}`,
      title: c.name,
      subtitle: `Client Workspace · ${c.industry}`,
      category: 'Clients' as const,
      icon: Users,
      action: () => {
        viewClientWorkspace(c.id);
        handleClose();
      },
    })),
    // Dynamic Agents
    ...agents.map((a) => ({
      id: `agent-${a.id}`,
      title: a.name,
      subtitle: `${a.category} · Assigned to ${a.assignedClientName || 'Unassigned'}`,
      category: 'Agents' as const,
      icon: Bot,
      action: () => {
        setCurrentView('workspace/agents');
        handleClose();
      },
    })),
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, tool, client or agent..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              No matching commands or resources found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-600 dark:text-neutral-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-neutral-500 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-xs text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
                    <span className="text-[11px] text-neutral-400 hidden sm:inline">{item.category}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-[#141414] border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>Navigation & Actions</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
