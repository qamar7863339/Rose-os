'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Shield,
  LifeBuoy,
  FileText,
  ExternalLink,
} from 'lucide-react';

export default function HelpView() {
  const { setCurrentView, showToast } = useApp();

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full space-y-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Help &amp; Documentation
        </h1>
        <p className="text-xs text-neutral-500">
          Architecture documentation, agent deployment guides, and agency operating guidelines for ROSE AI OS.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Quickstart Guide: Agency Setup
            </h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Learn how to provision client workspaces, connect WhatsApp Business and Google Calendar webhooks, and assign autonomous receptionists.
          </p>
          <button
            onClick={() => {
              setCurrentView('business/clients');
              showToast('Navigating to client management');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200 font-medium hover:underline"
          >
            <span>Open Client Setup</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </button>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Autonomous Agent Mode Directives
            </h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Master the natural language goal execution syntax. Configure multi-agent planner graphs, verification loops, and human-in-the-loop approvals.
          </p>
          <button
            onClick={() => {
              setCurrentView('workspace/agent-mode');
              showToast('Switched to Agent Mode');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200 font-medium hover:underline"
          >
            <span>Explore Agent Mode</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto w-full p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Frequently Answered Inquiries
        </h2>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
              How does the Client Portal role switcher work?
            </div>
            <p className="text-neutral-500 leading-relaxed">
              In Phase 1, you can switch between Agency Admin View and the Customer Client Portal with one click using the top right &quot;Admin View / Client Portal&quot; toggle or bottom sidebar card. The client portal isolates individual client records and strips away all agency controls.
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
              Where are API keys stored?
            </div>
            <p className="text-neutral-500 leading-relaxed">
              API keys and integration tokens are never exposed to client browsers. In this prototype, simulated endpoints demonstrate the multi-channel workflow without leaking sensitive secrets.
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
              Can I customize system prompts for agents?
            </div>
            <p className="text-neutral-500 leading-relaxed">
              Yes, navigating to the Agents hub allows configuring system prompts, selecting foundation models, and defining tool capabilities for each client agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
