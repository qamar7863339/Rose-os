'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Client } from '@/types';
import {
  Search,
  Plus,
  Building,
  Users,
  Briefcase,
  Bot,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  Phone,
  Mail,
  Globe,
  Clock,
  Check,
} from 'lucide-react';

export default function ClientsView() {
  const { clients, addClient, deleteClient, viewClientWorkspace, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'enterprise' | 'onboarding' | 'paused'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add Client
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Real Estate & Property',
    contactName: '',
    email: '',
    phone: '',
    status: 'active' as Client['status'],
    monthlySpend: 3500,
    website: '',
    notes: '',
  });

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Please provide client name and email');
      return;
    }

    addClient({
      name: formData.name,
      industry: formData.industry,
      contactName: formData.contactName || 'Primary Contact',
      email: formData.email,
      phone: formData.phone || '+1 (555) 000-0000',
      status: formData.status,
      monthlySpend: Number(formData.monthlySpend) || 2500,
      assignedAgentIds: ['agent-1'],
      assignedProjectsCount: 1,
      automationsCount: 2,
      connectedIntegrations: ['Google Calendar', 'WhatsApp'],
      notes: formData.notes || 'Newly onboarded client workspace.',
      website: formData.website || `https://${formData.name.toLowerCase().replace(/\s+/g, '')}.com`,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      industry: 'Real Estate & Property',
      contactName: '',
      email: '',
      phone: '',
      status: 'active',
      monthlySpend: 3500,
      website: '',
      notes: '',
    });
  };

  const getStatusStyle = (status: Client['status']) => {
    switch (status) {
      case 'enterprise':
        return 'text-neutral-900 dark:text-neutral-100 font-semibold';
      case 'active':
        return 'text-neutral-800 dark:text-neutral-200';
      case 'onboarding':
        return 'text-neutral-600 dark:text-neutral-400';
      case 'paused':
        return 'text-neutral-400 dark:text-neutral-500 line-through';
      default:
        return 'text-neutral-500';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Client Directory
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage agency accounts, monitor autonomous token consumption, and launch dedicated client workspaces.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by client, contact, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'active', 'enterprise', 'onboarding', 'paused'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === filter
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs"
          >
            {/* Top row */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-bold text-sm shrink-0">
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                      {client.name}
                    </h3>
                    <div className="text-xs text-neutral-500 mt-0.5">{client.industry}</div>
                  </div>
                </div>

                <span className={`text-[11px] font-mono capitalize ${getStatusStyle(client.status)}`}>
                  {client.status}
                </span>
              </div>

              {/* Contact info list */}
              <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{client.contactName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate font-mono">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate font-mono">{client.phone}</span>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-neutral-400 text-[10px]">Monthly Retainer</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-0.5">
                  ${client.monthlySpend.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-neutral-400 text-[10px]">Hours Saved</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-0.5">
                  {client.hoursSaved}h
                </div>
              </div>
              <div>
                <div className="text-neutral-400 text-[10px]">Active Agents</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-0.5">
                  {client.assignedAgentIds.length}
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => deleteClient(client.id)}
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Remove client"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => viewClientWorkspace(client.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <span>Open Workspace</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Add New Client
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Ventures"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SaaS / Real Estate"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@apex.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 555-0192"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Monthly Retainer ($)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlySpend}
                    onChange={(e) => setFormData({ ...formData, monthlySpend: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Notes &amp; Operational Directives
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions or compliance requirements..."
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
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
