'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { NavigationView } from '@/types';
import {
  Plus,
  Search,
  MessageSquare,
  Bot,
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  CheckSquare,
  GitBranch,
  Repeat,
  Share2,
  Plug,
  FileText,
  BarChart3,
  Activity,
  CreditCard,
  Settings,
  HelpCircle,
  Calendar,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building,
  Trash2,
  Clock,
  LogOut,
  LogIn,
  Shield,
  User,
} from 'lucide-react';

export default function WorkspaceSidebar() {
  const {
    currentView,
    setCurrentView,
    sidebarCollapsed,
    toggleSidebar,
    mobileMenuOpen,
    setMobileMenuOpen,
    userRole,
    toggleRole,
    userProfile,
    setAuthModalOpen,
    logoutUser,
    switchPersona,
    createNewChat,
    setCommandPaletteOpen,
    conversations,
    activeConversationId,
    setActiveConversationId,
    deleteConversation,
    clients,
    selectedClientId,
  } = useApp();

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const handleNavClick = (view: NavigationView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const navItemClass = (view: NavigationView) => {
    const isActive = currentView === view;
    return `w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left group ${
      isActive
        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
    }`;
  };

  // Render Client Portal Sidebar if client role
  if (userRole === 'client') {
    return (
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#111111] border-r border-neutral-200 dark:border-neutral-800/80 transition-all duration-200 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand & Portal Header */}
        <div className="flex items-center justify-between px-3 py-3.5 border-b border-neutral-200 dark:border-neutral-800/80">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                R
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
                  {selectedClient?.name || 'Client Portal'}
                </div>
                <div className="text-[10px] text-neutral-400 truncate">Customer Portal View</div>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 mx-auto rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
              R
            </div>
          )}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="hidden md:flex p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Client Portal Nav Links */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <button onClick={() => handleNavClick('client/home')} className={navItemClass('client/home')}>
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Welcome Screen</span>}
          </button>
          <button onClick={() => handleNavClick('client/home')} className={navItemClass('client/home')}>
            <MessageSquare className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>AI Assistant</span>}
          </button>
          <button onClick={() => handleNavClick('client/agents')} className={navItemClass('client/agents')}>
            <Bot className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>My AI Agents</span>}
          </button>
          <button onClick={() => handleNavClick('client/conversations')} className={navItemClass('client/conversations')}>
            <Clock className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Conversations</span>}
          </button>
          <button onClick={() => handleNavClick('client/leads')} className={navItemClass('client/leads')}>
            <Users className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Inbound Leads</span>}
          </button>
          <button onClick={() => handleNavClick('client/appointments')} className={navItemClass('client/appointments')}>
            <Calendar className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Appointments</span>}
          </button>
          <button onClick={() => handleNavClick('client/usage')} className={navItemClass('client/usage')}>
            <Activity className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Usage & Credits</span>}
          </button>
          <button onClick={() => handleNavClick('client/integrations')} className={navItemClass('client/integrations')}>
            <Plug className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Integrations</span>}
          </button>
          <button onClick={() => handleNavClick('client/support')} className={navItemClass('client/support')}>
            <LifeBuoy className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Support</span>}
          </button>
        </div>

        {/* Bottom Role & Auth Section */}
        <div className="p-2 border-t border-neutral-200 dark:border-neutral-800/80 space-y-1.5">
          {!sidebarCollapsed ? (
            <div className="p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {userProfile?.displayName || 'Client Portal'}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {userProfile?.email || 'elena@auradynamics.com'}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-300/80 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 uppercase">
                  Client
                </span>
              </div>

              <div className="pt-1.5 border-t border-neutral-300/40 dark:border-neutral-700/60 flex items-center justify-between gap-1 text-[11px]">
                <button
                  onClick={() => switchPersona('super_admin')}
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Switch to Agency Admin view"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Admin View</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                    title="Sign In / Register"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => logoutUser()}
                    className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={toggleRole}
              title="Return to Admin View"
              className="w-full flex items-center justify-center p-2 rounded-lg bg-neutral-200/60 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          )}
        </div>
      </aside>
    );
  }

  // Admin / Agency Owner Full Sidebar
  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#111111] border-r border-neutral-200 dark:border-neutral-800/80 transition-all duration-200 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Brand & Action Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-neutral-200 dark:border-neutral-800/80">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
              R
            </div>
            <span className="text-xs font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              ROSE AI OS
            </span>
          </div>
        ) : (
          <div className="w-6 h-6 mx-auto rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
            R
          </div>
        )}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar width"
          className="hidden md:flex p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Top Quick Actions: New Chat & Search */}
      <div className="px-2 pt-2.5 pb-1 space-y-1">
        <button
          onClick={createNewChat}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-200/70 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && (
            <div className="w-full flex items-center justify-between">
              <span>New Chat</span>
              <kbd className="text-[10px] text-neutral-400 font-mono">⌘N</kbd>
            </div>
          )}
        </button>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && (
            <div className="w-full flex items-center justify-between">
              <span>Search Conversations</span>
              <kbd className="text-[10px] text-neutral-400 font-mono">⌘K</kbd>
            </div>
          )}
        </button>
      </div>

      {/* Main Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
        {/* WORKSPACE */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Workspace
            </div>
          )}
          <div className="space-y-0.5">
            <button onClick={() => handleNavClick('workspace/chat')} className={navItemClass('workspace/chat')}>
              <MessageSquare className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>AI Assistant</span>}
            </button>
            <button onClick={() => handleNavClick('workspace/agent-mode')} className={navItemClass('workspace/agent-mode')}>
              <Bot className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Agent Mode</span>}
            </button>
            <button onClick={() => handleNavClick('workspace/agents')} className={navItemClass('workspace/agents')}>
              <Users className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Agents</span>}
            </button>
          </div>
        </div>

        {/* RECENT CONVERSATIONS (ChatGPT style) */}
        {!sidebarCollapsed && conversations.length > 0 && (
          <div>
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase flex items-center justify-between">
              <span>Recent Chats</span>
              <span className="text-[9px] text-neutral-400 font-mono">{conversations.length}</span>
            </div>
            <div className="space-y-0.5 max-h-36 overflow-y-auto">
              {conversations.slice(0, 5).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setCurrentView('workspace/chat');
                    setMobileMenuOpen(false);
                  }}
                  className={`group flex items-center justify-between px-2 py-1 rounded-md text-xs cursor-pointer transition-colors ${
                    activeConversationId === conv.id && currentView === 'workspace/chat'
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <span className="truncate pr-1 text-[11px]">{conv.title}</span>
                  {conversations.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUSINESS */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Business
            </div>
          )}
          <div className="space-y-0.5">
            <button onClick={() => handleNavClick('business/overview')} className={navItemClass('business/overview')}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Overview</span>}
            </button>
            <button onClick={() => handleNavClick('business/clients')} className={navItemClass('business/clients')}>
              <Building className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Clients</span>}
            </button>
            <button onClick={() => handleNavClick('business/crm')} className={navItemClass('business/crm')}>
              <Briefcase className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>CRM</span>}
            </button>
            <button onClick={() => handleNavClick('business/projects')} className={navItemClass('business/projects')}>
              <Layers className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Projects</span>}
            </button>
            <button onClick={() => handleNavClick('business/tasks')} className={navItemClass('business/tasks')}>
              <CheckSquare className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Tasks</span>}
            </button>
          </div>
        </div>

        {/* AUTOMATION */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Automation
            </div>
          )}
          <div className="space-y-0.5">
            <button onClick={() => handleNavClick('automation/automations')} className={navItemClass('automation/automations')}>
              <Repeat className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Automations</span>}
            </button>
            <button onClick={() => handleNavClick('automation/workflows')} className={navItemClass('automation/workflows')}>
              <GitBranch className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Workflows</span>}
            </button>
            <button onClick={() => handleNavClick('automation/connectors')} className={navItemClass('automation/connectors')}>
              <Share2 className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Connectors</span>}
            </button>
            <button onClick={() => handleNavClick('automation/integrations')} className={navItemClass('automation/integrations')}>
              <Plug className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Integrations</span>}
            </button>
          </div>
        </div>

        {/* MANAGEMENT */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Management
            </div>
          )}
          <div className="space-y-0.5">
            <button onClick={() => handleNavClick('management/knowledge')} className={navItemClass('management/knowledge')}>
              <FileText className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Knowledge Base</span>}
            </button>
            <button onClick={() => handleNavClick('management/analytics')} className={navItemClass('management/analytics')}>
              <BarChart3 className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Analytics</span>}
            </button>
            <button onClick={() => handleNavClick('management/usage')} className={navItemClass('management/usage')}>
              <Activity className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Usage</span>}
            </button>
            <button onClick={() => handleNavClick('management/billing')} className={navItemClass('management/billing')}>
              <CreditCard className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Billing</span>}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-2 border-t border-neutral-200 dark:border-neutral-800/80 space-y-1">
        <button onClick={() => handleNavClick('settings')} className={navItemClass('settings')}>
          <Settings className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </button>
        <button onClick={() => handleNavClick('help')} className={navItemClass('help')}>
          <HelpCircle className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Help & Support</span>}
        </button>

        {/* Profile Card & Role Switcher */}
        <div className="pt-1">
          {!sidebarCollapsed ? (
            <div className="p-2.5 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold flex items-center justify-center shrink-0">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {userProfile?.displayName || 'Agency Admin'}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {userProfile?.email || 'admin@agencyrose.ai'}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-300/80 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 uppercase">
                  {userProfile?.role === 'super_admin' ? 'Owner' : 'Team'}
                </span>
              </div>

              {/* Persona Quick Switches */}
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-neutral-300/40 dark:border-neutral-700/60 text-[10px]">
                <button
                  onClick={() => switchPersona('super_admin')}
                  className={`py-1 px-1 rounded text-center transition-colors cursor-pointer ${
                    userProfile?.role === 'super_admin'
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                      : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                  title="Super Admin (Full system control)"
                >
                  Admin
                </button>
                <button
                  onClick={() => switchPersona('team_member')}
                  className={`py-1 px-1 rounded text-center transition-colors cursor-pointer ${
                    userProfile?.role === 'team_member'
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                      : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                  title="Team Member (Assigned clients only)"
                >
                  Team
                </button>
                <button
                  onClick={() => switchPersona('client')}
                  className={`py-1 px-1 rounded text-center transition-colors cursor-pointer ${
                    userProfile?.role === 'client'
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                      : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                  title="Client Portal (Aura Dynamics)"
                >
                  Client
                </button>
              </div>

              {/* Auth Modal Trigger & Sign Out */}
              <div className="pt-1.5 border-t border-neutral-300/40 dark:border-neutral-700/60 flex items-center justify-between text-[11px] text-neutral-500">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => logoutUser()}
                  className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              title="Sign In / Account"
              className="w-full flex items-center justify-center p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
