'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Bot,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Building,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function PublicPortalView() {
  const { setAuthModalOpen } = useApp();

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0d0d0d] text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Top Notice Bar */}
      <div className="w-full bg-neutral-100 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 text-center text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5 text-neutral-500" />
        <span>Enterprise Multi-Tenant Security Active. Private CRM, business telemetry, and autonomous agents require authentication.</span>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium text-neutral-700 dark:text-neutral-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ROSE AI OS v4.2 &bull; Production Security Hardened</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-tight">
          The AI-Native Business <br /> Operating System
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Unify autonomous AI agents, multi-tenant CRM, client portals, and real Google Workspace execution inside a minimalist, ChatGPT-inspired interface.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Sign In to Access Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            Create Agency Account
          </button>
        </div>
      </div>

      {/* Architectural Pillars Grid */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Autonomous Multi-Agent Brain
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            13 specialized AI archetypes with real backend tool execution, memory retention, and human approval gates.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Multi-Tenant Isolation
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Role-Based Access Control and strict Firestore boundary rules ensuring Client A cannot access Client B&apos;s data or agency CRM.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Real Workspace Connectors
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Live OAuth 2.0 integrations with Gmail, Google Calendar, and Google Drive for production workflows.
          </p>
        </div>
      </div>

      {/* Security Invariants Footer */}
      <div className="mt-auto border-t border-neutral-200 dark:border-neutral-800 py-6 px-6 text-center text-xs text-neutral-500">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>Zero Unauthenticated CRM Exposure</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>Server-Verified JWT Auth</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>No Unverified Admin Escalation</span>
          </span>
        </div>
      </div>
    </div>
  );
}
