'use client';
import React, { ReactNode, useState } from 'react';
import { useApp } from '@/context/AppContext';
import WorkspaceSidebar from './WorkspaceSidebar';
import CommandPalette from '../modals/CommandPalette';
import VoiceModal from '../modals/VoiceModal';
import AuthModal from '../modals/AuthModal';
import {
  Menu,
  X,
  Sun,
  Moon,
  Search,
  UserCheck,
  ShieldAlert,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Shield,
  Sparkles,
} from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const {
    currentView,
    userRole,
    toggleRole,
    userProfile,
    authModalOpen,
    setAuthModalOpen,
    logoutUser,
    switchPersona,
    theme,
    toggleTheme,
    mobileMenuOpen,
    setMobileMenuOpen,
    setCommandPaletteOpen,
    toastMessage,
  } = useApp();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'workspace/chat':
        return 'AI Assistant Workspace';
      case 'workspace/agent-mode':
        return 'Autonomous Agent Mode';
      case 'workspace/agents':
        return 'AI Agents Hub';
      case 'business/overview':
        return 'Business Overview';
      case 'business/clients':
        return 'Clients Management';
      case 'business/client-workspace':
        return 'Client Dedicated Workspace';
      case 'business/crm':
        return 'CRM & Pipeline';
      case 'business/projects':
        return 'Projects Management';
      case 'business/tasks':
        return 'Tasks & Deliverables';
      case 'automation/automations':
      case 'automation/workflows':
        return 'Automations & Workflows';
      case 'automation/connectors':
        return 'API Connectors';
      case 'automation/integrations':
        return 'Integrations Marketplace';
      case 'management/knowledge':
        return 'Knowledge Base';
      case 'management/analytics':
        return 'Business Analytics';
      case 'management/usage':
        return 'Usage Telemetry';
      case 'management/billing':
        return 'Billing & Subscriptions';
      case 'settings':
        return 'System Settings';
      case 'help':
        return 'Help & Documentation';
      case 'client/home':
        return 'Client Portal · AI Assistant';
      case 'client/agents':
        return 'Client Portal · My AI Agents';
      case 'client/conversations':
        return 'Client Portal · Conversations';
      case 'client/leads':
        return 'Client Portal · Inbound Leads';
      case 'client/appointments':
        return 'Client Portal · Appointments';
      case 'client/usage':
        return 'Client Portal · Usage & Credits';
      case 'client/integrations':
        return 'Client Portal · Connected Integrations';
      case 'client/support':
        return 'Client Portal · Support Concierge';
      default:
        return 'ROSE AI OS';
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0d0d0d] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-800 selection:text-white">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Collapsible Left Sidebar */}
      <WorkspaceSidebar />

      {/* Main Execution Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar Contract (3 zones) */}
        <header className="h-12 border-b border-neutral-200 dark:border-neutral-800/80 px-4 flex items-center justify-between gap-4 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-sm shrink-0 z-20">
          {/* Zone 1: Brand Wordmark & Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md md:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
              ROSE AI OS
            </span>
          </div>

          {/* Zone 2: Context Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 min-w-0 truncate">
            <span className="truncate">{getBreadcrumbTitle()}</span>
            {userRole === 'admin' ? (
              <span className="text-[11px] text-neutral-400 font-mono hidden lg:inline">
                · Agency Admin Console
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400 font-mono hidden lg:inline">
                · Aura Dynamics Portal
              </span>
            )}
          </div>

          {/* Zone 3: Primary Action & Essential Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Command Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/60 rounded-md transition-colors"
              title="Search and commands (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] text-neutral-400">⌘K</span>
            </button>

            {/* Account & Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                title="Account & Persona"
              >
                <div className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline font-medium text-[11px] max-w-[90px] truncate">
                  {userProfile?.displayName || 'Account'}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {accountMenuOpen && (
                <>
                  <div
                    onClick={() => setAccountMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 p-3 space-y-3 text-xs">
                    {/* User Identity */}
                    <div className="pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                        <span className="truncate">{userProfile?.displayName || 'Authenticated User'}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          {userProfile?.role || 'team_member'}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {userProfile?.email || 'No email attached'}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mt-1 truncate">
                        WS: {userProfile?.workspaceId || 'workspace-rose-agency'}
                      </div>
                    </div>

                    {/* Quick Switch Persona (Multi-Tenant Evaluation) */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Switch Test Persona
                      </div>
                      <button
                        onClick={() => {
                          switchPersona('super_admin');
                          setAccountMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          userProfile?.role === 'super_admin'
                            ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Alexander Rose (Super Admin)</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          switchPersona('team_member');
                          setAccountMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          userProfile?.role === 'team_member'
                            ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5" />
                          <span>Sarah Lin (Team Member)</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          switchPersona('client');
                          setAccountMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          userProfile?.role === 'client'
                            ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Elena Rostova (Client Portal)</span>
                        </div>
                      </button>
                    </div>

                    {/* Action Links */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setAuthModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Sign In / Create Account</span>
                      </button>
                      <button
                        onClick={async () => {
                          setAccountMenuOpen(false);
                          await logoutUser();
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={toggleRole}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                userRole === 'admin'
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
              }`}
              title="Switch between Admin & Client Portal views"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{userRole === 'admin' ? 'Admin View' : 'Client Portal'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-white dark:bg-[#0d0d0d]">
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette />

      {/* Voice Assistant UI Prototype */}
      <VoiceModal />

      {/* Firebase Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium shadow-xl transition-all">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
