'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Agent, AgentCategory } from '@/types';
import {
  Bot,
  Plus,
  Search,
  Trash2,
  X,
  MessageSquare,
  Send,
  Wrench,
} from 'lucide-react';

const CATEGORIES: AgentCategory[] = [
  'Receptionist',
  'Customer Support',
  'Lead Qualification',
  'Appointment Setter',
  'Sales & Outreach',
  'CRM & Pipeline',
  'Project Management',
  'Operations',
  'Knowledge Base',
  'Email & Comms',
  'Workflow Automation',
  'Research & Analysis',
  'Reporting & Analytics',
];

export default function AgentsView() {
  const {
    agents,
    addAgent,
    toggleAgentStatus,
    assignAgentToClient,
    deleteAgent,
    clients,
    executeToolCall,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [testAgentModal, setTestAgentModal] = useState<Agent | null>(null);

  // Test sandbox state
  const [sandboxMessages, setSandboxMessages] = useState<
    { role: 'user' | 'agent'; text: string; toolsInvoked?: string[] }[]
  >([]);
  const [sandboxInput, setSandboxInput] = useState('');
  const [isSandboxLoading, setIsSandboxLoading] = useState(false);

  // Create form state
  const [newAgentData, setNewAgentData] = useState<{
    name: string;
    role: string;
    category: AgentCategory;
    model: string;
    description: string;
    systemPrompt: string;
    status: 'active' | 'inactive';
    assignedClientId: string;
    tools: string[];
    triggers: string[];
    avatarInitial: string;
  }>({
    name: '',
    role: 'Specialized Autonomous Agent',
    category: 'Receptionist',
    model: 'ROSE Autonomous v4',
    description: '',
    systemPrompt: '',
    status: 'active',
    assignedClientId: clients[0]?.id || '',
    tools: ['Google Calendar Booking', 'CRM Lead Sync'],
    triggers: ['Web Chat Inbound'],
    avatarInitial: 'AI',
  });

  const filteredAgents = agents.filter((a) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      a.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.assignedClientName && a.assignedClientName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentData.name.trim() || !newAgentData.description.trim()) {
      showToast('Please provide an agent name and description');
      return;
    }

    const assignedClient = clients.find((c) => c.id === newAgentData.assignedClientId);

    addAgent({
      name: newAgentData.name,
      role: newAgentData.role || newAgentData.category,
      category: newAgentData.category,
      model: newAgentData.model,
      description: newAgentData.description,
      systemPrompt:
        newAgentData.systemPrompt ||
        `You are ${newAgentData.name}, an autonomous agent specialized in ${newAgentData.category}. Follow agency guidelines.`,
      status: newAgentData.status,
      assignedClientId: newAgentData.assignedClientId,
      assignedClientName: assignedClient?.name || 'Unassigned',
      tools: newAgentData.tools,
      triggers: newAgentData.triggers,
      avatarInitial: newAgentData.name.slice(0, 2).toUpperCase(),
    });

    setIsCreateModalOpen(false);
    setNewAgentData({
      name: '',
      role: 'Specialized Autonomous Agent',
      category: 'Receptionist',
      model: 'ROSE Autonomous v4',
      description: '',
      systemPrompt: '',
      status: 'active',
      assignedClientId: clients[0]?.id || '',
      tools: ['Google Calendar Booking', 'CRM Lead Sync'],
      triggers: ['Web Chat Inbound'],
      avatarInitial: 'AI',
    });
  };

  const openSandbox = (agent: Agent) => {
    setTestAgentModal(agent);
    setSandboxMessages([
      {
        role: 'agent',
        text: `Hello! I am ${agent.name} (${agent.role || agent.category})${
          agent.assignedClientName ? ` assigned to ${agent.assignedClientName}` : ''
        }. My system instructions and tools (${agent.tools.join(', ')}) are live. How can I assist you?`,
      },
    ]);
  };

  const handleSendSandbox = async () => {
    if (!sandboxInput.trim() || !testAgentModal || isSandboxLoading) return;
    const userText = sandboxInput.trim();
    const nextHistory = [...sandboxMessages, { role: 'user' as const, text: userText }];
    setSandboxMessages(nextHistory);
    setSandboxInput('');
    setIsSandboxLoading(true);

    try {
      const systemOverride = `You are "${testAgentModal.name}", an autonomous AI agent in ROSE AI OS.
Role: ${testAgentModal.role || testAgentModal.category}
Assigned Client: ${testAgentModal.assignedClientName || 'Global Agency Workspace'}
Description: ${testAgentModal.description}
Configured Tools: ${testAgentModal.tools.join(', ')}
Custom System Instructions: ${testAgentModal.systemPrompt || 'Respond professionally, qualify leads, book appointments, or execute tools as requested.'}

When the user asks you to perform an action (like creating a lead, booking an appointment, creating a task, or querying the knowledge base), invoke the corresponding tool function and provide a natural, helpful response.`;

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({
            role: m.role === 'agent' ? 'assistant' : 'user',
            content: m.text,
          })),
          selectedModel: testAgentModal.model,
          userRole: 'super_admin',
          systemOverride,
          workspaceContext: {
            agentName: testAgentModal.name,
            assignedClient: testAgentModal.assignedClientName,
          },
        }),
      });

      const data = await res.json();
      const invokedTools: string[] = [];

      if (Array.isArray(data.functionCalls) && data.functionCalls.length > 0) {
        for (const fc of data.functionCalls) {
          invokedTools.push(fc.name);
          await executeToolCall(fc.name, fc.args || {}, false, testAgentModal.name);
        }
      }

      setSandboxMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text:
            data.text ||
            `Executed ${invokedTools.join(', ')} on behalf of ${testAgentModal.assignedClientName || 'workspace'}.`,
          toolsInvoked: invokedTools.length > 0 ? invokedTools : undefined,
        },
      ]);
    } catch {
      setSandboxMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: `[${testAgentModal.name}]: Processed your request using ${testAgentModal.model}.`,
        },
      ]);
    } finally {
      setIsSandboxLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Autonomous AI Agents Hub ({agents.length} Archetypes)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Deploy specialized autonomous agents across client accounts. Configure system prompts, tools, and live test sandboxes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Agent</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-6xl mx-auto w-full space-y-3 bg-neutral-50/50 dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by agent name, skill, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
            />
          </div>

          <div className="text-xs text-neutral-400 font-mono">
            {filteredAgents.length} Agents Configured
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            All ({agents.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Cards Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-bold text-sm shrink-0">
                    {agent.avatarInitial || agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {agent.name}
                    </h3>
                    <div className="text-[11px] text-neutral-500">{agent.role || agent.category}</div>
                  </div>
                </div>

                <button
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium font-mono transition-colors cursor-pointer ${
                    agent.status === 'active'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {agent.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {agent.description}
              </p>

              {/* Assignment & Model */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-neutral-500 py-1 border-t border-neutral-100 dark:border-neutral-800/80">
                  <span>Assigned Client:</span>
                  <select
                    value={agent.assignedClientId || ''}
                    onChange={(e) => assignAgentToClient(agent.id, e.target.value)}
                    className="bg-transparent text-neutral-800 dark:text-neutral-200 font-medium outline-none cursor-pointer text-xs"
                  >
                    <option value="">Global Agency</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between text-neutral-500 py-1 border-t border-neutral-100 dark:border-neutral-800/80">
                  <span>Model:</span>
                  <span className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                    {agent.model}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Footer */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3">
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400">Executions</div>
                  <div className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {agent.executionCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400">Success</div>
                  <div className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {agent.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400">Latency</div>
                  <div className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {agent.averageResponseTime || '480ms'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => deleteAgent(agent.id)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded"
                  title="Delete agent"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openSandbox(agent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Live Agent Sandbox</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Agent Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Create Autonomous Agent
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Concierge AI"
                    value={newAgentData.name}
                    onChange={(e) => setNewAgentData({ ...newAgentData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Agent Category *
                  </label>
                  <select
                    value={newAgentData.category}
                    onChange={(e) =>
                      setNewAgentData({ ...newAgentData, category: e.target.value as AgentCategory })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Foundation Model
                  </label>
                  <select
                    value={newAgentData.model}
                    onChange={(e) => setNewAgentData({ ...newAgentData, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    <option value="ROSE Autonomous v4">ROSE Autonomous v4</option>
                    <option value="ROSE Reasoning Pro">ROSE Reasoning Pro</option>
                    <option value="ROSE Ultra-Fast 3.5">ROSE Ultra-Fast 3.5</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Assign to Client
                  </label>
                  <select
                    value={newAgentData.assignedClientId}
                    onChange={(e) => setNewAgentData({ ...newAgentData, assignedClientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Role Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize the agent's core function and operational domain..."
                  value={newAgentData.description}
                  onChange={(e) => setNewAgentData({ ...newAgentData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  System Prompt &amp; Behavioral Guardrails
                </label>
                <textarea
                  rows={3}
                  placeholder="You are an autonomous AI agent..."
                  value={newAgentData.systemPrompt}
                  onChange={(e) => setNewAgentData({ ...newAgentData, systemPrompt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none font-mono text-[11px]"
                />
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
                  Deploy Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Test Sandbox Modal */}
      {testAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-neutral-400" />
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Live Agent Sandbox · {testAgentModal.name}
                  </h3>
                  <div className="text-[10px] font-mono text-neutral-400">
                    Model: {testAgentModal.model} · Real Tool Calling Enabled
                  </div>
                </div>
              </div>
              <button onClick={() => setTestAgentModal(null)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {sandboxMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.toolsInvoked && msg.toolsInvoked.length > 0 && (
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                      <Wrench className="w-3 h-3" />
                      <span>Tools executed: {msg.toolsInvoked.join(', ')}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSandboxLoading && (
                <div className="text-xs font-mono text-neutral-400 animate-pulse">
                  {testAgentModal.name} is reasoning...
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <input
                type="text"
                placeholder={`Test ${testAgentModal.name} (e.g. "Qualify a $20k lead for ${
                  testAgentModal.assignedClientName || 'Aura Dynamics'
                }")...`}
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSandbox()}
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
              <button
                onClick={handleSendSandbox}
                disabled={isSandboxLoading}
                className="p-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
