'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Send,
  Paperclip,
  Mic,
  ChevronDown,
  Sparkles,
  User,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  FileText,
  X,
  Wrench,
  BookOpen,
  ShieldAlert,
  Brain,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Create a new client named "Vertex BioLabs" in Healthcare with $8,500 MRR.',
  'Query the knowledge base for Aura Dynamics Penthouse Floor 42 leasing terms.',
  'Create a CRM lead for "Nordic AI" worth $24,000 in the qualified stage.',
  'Generate an executive agency performance report for this month.',
  'Create a high-priority task "Configure OAuth scopes" for Aura Dynamics.',
  'Send an email to elena@auradynamics.com confirming tomorrow’s 2:00 PM showing.',
];

const AVAILABLE_MODELS = [
  { id: 'ROSE Autonomous v4', label: 'ROSE Autonomous v4', tag: 'Gemini 3.8 Flash · Tool Calling & Agents' },
  { id: 'ROSE Reasoning Pro', label: 'ROSE Reasoning Pro', tag: 'Deep Multi-Step Analysis & RAG' },
  { id: 'ROSE Ultra-Fast 3.5', label: 'ROSE Ultra-Fast 3.5', tag: 'Gemini 3.1 Flash Lite · Low Latency' },
];

export default function ChatWorkspace() {
  const {
    activeConversation,
    sendMessage,
    isAiTyping,
    setVoiceModalOpen,
    setCurrentView,
    showToast,
    approvalRequests,
    approveRequest,
    rejectRequest,
    memories,
    addMemory,
    deleteMemory,
  } = useApp();

  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('ROSE Autonomous v4');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{
    name: string;
    type: string;
    size: string;
    textContent?: string;
  } | null>(null);

  // Side drawers for Memory & Pending Approvals
  const [memoryDrawerOpen, setMemoryDrawerOpen] = useState(false);
  const [approvalsDrawerOpen, setApprovalsDrawerOpen] = useState(false);
  const [newMemKey, setNewMemKey] = useState('');
  const [newMemContent, setNewMemContent] = useState('');
  const [newMemScope, setNewMemScope] = useState<
    'workspace_knowledge' | 'user_preference' | 'client_knowledge' | 'agent_memory'
  >('workspace_knowledge');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingApprovals = approvalRequests.filter((a) => a.status === 'pending');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation.messages, isAiTyping]);

  const handleSend = () => {
    if (!input.trim() && !attachment) return;
    sendMessage(input, selectedModel, attachment || undefined);
    setInput('');
    setAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const textContent = typeof reader.result === 'string' ? reader.result : undefined;
      setAttachment({
        name: file.name,
        type: file.type || 'text/plain',
        size: sizeStr,
        textContent,
      });
      showToast(`Attached "${file.name}" for AI analysis`);
    };
    reader.onerror = () => {
      setAttachment({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: sizeStr,
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemKey.trim() || !newMemContent.trim()) return;
    await addMemory({
      scope: newMemScope,
      key: newMemKey.trim(),
      content: newMemContent.trim(),
      importance: 'high',
    });
    setNewMemKey('');
    setNewMemContent('');
  };

  const isConversationEmpty = activeConversation.messages.length <= 1;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0d0d0d] relative">
      {/* Top Bar with Model Selector + Memory & Approvals Controls */}
      <div className="h-11 border-b border-neutral-100 dark:border-neutral-800/60 px-4 flex items-center justify-between bg-white/50 dark:bg-[#0d0d0d]/50 backdrop-blur-xs shrink-0 z-10">
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <span>{selectedModel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute top-8 left-0 w-72 bg-white dark:bg-[#181818] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-1 z-30">
              <div className="px-2 py-1.5 text-[10px] uppercase font-semibold text-neutral-400">
                AI Model Provider Layer
              </div>
              {AVAILABLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setModelDropdownOpen(false);
                    showToast(`Active model: ${model.label}`);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                    selectedModel === model.id
                      ? 'bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  <div>
                    <div className="font-medium">{model.label}</div>
                    <div className="text-[10px] text-neutral-400">{model.tag}</div>
                  </div>
                  {selectedModel === model.id && (
                    <Check className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls: Memory & Human-in-the-Loop Approvals */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMemoryDrawerOpen(!memoryDrawerOpen);
              setApprovalsDrawerOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Memory</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800">
              {memories.length}
            </span>
          </button>

          <button
            onClick={() => {
              setApprovalsDrawerOpen(!approvalsDrawerOpen);
              setMemoryDrawerOpen(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              pendingApprovals.length > 0
                ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Approvals</span>
            <span className="font-mono text-[10px]">{pendingApprovals.length}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Workspace Memory Drawer */}
      {memoryDrawerOpen && (
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-[#141414] px-4 md:px-8 py-4 space-y-3 z-20">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Persistent Workspace Memory &amp; Context
                </span>
              </div>
              <button onClick={() => setMemoryDrawerOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] flex items-start justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 text-[11px]">
                        {mem.key}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        {mem.scope}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
                      {mem.content}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMemory(mem.id)}
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white shrink-0"
                    title="Delete memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddMemorySubmit} className="flex flex-wrap items-center gap-2 pt-1">
              <select
                value={newMemScope}
                onChange={(e) => setNewMemScope(e.target.value as typeof newMemScope)}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-800 dark:text-neutral-200 outline-none"
              >
                <option value="workspace_knowledge">Workspace Knowledge</option>
                <option value="user_preference">User Preference</option>
                <option value="client_knowledge">Client Knowledge</option>
                <option value="agent_memory">Agent Memory</option>
              </select>
              <input
                type="text"
                placeholder="Memory key (e.g. billing_rule)"
                value={newMemKey}
                onChange={(e) => setNewMemKey(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none w-40"
              />
              <input
                type="text"
                placeholder="Fact or instruction to remember..."
                value={newMemContent}
                onChange={(e) => setNewMemContent(e.target.value)}
                className="flex-1 min-w-[180px] px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Store</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Collapsible Human-in-the-Loop Approvals Drawer */}
      {approvalsDrawerOpen && (
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-[#141414] px-4 md:px-8 py-4 space-y-3 z-20">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Human-in-the-Loop Action Approval Queue ({pendingApprovals.length} Pending)
                </span>
              </div>
              <button onClick={() => setApprovalsDrawerOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="text-xs text-neutral-500 py-2">
                No sensitive actions awaiting approval. All autonomous tool calls are clear.
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {pendingApprovals.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {req.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          {req.toolName}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{req.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => rejectRequest(req.id)}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveRequest(req.id)}
                        className="px-3 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium hover:opacity-90"
                      >
                        Approve &amp; Execute
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome Screen when Empty */}
          {isConversationEmpty && (
            <div className="pt-6 md:pt-12 pb-6 text-center space-y-6">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-lg shadow-sm">
                  R
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  ROSE AI OS
                </h1>
                <p className="text-sm text-neutral-500 max-w-md mx-auto">
                  Direct the central AI Brain to create clients, update CRM deals, launch autonomous agents, query RAG documents, or execute Google Workspace actions.
                </p>
              </div>

              {/* Suggested Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sendMessage(prompt, selectedModel);
                    }}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all text-left group cursor-pointer"
                  >
                    <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                      {prompt}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
                      <span>Execute live tool directive</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation History */}
          {activeConversation.messages.map((message) => {
            const isUser = message.role === 'user';
            const isExpanded = expandedThoughts[message.id];

            return (
              <div
                key={message.id}
                className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    R
                  </div>
                )}

                <div className={`max-w-[88%] md:max-w-2xl space-y-2.5 ${isUser ? 'items-end' : ''}`}>
                  {isUser ? (
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 rounded-2xl rounded-tr-xs text-sm leading-relaxed">
                      {message.attachment && (
                        <div className="mb-2 flex items-center gap-2 p-2 rounded-lg bg-neutral-200/60 dark:bg-neutral-700/60 text-xs">
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="font-medium truncate">{message.attachment.name}</span>
                          <span className="text-neutral-400 text-[10px]">{message.attachment.size}</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ) : (
                    /* Assistant Message */
                    <div className="space-y-3">
                      {/* Model & Telemetry Header */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-400 font-mono">
                        <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
                          {message.model || selectedModel}
                        </span>
                        <span>·</span>
                        <span>{message.timestamp}</span>
                        {message.tokenUsage && (
                          <>
                            <span>·</span>
                            <span>{message.tokenUsage.totalTokens} tokens</span>
                          </>
                        )}
                      </div>

                      {/* Executed Tool Calls Cards */}
                      {message.toolCalls && message.toolCalls.length > 0 && (
                        <div className="space-y-2">
                          {message.toolCalls.map((tc) => {
                            const pendingApprovalItem =
                              tc.status === 'waiting_approval'
                                ? approvalRequests.find(
                                    (a) =>
                                      a.id === (tc.output as { approvalId?: string })?.approvalId ||
                                      (a.toolName === tc.toolName && a.status === 'pending')
                                  )
                                : undefined;

                            return (
                              <div
                                key={tc.id}
                                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#141414] space-y-2 text-xs"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <Wrench className="w-3.5 h-3.5 text-neutral-500" />
                                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                                      {tc.toolName}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                      tc.status === 'completed'
                                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                        : tc.status === 'waiting_approval'
                                        ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                                    }`}
                                  >
                                    {tc.status === 'completed'
                                      ? `Executed (${tc.durationMs || 85}ms)`
                                      : tc.status === 'waiting_approval'
                                      ? 'Awaiting Human Approval'
                                      : 'Failed'}
                                  </span>
                                </div>

                                <div className="font-mono text-[11px] text-neutral-500 truncate">
                                  Args: {JSON.stringify(tc.args)}
                                </div>

                                {tc.error && (
                                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 p-2 rounded-lg">
                                    {tc.error}
                                  </div>
                                )}

                                {pendingApprovalItem && pendingApprovalItem.status === 'pending' && (
                                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
                                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                                      Sensitive action gated by RBAC policy. Authorize execution?
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => rejectRequest(pendingApprovalItem.id)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                      >
                                        <XCircle className="w-3 h-3" />
                                        <span>Reject</span>
                                      </button>
                                      <button
                                        onClick={() => approveRequest(pendingApprovalItem.id)}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[11px] font-medium hover:opacity-90"
                                      >
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Approve &amp; Execute</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Expandable Reasoning / Thought Process */}
                      {message.thoughtProcess && (
                        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-[#141414] overflow-hidden text-xs">
                          <button
                            onClick={() => toggleThought(message.id)}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                          >
                            <span className="font-medium text-[11px] flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-neutral-400" />
                              Execution Trace &amp; Reasoning Steps
                            </span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="px-3 py-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap bg-white dark:bg-[#111111]">
                              {Array.isArray(message.thoughtProcess)
                                ? message.thoughtProcess.join('\n')
                                : message.thoughtProcess}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content Body */}
                      <div className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap space-y-2">
                        {message.content}
                      </div>

                      {/* RAG Citations */}
                      {message.ragCitations && message.ragCitations.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Sources:
                          </span>
                          {message.ragCitations.map((cit, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                              title={cit.content}
                            >
                              {cit.docTitle} ({Math.round(cit.score * 100)}%)
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Embedded Interactive Action Chips */}
                      {message.suggestedActions && message.suggestedActions.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          {message.suggestedActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCurrentView(action.actionView);
                                showToast(`Navigating to ${action.label}`);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                            >
                              <span>{action.label}</span>
                              <ExternalLink className="w-3 h-3 text-neutral-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message Actions */}
                      <div className="flex items-center gap-2 pt-1 text-neutral-400 text-xs">
                        <button
                          onClick={() => handleCopy(message.id, message.content)}
                          className="flex items-center gap-1 p-1 hover:text-neutral-900 dark:hover:text-neutral-100 rounded"
                          title="Copy response"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[10px]">Copy</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-medium text-xs shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          {isAiTyping && (
            <div className="flex gap-3 items-center text-xs text-neutral-400">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                R
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-850 px-3 py-2 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-300" />
                <span className="text-neutral-500 font-mono text-[11px] ml-1">
                  Orchestrating tools &amp; RAG memory...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Prompt Input Bar */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-white via-white dark:from-[#0d0d0d] dark:via-[#0d0d0d] to-transparent shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.csv,.json,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Active Attachment Badge */}
          {attachment && (
            <div className="mb-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>{attachment.name}</span>
              <span className="text-[10px] text-neutral-400">({attachment.size})</span>
              <button
                onClick={() => setAttachment(null)}
                className="p-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Input Box */}
          <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-sm focus-within:border-neutral-400 dark:focus-within:border-neutral-600 transition-colors p-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="Message ROSE AI OS to execute tools, manage clients, or orchestrate agents..."
              className="w-full bg-transparent resize-none outline-none px-3 pt-1.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 max-h-44"
            />

            {/* Input Toolbar */}
            <div className="flex items-center justify-between pt-1 px-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Attach document for AI analysis"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceModalOpen(true)}
                  className="p-2 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Live Voice Assistant & Receptionist Simulator"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() && !attachment}
                className="p-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-30 disabled:hover:opacity-30 transition-all cursor-pointer"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 text-center text-[11px] text-neutral-400">
            ROSE AI OS · Live Tool Calling, Vector RAG Knowledge &amp; Human-in-the-Loop Governance Active.
          </div>
        </div>
      </div>
    </div>
  );
}
