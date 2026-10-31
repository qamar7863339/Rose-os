'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Clock, Wrench, Cpu, ShieldAlert } from 'lucide-react';

export default function AnalyticsView() {
  const { clients, agents, workflows, usageMetrics, executionLogs, approvalRequests } = useApp();

  const totalClients = clients.length;
  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const totalAutomations = workflows.length;
  const totalHoursSaved = clients.reduce((acc, c) => acc + (c.hoursSaved || 0), 0);

  // Minimal SVG Bar Chart data for weekly hours saved
  const weeklyData = [
    { day: 'Mon', hours: 94 },
    { day: 'Tue', hours: 122 },
    { day: 'Wed', hours: 145 },
    { day: 'Thu', hours: 168 },
    { day: 'Fri', hours: 152 },
    { day: 'Sat', hours: 64 },
    { day: 'Sun', hours: 44 },
  ];
  const maxHours = 180;

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full space-y-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Business Analytics, Token Usage &amp; Audit Telemetry
        </h1>
        <p className="text-xs text-neutral-500">
          Real-time metering across AI model providers, autonomous tool invocations, client retainers, and security logs.
        </p>
      </div>

      {/* Primary KPI Strip */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Total Tokens Burned</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {(usageMetrics.totalTokensUsed / 1000).toFixed(1)}k
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">
            Est. Cost: ${usageMetrics.estimatedCostUsd.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Tools Executed</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {usageMetrics.toolCallsExecuted}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">
            {approvalRequests.filter((a) => a.status === 'pending').length} pending approval
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Active Agents</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {activeAgents}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">
            {usageMetrics.agentTasksCompleted} tasks completed
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Automations Run</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {usageMetrics.automationsTriggered.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">{totalAutomations} active flows</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-1">
          <div className="text-[11px] text-neutral-400">Hours Saved</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {totalHoursSaved}h
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">{totalClients} enterprise clients</div>
        </div>
      </div>

      {/* Clean Minimal Chart: Weekly Autonomous Hours Saved */}
      <div className="max-w-6xl mx-auto w-full p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Autonomous Work Volume (Hours Saved per Day)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Calculated against standard human FTE completion benchmarks.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">Current Week</span>
        </div>

        <div className="pt-4 flex items-end justify-between gap-3 h-44 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          {weeklyData.map((d, i) => {
            const heightPercent = (d.hours / maxHours) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.hours}h
                </span>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-t-md h-32 flex items-end">
                  <div
                    className="w-full bg-neutral-900 dark:bg-neutral-200 rounded-t-md transition-all duration-500 group-hover:bg-neutral-700 dark:group-hover:bg-white"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-neutral-500">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Usage Breakdown Table */}
      <div className="max-w-6xl mx-auto w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] overflow-hidden space-y-2 p-5">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Client Usage &amp; Retainer Distribution
        </h2>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Client Workspace</th>
                <th className="p-3">Monthly Retainer</th>
                <th className="p-3">Tokens Burned</th>
                <th className="p-3">Hours Saved</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Efficiency Multiple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono text-[11px]">
              {clients.map((c) => {
                const spend = c.monthlySpend || c.mrr || 4500;
                const hours = c.hoursSaved || 40;
                return (
                  <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                    <td className="p-3 font-sans font-medium text-neutral-900 dark:text-neutral-100">
                      {c.name}
                    </td>
                    <td className="p-3 text-neutral-800 dark:text-neutral-200">
                      ${spend.toLocaleString()}
                    </td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400">
                      {((c.tokensUsed || 120000) / 1000).toFixed(1)}k tokens
                    </td>
                    <td className="p-3 text-neutral-900 dark:text-neutral-100 font-semibold">
                      {hours} hrs
                    </td>
                    <td className="p-3 text-neutral-500">{c.healthScore || 95}%</td>
                    <td className="p-3 text-neutral-700 dark:text-neutral-300">
                      {(hours / Math.max(1, spend / 100)).toFixed(1)}x ROI
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Execution & Audit Log */}
      <div className="max-w-6xl mx-auto w-full p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Live Tool Execution &amp; Security Audit Log
          </h2>
          <span className="text-[11px] font-mono text-neutral-400">
            {executionLogs.length} events recorded
          </span>
        </div>

        <div className="space-y-2 text-xs max-h-80 overflow-y-auto">
          {executionLogs.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-neutral-100 dark:border-neutral-800/80 gap-2"
            >
              <div className="flex items-start gap-2.5">
                {item.category === 'tool_call' ? (
                  <Wrench className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                ) : item.category === 'security' || item.category === 'approval' ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                ) : (
                  <Cpu className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.action}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      {item.actor}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{item.details}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 shrink-0">
                {item.latencyMs && <span>{item.latencyMs}ms</span>}
                <Clock className="w-3 h-3" />
                <span>{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
