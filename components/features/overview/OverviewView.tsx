'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  Bot,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function OverviewView() {
  const { clients, agents, leads, projects, workflows, appointments, setCurrentView, viewClientWorkspace } =
    useApp();

  const totalMRR = clients.reduce((acc, c) => acc + c.monthlySpend, 0);
  const totalPipeline = leads.reduce((acc, l) => acc + l.value, 0);
  const activeAgentsCount = agents.filter((a) => a.status === 'active').length;

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Agency Operating Overview
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Unified command center bridging autonomous agents, client workspaces, pipeline, and live milestones.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('workspace/chat')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open AI Assistant</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Monthly Agency Run Rate</div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            ${totalMRR.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">5 client retainers</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Active CRM Pipeline</div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            ${totalPipeline.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">{leads.length} qualified deals</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Autonomous Agents</div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {activeAgentsCount} / {agents.length}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">Active deployments</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Scheduled Appointments</div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {appointments.length}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">Upcoming this week</div>
        </div>
      </div>

      {/* 2-Column Split: Active Client Workspaces & Upcoming Appointments */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Client Workspaces Quick List */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Active Client Workspaces
            </h2>
            <button
              onClick={() => setCurrentView('business/clients')}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              View all ↗
            </button>
          </div>

          <div className="space-y-2">
            {clients.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => viewClientWorkspace(c.id)}
                className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {c.industry} · {c.assignedAgentIds.length} agents assigned
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    ${c.monthlySpend.toLocaleString()}/mo
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">{c.hoursSaved}h saved</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments Booked by Agents */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Agent Booked Consultations
            </h2>
            <button
              onClick={() => setCurrentView('business/crm')}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              CRM Pipeline ↗
            </button>
          </div>

          <div className="space-y-2">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 space-y-1 text-xs"
              >
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {apt.title}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">{apt.date}</span>
                </div>
                <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                  <span>Client: {apt.clientName}</span>
                  <span>·</span>
                  <span>Prospect: {apt.leadName}</span>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  Booked autonomously by {apt.bookedByAgent}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Autonomous Tasks */}
      <div className="max-w-6xl mx-auto w-full p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Autonomous Workflows Currently Live
          </h2>
          <button
            onClick={() => setCurrentView('automation/workflows')}
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Manage workflows ↗
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {workflows.slice(0, 3).map((w) => (
            <div
              key={w.id}
              className="p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {w.name}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">Live</span>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2">{w.description}</p>
              <div className="text-[10px] text-neutral-400 font-mono">
                {w.executionCount.toLocaleString()} executions · {w.successRate}% success
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
