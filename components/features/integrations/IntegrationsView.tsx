'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Integration } from '@/types';
import {
  Plug,
  CheckCircle2,
  X,
  Search,
  Mail,
  Calendar,
  HardDrive,
  MessageSquare,
  MessageCircle,
  Database,
  Cloud,
  CreditCard,
  Zap,
  Share2,
  Cpu,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Mail: Mail,
  Calendar: Calendar,
  HardDrive: HardDrive,
  MessageSquare: MessageSquare,
  MessageCircle: MessageCircle,
  Database: Database,
  Cloud: Cloud,
  CreditCard: CreditCard,
  Zap: Zap,
  Share2: Share2,
  Cpu: Cpu,
};

export default function IntegrationsView() {
  const {
    integrations,
    toggleIntegrationConnection,
    configureConnector,
    testConnectorAction,
    connectGoogleAccount,
    googleConnectedEmail,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [managingIntegration, setManagingIntegration] = useState<Integration | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);
  const [endpointInput, setEndpointInput] = useState('');
  const [accountInput, setAccountInput] = useState('');

  const categories = ['all', 'Communication', 'CRM & Sales', 'Productivity', 'Automation', 'Finance'];

  const filtered = integrations.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openManageModal = (tool: Integration) => {
    setManagingIntegration(tool);
    setEndpointInput(tool.endpointUrl || '');
    setAccountInput(tool.connectedAccount || '');
    setTestResultMsg(null);
  };

  const handleTestSync = async () => {
    if (!managingIntegration) return;
    setIsSyncing(true);
    setTestResultMsg(null);
    const result = await testConnectorAction(managingIntegration.id);
    setIsSyncing(false);
    setTestResultMsg(result.message);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingIntegration) return;
    await configureConnector(managingIntegration.id, {
      endpointUrl: endpointInput.trim() || undefined,
      connectedAccount: accountInput.trim() || undefined,
    });
    setManagingIntegration(null);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Connectors &amp; Integrations Marketplace
          </h1>
          <p className="text-xs text-neutral-500">
            Authenticate Google Workspace via OAuth 2.0 or configure enterprise webhook &amp; REST connectors.
          </p>
        </div>

        <button
          onClick={() => connectGoogleAccount()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>
            {googleConnectedEmail
              ? `Google Workspace Connected (${googleConnectedEmail})`
              : 'Authorize Google Workspace (OAuth 2.0)'}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool) => {
          const Icon = ICON_MAP[tool.icon] || Plug;
          const isConnected = tool.status === 'connected';

          return (
            <div
              key={tool.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {tool.name}
                        </h3>
                        {tool.isRealOAuth && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-500">
                            OAuth 2.0
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{tool.category}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isConnected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {tool.description}
                </p>

                {isConnected && tool.connectedAccount && (
                  <div className="pt-1 text-[11px] font-mono text-neutral-500 truncate">
                    Account: {tool.connectedAccount}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => openManageModal(tool)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Configure &amp; Test
                </button>

                <button
                  onClick={() => toggleIntegrationConnection(tool.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isConnected
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                      : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90'
                  }`}
                >
                  {isConnected ? 'Disconnect' : tool.isRealOAuth ? 'Connect OAuth' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manage Integration Modal */}
      {managingIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Plug className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {managingIntegration.name} Connector
                </h3>
              </div>
              <button onClick={() => setManagingIntegration(null)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400">Connection Status:</span>
                <span className="font-mono capitalize font-medium text-neutral-900 dark:text-neutral-100">
                  {managingIntegration.status}
                </span>
              </div>

              {!managingIntegration.isRealOAuth && (
                <form onSubmit={handleSaveConfig} className="space-y-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-500">
                      Webhook / API Endpoint URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://hooks.slack.com/services/... or API URL"
                      value={endpointInput}
                      onChange={(e) => setEndpointInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-500">
                      Account / Workspace Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #agency-ops or prod-account"
                      value={accountInput}
                      onChange={(e) => setAccountInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium hover:opacity-90"
                  >
                    Save &amp; Activate Connector
                  </button>
                </form>
              )}

              <div className="space-y-1.5 pt-1">
                <span className="text-neutral-400 font-medium block">Authorized Scopes &amp; Capabilities:</span>
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-100 dark:border-neutral-800 space-y-1">
                  {managingIntegration.authScopes.map((scope, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]"
                    >
                      <CheckCircle2 className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{scope}</span>
                    </div>
                  ))}
                </div>
              </div>

              {testResultMsg && (
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
                  {testResultMsg}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={handleTestSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Run Live API Check</span>
              </button>

              <button
                onClick={() => {
                  toggleIntegrationConnection(managingIntegration.id);
                  setManagingIntegration(null);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90"
              >
                {managingIntegration.status === 'connected' ? 'Disconnect' : 'Connect Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
