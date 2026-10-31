'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  Bot,
  Users,
  Calendar,
  Activity,
  CreditCard,
  Plug,
  LifeBuoy,
  Send,
  CheckCircle2,
  Phone,
  Clock,
  Sparkles,
  Shield,
  ArrowRight,
  Plus,
  X,
  ExternalLink,
} from 'lucide-react';

export default function ClientPortalView() {
  const {
    clients,
    selectedClientId,
    agents,
    leads,
    appointments,
    knowledgeDocs,
    toggleRole,
    showToast,
  } = useApp();

  const client = clients.find((c) => c.id === selectedClientId) || clients[0];
  const clientAgents = agents.filter(
    (a) => a.assignedClientId === client.id || (client.assignedAgentIds && client.assignedAgentIds.includes(a.id))
  );
  const clientLeads = leads.filter((l) => l.clientId === client.id || l.clientName === client.name);
  const clientAppointments = appointments.filter((a) => a.clientName === client.name);
  const clientDocs = knowledgeDocs.filter((d) => d.clientId === client.id || d.clientName === client.name);

  // Portal Navigation Sub-view
  const [activePortalTab, setActivePortalTab] = useState<
    'welcome' | 'assistant' | 'agents' | 'conversations' | 'leads' | 'appointments' | 'usage' | 'integrations' | 'support'
  >('welcome');

  // Client AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: `Hello ${client.contactName}! I am your dedicated AI Assistant for ${client.name}. My knowledge retrieval and tools are strictly isolated to ${client.name}'s workspace. How can I help you today?`,
      time: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isClientAiTyping, setIsClientAiTyping] = useState(false);

  // Top up credits modal
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState(14500);

  // Support ticket modal
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  const handleSendChat = async () => {
    if (!chatInput.trim() || isClientAiTyping) return;
    const promptText = chatInput.trim();
    const userMsg = {
      role: 'user' as const,
      text: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const nextHistory = [...chatMessages, userMsg];
    setChatMessages(nextHistory);
    setChatInput('');
    setIsClientAiTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, content: m.text })),
          selectedModel: 'ROSE Autonomous v4',
          userRole: 'client',
          clientScopeId: client.id,
          disableTools: true,
          workspaceContext: {
            clientName: client.name,
            industry: client.industry,
            contactName: client.contactName,
            activeAgents: clientAgents.map((a) => ({ name: a.name, role: a.role })),
            clientLeads: clientLeads.map((l) => ({ name: l.name, company: l.company, value: l.value, status: l.status })),
            upcomingAppointments: clientAppointments,
          },
          ragContext: clientDocs.map((d) => ({
            docTitle: d.title,
            content: d.content || d.summary,
            score: 0.94,
          })),
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            data.text ||
            `I have reviewed ${client.name}'s isolated records (${clientLeads.length} leads, ${clientAppointments.length} appointments).`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Reviewed ${client.name} workspace: ${clientLeads.length} active leads and ${clientAppointments.length} scheduled appointments.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsClientAiTyping(false);
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsSupportOpen(false);
    setSupportMessage('');
    showToast('Support ticket dispatched to agency team. Priority response guaranteed.');
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Top Banner with Client Welcome & Role Notice */}
      <div className="max-w-5xl mx-auto w-full space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#141414]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Customer Workspace
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                Client View
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
              Welcome back, {client.contactName}
            </h1>
            <p className="text-xs text-neutral-500">
              {client.name} · Operating with {clientAgents.length} autonomous AI agents
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleRole}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Return to Agency Admin ↗
            </button>
          </div>
        </div>

        {/* Client Portal Sub-navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-2">
          {[
            { id: 'welcome', label: 'Overview', icon: CheckCircle2 },
            { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
            { id: 'agents', label: `My AI Agents (${clientAgents.length})`, icon: Bot },
            { id: 'leads', label: `Leads (${clientLeads.length})`, icon: Users },
            { id: 'appointments', label: `Appointments (${clientAppointments.length})`, icon: Calendar },
            { id: 'usage', label: 'Usage & Credits', icon: Activity },
            { id: 'integrations', label: 'Integrations', icon: Plug },
            { id: 'support', label: 'Support', icon: LifeBuoy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activePortalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* OVERVIEW / WELCOME TAB */}
        {activePortalTab === 'welcome' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                <div className="text-xs text-neutral-400">Available Credits</div>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                  {creditsBalance.toLocaleString()}
                </div>
                <button
                  onClick={() => setIsTopUpOpen(true)}
                  className="text-[11px] text-neutral-500 underline mt-1 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Top Up Credits +
                </button>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                <div className="text-xs text-neutral-400">Total Hours Saved</div>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                  {client.hoursSaved} hrs
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">This billing cycle</div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                <div className="text-xs text-neutral-400">Qualified Inbound Leads</div>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                  {clientLeads.length}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Scored &gt; 80 intent</div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                <div className="text-xs text-neutral-400">Next Appointment</div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1 truncate">
                  Tomorrow 2:00 PM
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Penthouse Showing</div>
              </div>
            </div>
          </div>
        )}

        {/* IN-PORTAL DEDICATED AI ASSISTANT (Shown on Overview & AI Assistant tabs) */}
        {(activePortalTab === 'welcome' || activePortalTab === 'assistant') && (
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Dedicated AI Assistant · {client.name} (Isolated RAG Scope)
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {clientDocs.length} Client Docs Indexed · Multi-Tenant Guardrails Active
              </span>
            </div>

            {/* Chat Thread */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-tr-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[9px] text-neutral-400 text-right mt-1 font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isClientAiTyping && (
                <div className="text-xs font-mono text-neutral-400 animate-pulse">
                  Querying {client.name} knowledge base...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <input
                type="text"
                placeholder={`Ask ${client.name}'s assistant about leads, property specs, or schedule...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
              <button
                onClick={handleSendChat}
                disabled={isClientAiTyping}
                className="p-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* MY AI AGENTS TAB */}
        {activePortalTab === 'agents' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Active Autonomous Agents for {client.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {agent.name}
                      </h3>
                      <div className="text-xs text-neutral-400 mt-0.5">{agent.category}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {agent.description}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 font-mono text-[11px]">
                    <span>Total Calls / Inquiries: {agent.executionCount}</span>
                    <span>Response: {agent.averageResponseTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activePortalTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Inbound Leads Captured by AI
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {clientLeads.length} prospects
              </span>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Prospect</th>
                    <th className="p-3">Company</th>
                    <th className="p-3">Est. Value</th>
                    <th className="p-3">AI Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Captured By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {clientLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="p-3 font-medium text-neutral-900 dark:text-neutral-100">
                        {lead.name}
                        <div className="text-[10px] text-neutral-400 font-mono">{lead.email}</div>
                      </td>
                      <td className="p-3 text-neutral-600 dark:text-neutral-300">{lead.company}</td>
                      <td className="p-3 font-mono tabular-nums font-medium text-neutral-900 dark:text-neutral-100">
                        ${lead.value.toLocaleString()}
                      </td>
                      <td className="p-3 font-mono text-neutral-800 dark:text-neutral-200">
                        {lead.score}/100
                      </td>
                      <td className="p-3">
                        <span className="capitalize text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 text-neutral-400 text-[11px]">{lead.assignedAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activePortalTab === 'appointments' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Booked Appointments &amp; Showings
            </h2>
            <div className="space-y-3">
              {clientAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {apt.title}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{apt.date}</span>
                      <span>·</span>
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{apt.time}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Prospect: {apt.leadName} · Booked automatically by {apt.bookedByAgent}
                    </div>
                  </div>

                  <a
                    href={apt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shrink-0"
                  >
                    <span>Launch Meeting</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USAGE & CREDITS TAB */}
        {activePortalTab === 'usage' && (
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  AI Credits &amp; Resource Allocation
                </h2>
                <p className="text-xs text-neutral-500">
                  Credits power 24/7 AI receptionist voice conversations and CRM automations.
                </p>
              </div>
              <button
                onClick={() => setIsTopUpOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90"
              >
                Top Up Balance
              </button>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                <span>Credit Utilization</span>
                <span className="font-mono">{creditsBalance.toLocaleString()} / 25,000 Remaining</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 dark:bg-neutral-100"
                  style={{ width: `${(creditsBalance / 25000) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* INTEGRATIONS TAB */}
        {activePortalTab === 'integrations' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Connected Channels for {client.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {client.connectedIntegrations.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Plug className="w-4 h-4 text-neutral-400" />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {tool}
                      </div>
                      <div className="text-[10px] text-neutral-400">Synced with AI Agents</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUPPORT TAB */}
        {activePortalTab === 'support' && (
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Agency Dedicated Concierge Support
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Have a new workflow request or agent adjustment? Direct ticket routing to your agency engineering team.
              </p>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Describe what you need assistance with..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Top Up Credits Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Purchase AI Execution Credits
              </h3>
              <button onClick={() => setIsTopUpOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Phase 1 Prototype: Select a credit bundle to simulate account top-up.
            </p>
            <div className="space-y-2">
              {[
                { amount: 5000, price: '$49' },
                { amount: 15000, price: '$129' },
                { amount: 50000, price: '$349' },
              ].map((tier, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCreditsBalance((b) => b + tier.amount);
                    setIsTopUpOpen(false);
                    showToast(`Added ${tier.amount.toLocaleString()} credits to balance!`);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-xs"
                >
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    +{tier.amount.toLocaleString()} Credits
                  </span>
                  <span className="font-mono text-neutral-500">{tier.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
