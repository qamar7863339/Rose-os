'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Wrench,
  XCircle,
} from 'lucide-react';

const PRESET_GOALS = [
  'Create a complete AI automation system for a real estate company.',
  'Deploy an autonomous 24/7 patient triage & EHR calendar booking agent.',
  'Build an automated investment pitch deck financial parser & memo compiler.',
];

export default function AgentModeWorkspace() {
  const {
    agentTask,
    startAgentTask,
    pauseAgentTask,
    resumeAgentTask,
    stopAgentTask,
    approveAgentStep,
    rejectAgentStep,
    retryAgentStep,
    resetAgentTask,
    clients,
    executionLogs,
    showToast,
  } = useApp();

  const [customGoal, setCustomGoal] = useState(agentTask.goal);
  const [selectedClientName, setSelectedClientName] = useState(
    agentTask.targetClient || clients[0]?.name || 'Aura Dynamics'
  );
  const [activeTab, setActiveTab] = useState<'pipeline' | 'logs'>('pipeline');

  const handleStart = () => {
    if (!customGoal.trim()) return;
    startAgentTask(customGoal, selectedClientName);
  };

  const waitingApprovalStep = agentTask.steps.find((s) => s.status === 'waiting_approval');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100 animate-pulse" />
            Executing
          </span>
        );
      case 'waiting_approval':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-neutral-300 dark:bg-neutral-700 text-neutral-950 dark:text-white">
            <AlertTriangle className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
            Pending Approval
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            <Clock className="w-3 h-3" />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
            Idle
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header & Mission Banner */}
      <div className="max-w-5xl mx-auto w-full space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Agent Mode
              </h1>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono border border-neutral-300 dark:border-neutral-700 text-neutral-500">
                Multi-Agent Orchestrator
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Specify high-level business objectives. The AI Orchestrator decomposes goals into multi-agent steps and executes real backend tools.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(agentTask.status)}
            <span className="text-xs text-neutral-400 font-mono">Progress: {agentTask.progress}%</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#141414] text-xs text-neutral-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>
              <strong>Autonomous Execution Governance:</strong> Specialized agents execute real workspace tools and pause automatically at human-in-the-loop approval checkpoints.
            </span>
          </div>
        </div>
      </div>

      {/* Goal Input & Setup Card */}
      <div className="max-w-5xl mx-auto w-full bg-neutral-50/50 dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 md:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Task Directive &amp; Autonomous Objective
            </label>
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="Describe the autonomous system or multi-step objective..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none focus:border-neutral-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Target Client Assignment
            </label>
            <select
              value={selectedClientName}
              onChange={(e) => setSelectedClientName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.industry})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Prompt Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-neutral-400 font-medium">Examples:</span>
          {PRESET_GOALS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setCustomGoal(preset)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors truncate max-w-xs cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Execution Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            {agentTask.status === 'idle' ||
            agentTask.status === 'completed' ||
            agentTask.status === 'stopped' ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Autonomous Agent</span>
              </button>
            ) : agentTask.status === 'running' ? (
              <button
                onClick={pauseAgentTask}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : agentTask.status === 'paused' ? (
              <button
                onClick={resumeAgentTask}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            ) : null}

            {agentTask.status !== 'idle' && (
              <button
                onClick={stopAgentTask}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            )}

            <button
              onClick={resetAgentTask}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(agentTask, null, 2));
                showToast('Execution Blueprint copied to clipboard as JSON');
              }}
              className="px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Export Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto w-full space-y-1.5">
        <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>Overall Task Progress</span>
          <span className="tabular-nums">{agentTask.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-500"
            style={{ width: `${agentTask.progress}%` }}
          />
        </div>
      </div>

      {/* Interactive Approval Gate (Visible if waiting for approval) */}
      {agentTask.status === 'waiting_approval' && waitingApprovalStep && (
        <div className="max-w-5xl mx-auto w-full p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-[#181818] shadow-md space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              !
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Human-in-the-Loop Authorization Required: {waitingApprovalStep.title}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Agent <strong>{waitingApprovalStep.agentRole}</strong> is requesting permission to execute{' '}
                <code className="font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">
                  {waitingApprovalStep.toolName || 'external_action'}
                </code>
                . {waitingApprovalStep.details}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => rejectAgentStep(waitingApprovalStep.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-300 dark:border-neutral-700"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject &amp; Stop</span>
            </button>
            <button
              onClick={() => approveAgentStep(waitingApprovalStep.id)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-xs"
            >
              Approve &amp; Continue Execution
            </button>
          </div>
        </div>
      )}

      {/* Main Execution View: Pipeline Steps vs Terminal Logs */}
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Tab Controls */}
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Execution Pipeline Steps ({agentTask.steps.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Execution Audit Trail ({executionLogs.length})</span>
          </button>
        </div>

        {/* Pipeline Tab Content */}
        {activeTab === 'pipeline' && (
          <div className="space-y-3">
            {agentTask.steps.map((step, idx) => {
              const isCurrent = idx === agentTask.currentStepIndex && agentTask.status === 'running';
              const isCompleted = step.status === 'completed';
              const isPendingApproval = step.status === 'waiting_approval';
              const isFailed = step.status === 'failed';

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isPendingApproval
                      ? 'border-neutral-400 dark:border-neutral-600 bg-neutral-100/60 dark:bg-neutral-900/60'
                      : isCompleted
                      ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212]'
                      : isCurrent
                      ? 'border-neutral-400 dark:border-neutral-600 bg-neutral-50 dark:bg-[#161616]'
                      : 'border-neutral-200/60 dark:border-neutral-800/40 opacity-75 bg-white dark:bg-[#111111]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                            : isPendingApproval
                            ? 'bg-neutral-400 dark:bg-neutral-600 text-white'
                            : isCurrent
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            {step.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono">
                            {step.agentRole}
                          </span>
                          {step.toolName && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-mono">
                              <Wrench className="w-2.5 h-2.5" />
                              {step.toolName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed">{step.details}</p>
                        <div className="pt-1 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                          <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span>{step.log}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isCompleted && (
                        <>
                          <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                            Completed
                          </span>
                          <button
                            onClick={() => retryAgentStep(step.id)}
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                            title="Re-run this step"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      {isFailed && (
                        <button
                          onClick={() => retryAgentStep(step.id)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          Retry Step
                        </button>
                      )}
                      {isCurrent && (
                        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 animate-pulse">
                          Running...
                        </span>
                      )}
                      {isPendingApproval && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => rejectAgentStep(step.id)}
                            className="px-2 py-1 text-[11px] font-medium rounded border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => approveAgentStep(step.id)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                      {step.status === 'pending' && (
                        <span className="text-[11px] text-neutral-400">Queued</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Terminal Logs Tab Content */}
        {activeTab === 'logs' && (
          <div className="p-4 rounded-xl bg-[#0a0a0a] text-neutral-300 font-mono text-xs border border-neutral-800 space-y-2 max-h-96 overflow-y-auto">
            <div className="text-neutral-500 pb-1 border-b border-neutral-800 flex items-center justify-between">
              <span>ROSE Autonomous Telemetry &amp; Tool Audit Stream</span>
              <span>Target: {agentTask.targetClient}</span>
            </div>
            <div className="space-y-1.5">
              {executionLogs.map((logItem) => (
                <div key={logItem.id} className="text-neutral-400 flex items-start gap-2">
                  <span className="text-neutral-600 shrink-0">[{logItem.timestamp}]</span>
                  <span className="text-neutral-200 font-semibold shrink-0">[{logItem.actor}]</span>
                  <span>
                    {logItem.action} — <span className="text-neutral-500">{logItem.details}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
