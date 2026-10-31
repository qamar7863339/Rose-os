'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lead, LeadStatus } from '@/types';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Columns,
  List,
  Phone,
  Mail,
  Building,
  DollarSign,
  ChevronRight,
  Trash2,
  X,
  Bot,
  Sparkles,
} from 'lucide-react';

const PIPELINE_STAGES: { id: LeadStatus; label: string }[] = [
  { id: 'new', label: 'New Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal Sent' },
  { id: 'won', label: 'Deal Won' },
  { id: 'lost', label: 'Closed Lost' },
];

export default function CrmView() {
  const { leads, addLead, updateLeadStatus, deleteLead, clients, showToast } = useApp();

  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add lead form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: 35000,
    status: 'new' as LeadStatus,
    source: 'Website Form',
    assignedAgent: 'Aura FrontDesk AI',
    clientId: clients[0]?.id || '',
    notes: '',
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = clientFilter === 'all' || lead.clientId === clientFilter;
    return matchesSearch && matchesClient;
  });

  const totalPipelineValue = filteredLeads.reduce((acc, curr) => acc + curr.value, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Please provide lead name and email');
      return;
    }

    const assignedClient = clients.find((c) => c.id === formData.clientId);

    addLead({
      name: formData.name,
      company: formData.company || 'Enterprise Prospect',
      email: formData.email,
      phone: formData.phone || '+1 555-0100',
      value: Number(formData.value) || 20000,
      status: formData.status,
      source: formData.source,
      assignedAgent: formData.assignedAgent,
      clientId: formData.clientId,
      clientName: assignedClient?.name || 'Aura Dynamics',
      notes: formData.notes || 'Inbound prospect captured via autonomous channel.',
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      value: 35000,
      status: 'new',
      source: 'Website Form',
      assignedAgent: 'Aura FrontDesk AI',
      clientId: clients[0]?.id || '',
      notes: '',
    });
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            CRM &amp; Pipeline
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track qualified leads, manage deal progression, and inspect autonomous agent interactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'pipeline'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
              title="Kanban Pipeline View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Metrics Summary Bar */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search leads by name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
            />
          </div>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
          <span>{filteredLeads.length} Total Leads</span>
          <span>·</span>
          <span>Pipeline: ${totalPipelineValue.toLocaleString()}</span>
        </div>
      </div>

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === 'pipeline' && (
        <div className="max-w-7xl mx-auto w-full overflow-x-auto pb-4">
          <div className="grid grid-cols-6 gap-3 min-w-[1100px]">
            {PIPELINE_STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
              const stageTotal = stageLeads.reduce((acc, l) => acc + l.value, 0);

              return (
                <div
                  key={stage.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-[#111111] p-3 flex flex-col space-y-3 min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800/80">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="text-[10px] text-neutral-400 font-mono">
                    ${stageTotal.toLocaleString()}
                  </div>

                  {/* Cards List */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161616] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-2xs space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white">
                              {lead.name}
                            </div>
                            <div className="text-[11px] text-neutral-500">{lead.company}</div>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {lead.score}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100 dark:border-neutral-800 text-neutral-500 font-mono">
                          <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                            ${lead.value.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-neutral-400">{lead.clientName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="max-w-7xl mx-auto w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Lead Contact</th>
                <th className="p-3">Company</th>
                <th className="p-3">Deal Value</th>
                <th className="p-3">AI Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">Client Assignment</th>
                <th className="p-3">Last Contact</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer"
                >
                  <td className="p-3 font-medium text-neutral-900 dark:text-neutral-100">
                    {lead.name}
                    <div className="text-[10px] text-neutral-400 font-mono">{lead.email}</div>
                  </td>
                  <td className="p-3 text-neutral-600 dark:text-neutral-300">{lead.company}</td>
                  <td className="p-3 font-mono tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
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
                  <td className="p-3 text-neutral-600 dark:text-neutral-400">{lead.clientName}</td>
                  <td className="p-3 font-mono text-[11px] text-neutral-400">{lead.lastContact}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLead(lead.id);
                      }}
                      className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {selectedLead.name}
                </h2>
                <div className="text-xs text-neutral-500">{selectedLead.company}</div>
              </div>
              <button onClick={() => setSelectedLead(null)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">Estimated Deal Value</span>
                <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  ${selectedLead.value.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">AI Qualification Score</span>
                <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {selectedLead.score} / 100
                </span>
              </div>
            </div>

            {/* Stage Mover Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Move Pipeline Stage:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {PIPELINE_STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      updateLeadStatus(selectedLead.id, s.id);
                      setSelectedLead({ ...selectedLead, status: s.id });
                    }}
                    className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      selectedLead.status === s.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-neutral-400 font-medium">Notes &amp; Agent Observations:</div>
              <p className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121212] text-neutral-700 dark:text-neutral-300 leading-relaxed border border-neutral-100 dark:border-neutral-800">
                {selectedLead.notes}
              </p>
            </div>

            <div className="pt-2 flex justify-between text-xs text-neutral-500 font-mono text-[11px]">
              <span>Assigned Agent: {selectedLead.assignedAgent || 'Unassigned'}</span>
              <span>Client: {selectedLead.clientName}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Add New Lead to CRM
              </h2>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Lead Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Walker"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Industrial"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="liam@apex.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Deal Value ($)
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Pipeline Stage
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Assign to Client
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
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
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Lead background, budget confirmation, or requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
