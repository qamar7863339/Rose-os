'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AutomationWorkflow } from '@/types';
import {
  GitBranch,
  Repeat,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  X,
  Layers,
  Activity,
} from 'lucide-react';

export default function AutomationsView() {
  const { workflows, testRunWorkflow, toggleWorkflowStatus, addWorkflow, showToast } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);

  // New automation form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerApp: 'Webhooks & Inbound Leads',
    triggerEvent: 'Form Submission',
    status: 'active' as AutomationWorkflow['status'],
    actions: [
      { app: 'ROSE Autonomous AI', description: 'Analyze lead budget and company criteria' },
      { app: 'Google Calendar', description: 'Find available consultation slot & invite' },
    ],
  });

  const handleTestRun = (flow: AutomationWorkflow) => {
    setRunningWorkflowId(flow.id);
    testRunWorkflow(flow.id);
    setTimeout(() => {
      setRunningWorkflowId(null);
    }, 1800);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addWorkflow({
      name: formData.name,
      description: formData.description || 'Custom autonomous trigger workflow.',
      triggerApp: formData.triggerApp,
      triggerEvent: formData.triggerEvent,
      actions: formData.actions,
      status: formData.status,
    });

    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      description: '',
      triggerApp: 'Webhooks & Inbound Leads',
      triggerEvent: 'Form Submission',
      status: 'active',
      actions: [
        { app: 'ROSE Autonomous AI', description: 'Analyze lead budget and company criteria' },
        { app: 'Google Calendar', description: 'Find available consultation slot & invite' },
      ],
    });
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Automations &amp; Workflows
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Trigger-action orchestration connecting webhooks, autonomous reasoning agents, and communication channels.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Automation</span>
        </button>
      </div>

      {/* Workflows List */}
      <div className="max-w-6xl mx-auto w-full space-y-4">
        {workflows.map((flow) => {
          const isRunning = runningWorkflowId === flow.id;

          return (
            <div
              key={flow.id}
              className={`p-5 rounded-xl border transition-all space-y-4 ${
                isRunning
                  ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-[#161616]'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {flow.name}
                    </h3>
                    <button
                      onClick={() => toggleWorkflowStatus(flow.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                        flow.status === 'active'
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {flow.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 max-w-2xl">{flow.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTestRun(flow)}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Simulating...' : 'Test Run'}</span>
                  </button>
                </div>
              </div>

              {/* Node Visualization (Trigger -> Actions) */}
              <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-[#101010] border border-neutral-100 dark:border-neutral-800/80 space-y-2">
                <div className="text-[10px] font-mono uppercase text-neutral-400">
                  Execution Pipeline Node Graph
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Trigger Node */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 shadow-2xs">
                    <Zap className="w-3.5 h-3.5 text-neutral-400" />
                    <div>
                      <span className="font-semibold block text-[11px] leading-tight">
                        Trigger: {flow.triggerApp}
                      </span>
                      <span className="text-[10px] text-neutral-400">{flow.triggerEvent}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />

                  {/* Action Nodes */}
                  {flow.actions.map((act, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                        <div>
                          <span className="font-semibold block text-[11px] leading-tight">
                            {act.app}
                          </span>
                          <span className="text-[10px] text-neutral-400 truncate max-w-xs block">
                            {act.description}
                          </span>
                        </div>
                      </div>
                      {i < flow.actions.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Footer Execution History */}
              <div className="pt-1 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono text-[11px]">
                <div className="flex items-center gap-4">
                  <span>Executions: {flow.executionCount.toLocaleString()}</span>
                  <span>Reliability: {flow.successRate}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>Last run: {flow.lastRun}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Automation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Create Automation Workflow
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inbound Patient SMS Triage"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain the trigger conditions and desired output..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Trigger App
                  </label>
                  <select
                    value={formData.triggerApp}
                    onChange={(e) => setFormData({ ...formData, triggerApp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    <option value="Webhooks & Inbound Leads">Webhooks &amp; Inbound Leads</option>
                    <option value="Google Calendar">Google Calendar</option>
                    <option value="Gmail">Gmail</option>
                    <option value="WhatsApp Business">WhatsApp Business</option>
                    <option value="Stripe">Stripe</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Trigger Event
                  </label>
                  <input
                    type="text"
                    value={formData.triggerEvent}
                    onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
                >
                  Deploy Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
