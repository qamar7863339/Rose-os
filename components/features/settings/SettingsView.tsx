'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Building,
  Sun,
  Moon,
  Bell,
  Shield,
  Users,
  Lock,
  Cpu,
  Check,
  Save,
} from 'lucide-react';

export default function SettingsView() {
  const { theme, toggleTheme, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'workspace' | 'appearance' | 'notifications' | 'security' | 'team' | 'ai'
  >('profile');

  // Form State
  const [profile, setProfile] = useState({
    name: 'Alexander Rose',
    email: 'founder@agencyrose.ai',
    role: 'Managing Principal & Founder',
    timezone: 'UTC-07:00 (Pacific Time)',
  });

  const [aiSettings, setAiSettings] = useState({
    defaultModel: 'ROSE Autonomous v4',
    temperature: 0.7,
    humanInTheLoopThreshold: 'Medium (Outbound Webhooks)',
    maxContextTokens: 32000,
    enableAutonomousWebhooks: true,
  });

  const handleSave = (section: string) => {
    showToast(`${section} settings saved successfully`);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full space-y-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          System Settings
        </h1>
        <p className="text-xs text-neutral-500">
          Configure agency workspace parameters, autonomous AI model guardrails, and access permissions.
        </p>
      </div>

      {/* Main Settings Container */}
      <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-6">
        {/* Settings Navigation Tabs */}
        <div className="w-full md:w-56 space-y-1 shrink-0">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'workspace', label: 'Workspace', icon: Building },
            { id: 'appearance', label: 'Appearance', icon: Sun },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Keys', icon: Shield },
            { id: 'team', label: 'Team Members', icon: Users },
            { id: 'ai', label: 'AI Preferences', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-6">
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  User Profile
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Personal credentials and agency owner identity.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSave('Profile')}
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
                >
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Agency Workspace Details
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Workspace branding and autonomous isolation rules.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Agency Brand Name
                  </label>
                  <input
                    type="text"
                    defaultValue="ROSE AI OS Agency Inc."
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Primary Region
                  </label>
                  <select
                    defaultValue="us-west-1"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    <option value="us-west-1">US West (Oregon) - Low Latency</option>
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="eu-central-1">Europe (Frankfurt) - GDPR Strict</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSave('Workspace')}
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
                >
                  Update Workspace
                </button>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Appearance &amp; Theme
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Minimal monochrome ChatGPT-inspired styling in dark or light mode.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-neutral-500 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Moon className="w-5 h-5" />
                    {theme === 'dark' && <Check className="w-4 h-4" />}
                  </div>
                  <div className="text-xs font-semibold">Dark Theme (Default)</div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    ChatGPT OLED black &amp; neutral greys
                  </div>
                </div>

                <div
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-neutral-500 bg-neutral-100 text-neutral-900'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sun className="w-5 h-5" />
                    {theme === 'light' && <Check className="w-4 h-4" />}
                  </div>
                  <div className="text-xs font-semibold">Light Theme</div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    Clean crisp white &amp; soft borders
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI PREFERENCES */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Autonomous AI Model Configuration
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Tune model selection, reasoning temperature, and human-in-the-loop triggers.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Default Foundation Model
                  </label>
                  <select
                    value={aiSettings.defaultModel}
                    onChange={(e) => setAiSettings({ ...aiSettings, defaultModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    <option value="ROSE Autonomous v4">ROSE Autonomous v4 (Autonomous Orchestrator)</option>
                    <option value="ROSE Reasoning Pro">ROSE Reasoning Pro (Deep Thinking)</option>
                    <option value="ROSE Ultra-Fast 3.5">ROSE Ultra-Fast 3.5 (Sub-second)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Human-In-The-Loop Approval Threshold
                  </label>
                  <select
                    value={aiSettings.humanInTheLoopThreshold}
                    onChange={(e) =>
                      setAiSettings({ ...aiSettings, humanInTheLoopThreshold: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    <option value="Strict">Strict (Approve every outbound SMS &amp; booking)</option>
                    <option value="Medium (Outbound Webhooks)">
                      Medium (Require approval for webhooks &amp; calendar writes)
                    </option>
                    <option value="Full Autonomous">Full Autonomous (Zero friction pass-through)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSave('AI Preferences')}
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
                >
                  Save AI Rules
                </button>
              </div>
            </div>
          )}

          {/* TEAM MEMBERS */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Agency Team Members
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Manage collaborator access to client workspaces.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Invite link generated')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200"
                >
                  + Invite Member
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'Alexander Rose', email: 'founder@agencyrose.ai', role: 'Agency Owner' },
                  { name: 'Sarah Lin', email: 'sarah@agencyrose.ai', role: 'AI Systems Architect' },
                  { name: 'David Miller', email: 'david@agencyrose.ai', role: 'Integration Specialist' },
                ].map((member, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">{member.email}</div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Security &amp; API Keys
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Phase 1 Prototype: API keys are securely proxied server-side via environment variables.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#121212] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                  <Shield className="w-4 h-4 text-neutral-400" />
                  <span>Zero Key Exposure Guarantee</span>
                </div>
                <p className="text-neutral-500 leading-relaxed">
                  ROSE AI OS never transmits secret keys to the browser client. OAuth authorization tokens for Google Calendar, Gmail, and WhatsApp are managed through secured proxy layers.
                </p>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Alert &amp; Escalation Channels
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Define where urgent agent escalations and appointment reminders are sent.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { title: 'Urgent Patient / Lead Escalations', desc: 'Direct Slack webhook to #rose-urgent channel', active: true },
                  { title: 'Daily Autonomous Activity Digest', desc: 'Email summary at 08:00 AM every morning', active: true },
                  { title: 'Human Approval Request Alerts', desc: 'Browser desktop push notifications', active: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      Enabled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
