'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Building,
  Users,
  Bot,
  Layers,
  Repeat,
  Plug,
  Activity,
  History,
  Mail,
  Phone,
  Globe,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react';

export default function ClientWorkspaceView() {
  const {
    clients,
    selectedClientId,
    setCurrentView,
    agents,
    projects,
    workflows,
    integrations,
    toggleAgentStatus,
    showToast,
  } = useApp();

  const client = clients.find((c) => c.id === selectedClientId) || clients[0];
  const [activeTab, setActiveTab] = useState<
    'overview' | 'agents' | 'projects' | 'automations' | 'integrations' | 'usage' | 'history'
  >('overview');

  if (!client) {
    return (
      <div className="p-8 text-center text-sm text-neutral-500">
        No client selected.{' '}
        <button onClick={() => setCurrentView('business/clients')} className="underline">
          Return to clients
        </button>
      </div>
    );
  }

  // Filter entities belonging to this client
  const clientAgents = agents.filter(
    (a) => a.assignedClientId === client.id || client.assignedAgentIds.includes(a.id)
  );
  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const clientWorkflows = workflows.filter((w) => w.associatedClientId === client.id);

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Back button and Client Hero banner */}
      <div className="max-w-6xl mx-auto w-full space-y-4">
        <button
          onClick={() => setCurrentView('business/clients')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Client Directory</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#141414]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {client.name}
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {client.status}
                </span>
              </div>
              <div className="text-xs text-neutral-500 mt-0.5 flex flex-wrap items-center gap-2">
                <span>{client.industry}</span>
                <span>·</span>
                <span>Primary: {client.contactName}</span>
                <span>·</span>
                <span className="font-mono">{client.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                showToast(`Opened Client Portal for ${client.name}`);
                setCurrentView('client/home');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
            >
              <span>View as Client</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-1">
          {[
            { id: 'overview', label: 'Overview', icon: Building },
            { id: 'agents', label: `AI Agents (${clientAgents.length})`, icon: Bot },
            { id: 'projects', label: `Projects (${clientProjects.length})`, icon: Layers },
            { id: 'automations', label: `Automations (${clientWorkflows.length})`, icon: Repeat },
            { id: 'integrations', label: 'Integrations', icon: Plug },
            { id: 'usage', label: 'Usage & ROI', icon: Activity },
            { id: 'history', label: 'Activity Audit', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                <div className="text-xs text-neutral-400">Monthly Contract</div>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                  ${client.monthlySpend.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Auto-billed on 1st</div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                <div className="text-xs text-neutral-400">Hours Saved</div>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                  {client.hoursSaved} hrs
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Equivalent to 2.1 FTEs</div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                <div className="text-xs text-neutral-400">Tokens Processed</div>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                  {(client.tokensUsed / 1000000).toFixed(2)}M
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Under 5M plan quota</div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                <div className="text-xs text-neutral-400">Autonomous Uptime</div>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                  99.9%
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Zero downtime recorded</div>
              </div>
            </div>

            {/* Profile & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  Business Information
                </h3>
                <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">Client ID:</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{client.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">Contract Signed:</span>
                    <span>{client.joinedDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">Direct Phone:</span>
                    <span className="font-mono">{client.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">Domain / Portal:</span>
                    <span className="font-mono">{client.website || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  Operational Guidelines &amp; Notes
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {client.notes}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500">
                  <Shield className="w-3.5 h-3.5 text-neutral-400" />
                  <span>HIPAA &amp; PII Data Scrubbing enforced on all vector chunks.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === 'agents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Assigned Autonomous Agents
              </h3>
              <button
                onClick={() => setCurrentView('workspace/agents')}
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:underline"
              >
                Assign more agents ↗
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {agent.name}
                      </div>
                      <div className="text-xs text-neutral-500">{agent.category}</div>
                    </div>
                    <button
                      onClick={() => toggleAgentStatus(agent.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        agent.status === 'active'
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {agent.status === 'active' ? 'Active' : 'Paused'}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {agent.description}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 flex items-center justify-between font-mono text-[11px]">
                    <span>Executions: {agent.executionCount}</span>
                    <span>Success: {agent.successRate}%</span>
                    <span>Latency: {agent.averageResponseTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Client Deliverables &amp; Roadmap
            </h3>
            {clientProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                No active projects for this client.
              </div>
            ) : (
              <div className="space-y-3">
                {clientProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {proj.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">{proj.description}</div>
                      </div>
                      <span className="text-xs font-mono capitalize px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-500 font-mono">
                        <span>Progress</span>
                        <span>{proj.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 dark:bg-neutral-100"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUTOMATIONS TAB */}
        {activeTab === 'automations' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Active Client Automations
            </h3>
            {clientWorkflows.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                Default agency global automations are currently shared with this client.
              </div>
            ) : (
              <div className="space-y-3">
                {clientWorkflows.map((flow) => (
                  <div
                    key={flow.id}
                    className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {flow.name}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        Last run: {flow.lastRun}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">{flow.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INTEGRATIONS TAB */}
        {activeTab === 'integrations' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Connected Tools for {client.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {client.connectedIntegrations.map((toolName, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Plug className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      {toolName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">Connected</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USAGE TAB */}
        {activeTab === 'usage' && (
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Token Consumption &amp; Computational Telemetry
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Monthly Token Quota (3.5M / 5.0M)</span>
                <span className="font-mono">70% Allocated</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 dark:bg-neutral-100" style={{ width: '70%' }} />
              </div>
            </div>
            <div className="pt-2 text-xs text-neutral-500">
              Billed rate: $0.15 per 10k autonomous reasoning tokens. Next invoice: November 1, 2026.
            </div>
          </div>
        )}

        {/* ACTIVITY HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Audit &amp; Agent Activity Log
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { time: '10 mins ago', desc: 'Aura FrontDesk AI booked showing for prospect Sophia Lindqvist.' },
                { time: '2 hours ago', desc: 'PropLead Qualifier scored new buyer lead at 92/100 and updated HubSpot.' },
                { time: 'Yesterday 18:45', desc: 'Automated SMS reminder dispatched for tomorrow commercial showing.' },
                { time: 'Oct 28 09:12', desc: 'Google Calendar API conflict check ran with 0 collisions.' },
              ].map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-800 dark:text-neutral-200">{log.desc}</span>
                    <span className="text-neutral-400 text-[10px] ml-2 font-mono">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
