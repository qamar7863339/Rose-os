'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Project, TaskItem } from '@/types';
import {
  Layers,
  Plus,
  Search,
  CheckSquare,
  Square,
  Calendar,
  Clock,
  DollarSign,
  Bot,
  User,
  X,
  Columns,
  List,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function ProjectsView() {
  const { projects, tasks, addProject, toggleTaskStatus, addTask, clients, agents, showToast } =
    useApp();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // New project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    clientId: clients[0]?.id || '',
    deadline: 'Dec 15, 2026',
    budget: 25000,
    status: 'planning' as Project['status'],
    description: '',
  });

  // New task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    priority: 'medium' as TaskItem['priority'],
    agentAutomated: true,
    assignedTo: 'Aura FrontDesk AI',
    dueDate: 'Nov 10, 2026',
  });

  const filteredProjects = projects.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    const client = clients.find((c) => c.id === projectForm.clientId);

    addProject({
      name: projectForm.name,
      clientId: projectForm.clientId,
      clientName: client?.name || 'Aura Dynamics',
      deadline: projectForm.deadline,
      budget: Number(projectForm.budget) || 15000,
      status: projectForm.status,
      assignedAgents: ['Aura FrontDesk AI'],
      description: projectForm.description || 'Deliver autonomous agent system for client operations.',
    });

    setIsAddProjectOpen(false);
    setProjectForm({
      name: '',
      clientId: clients[0]?.id || '',
      deadline: 'Dec 15, 2026',
      budget: 25000,
      status: 'planning',
      description: '',
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    addTask({
      projectId: selectedProjectId || projects[0]?.id,
      projectName: projects.find((p) => p.id === selectedProjectId)?.name || projects[0]?.name,
      title: taskForm.title,
      status: 'todo',
      priority: taskForm.priority,
      agentAutomated: taskForm.agentAutomated,
      assignedTo: taskForm.assignedTo,
      dueDate: taskForm.dueDate,
    });

    setIsAddTaskOpen(false);
    setTaskForm({
      title: '',
      priority: 'medium',
      agentAutomated: true,
      assignedTo: 'Aura FrontDesk AI',
      dueDate: 'Nov 10, 2026',
    });
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Projects &amp; Deliverables
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Coordinate agency milestones, assign autonomous agents to deliverables, and manage task backlogs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
              title="Board View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid / Board */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProjectId(project.id)}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 ${
              selectedProjectId === project.id
                ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-50/80 dark:bg-[#181818]'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-neutral-300 dark:hover:border-neutral-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {project.name}
                </h3>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Client: {project.clientName}
                </div>
              </div>
              <span className="capitalize text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {project.description}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-500 font-mono">
                <span>Milestone Completion</span>
                <span className="tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
                  {project.progress}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 dark:bg-neutral-100"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Footer metrics */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-mono text-[11px]">
              <span>Deadline: {project.deadline}</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Budget: ${project.budget.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Section */}
      <div className="max-w-6xl mx-auto w-full p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Task Checklist &amp; Agent Automations
            </h2>
            <p className="text-xs text-neutral-500">
              Tasks executed autonomously by assigned agents or team specialists.
            </p>
          </div>
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTaskStatus(task.id)}
              className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-medium truncate ${
                      task.status === 'done'
                        ? 'line-through text-neutral-400'
                        : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    {task.projectName} · Due {task.dueDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.agentAutomated && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                    <Bot className="w-3 h-3 text-neutral-500" />
                    AI Automated
                  </span>
                )}
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-500">
                  {task.priority}
                </span>
                <span className="text-xs text-neutral-400 hidden sm:inline">{task.assignedTo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Create Project
              </h2>
              <button onClick={() => setIsAddProjectOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omnichannel Support AI"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Client
                  </label>
                  <select
                    value={projectForm.clientId}
                    onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Scope Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Deliverables and success milestones..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Add Deliverable Task
              </h2>
              <button onClick={() => setIsAddTaskOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit WhatsApp webhook latency"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Assignee / Agent
                  </label>
                  <input
                    type="text"
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agentAuto"
                  checked={taskForm.agentAutomated}
                  onChange={(e) => setTaskForm({ ...taskForm, agentAutomated: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="agentAuto" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  Execute autonomously via AI Agent
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
