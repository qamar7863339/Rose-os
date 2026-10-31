import { FunctionDeclaration, Type } from '@google/genai';
import { SystemRole } from '../permissions/permissionsService';
import {
  Client,
  Lead,
  Project,
  TaskItem,
  Agent,
  AutomationWorkflow,
  KnowledgeDocument,
  WorkspaceMemoryItem,
  UsageMetrics,
} from '@/types';

export interface ToolDefinition {
  name: string;
  category: 'clients' | 'crm' | 'projects' | 'agents' | 'automations' | 'knowledge' | 'reporting' | 'google_workspace' | 'memory';
  description: string;
  allowedRoles: SystemRole[];
  requiresApprovalByDefault: boolean;
  declaration: FunctionDeclaration;
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  // --- CLIENT MANAGEMENT ---
  {
    name: 'create_client',
    category: 'clients',
    description: 'Create a new client workspace and onboarding record in ROSE AI OS.',
    allowedRoles: ['super_admin'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'create_client',
      description: 'Create a new client workspace and onboarding record in ROSE AI OS.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Company or client name (e.g., ABC Realty)' },
          industry: { type: Type.STRING, description: 'Industry vertical (e.g., Real Estate, Healthcare, SaaS)' },
          contactName: { type: Type.STRING, description: 'Primary contact full name' },
          email: { type: Type.STRING, description: 'Primary contact email address' },
          phone: { type: Type.STRING, description: 'Contact phone number' },
          monthlySpend: { type: Type.NUMBER, description: 'Monthly retainer amount in USD' },
          notes: { type: Type.STRING, description: 'Onboarding notes and goals' },
        },
        required: ['name', 'industry'],
      },
    },
  },
  {
    name: 'update_client',
    category: 'clients',
    description: 'Update an existing client record (status, monthly spend, notes, or assistant instructions).',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'update_client',
      description: 'Update an existing client record (status, monthly spend, notes, or assistant instructions).',
      parameters: {
        type: Type.OBJECT,
        properties: {
          clientNameOrId: { type: Type.STRING, description: 'Client ID or Client Name to update' },
          status: { type: Type.STRING, description: 'Status: active, onboarding, paused, or enterprise' },
          monthlySpend: { type: Type.NUMBER, description: 'Updated monthly retainer in USD' },
          notes: { type: Type.STRING, description: 'Updated notes' },
          assistantInstructions: { type: Type.STRING, description: 'Custom instructions for the client AI assistant' },
        },
        required: ['clientNameOrId'],
      },
    },
  },
  {
    name: 'get_client',
    category: 'clients',
    description: 'Retrieve detailed profile, assigned agents, and metrics for a specific client.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'get_client',
      description: 'Retrieve detailed profile, assigned agents, and metrics for a specific client.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          clientNameOrId: { type: Type.STRING, description: 'Client name or ID to look up' },
        },
        required: ['clientNameOrId'],
      },
    },
  },
  {
    name: 'list_clients',
    category: 'clients',
    description: 'List all active and onboarding client workspaces in the agency.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'list_clients',
      description: 'List all active and onboarding client workspaces in the agency.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          statusFilter: { type: Type.STRING, description: 'Optional status filter (active, onboarding, enterprise, paused)' },
        },
      },
    },
  },

  // --- CRM ---
  {
    name: 'create_lead',
    category: 'crm',
    description: 'Create a new CRM prospect/lead record with deal value and qualification notes.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'create_lead',
      description: 'Create a new CRM prospect/lead record with deal value and qualification notes.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Lead full name' },
          company: { type: Type.STRING, description: 'Lead company or organization' },
          email: { type: Type.STRING, description: 'Lead email address' },
          phone: { type: Type.STRING, description: 'Lead phone number' },
          value: { type: Type.NUMBER, description: 'Estimated deal value in USD' },
          status: { type: Type.STRING, description: 'Initial status: new, contacted, qualified, proposal, won, lost' },
          clientName: { type: Type.STRING, description: 'Associated client workspace name' },
          notes: { type: Type.STRING, description: 'Qualification notes' },
        },
        required: ['name', 'company'],
      },
    },
  },
  {
    name: 'update_lead',
    category: 'crm',
    description: 'Update the pipeline stage, score, or notes of an existing CRM lead.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'update_lead',
      description: 'Update the pipeline stage, score, or notes of an existing CRM lead.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          leadNameOrId: { type: Type.STRING, description: 'Lead name, company, or ID' },
          status: { type: Type.STRING, description: 'New status: new, contacted, qualified, proposal, won, lost' },
          notes: { type: Type.STRING, description: 'Updated notes' },
        },
        required: ['leadNameOrId', 'status'],
      },
    },
  },
  {
    name: 'search_leads',
    category: 'crm',
    description: 'Search CRM leads by status (e.g., new, uncontacted, qualified), client, or keyword.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'search_leads',
      description: 'Search CRM leads by status (e.g., new, contacted, qualified, proposal, won), client, or keyword.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, description: 'Filter by lead status (new, contacted, qualified, proposal, won, lost)' },
          query: { type: Type.STRING, description: 'Search keyword for name, company, or client' },
        },
      },
    },
  },
  {
    name: 'assign_lead',
    category: 'crm',
    description: 'Assign a CRM lead to a specific autonomous AI agent or client.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'assign_lead',
      description: 'Assign a CRM lead to a specific autonomous AI agent or client.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          leadNameOrId: { type: Type.STRING, description: 'Lead name or ID' },
          agentName: { type: Type.STRING, description: 'Name of the AI agent to assign' },
        },
        required: ['leadNameOrId', 'agentName'],
      },
    },
  },

  // --- PROJECTS & TASKS ---
  {
    name: 'create_project',
    category: 'projects',
    description: 'Create a new client delivery project with budget and deadline.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'create_project',
      description: 'Create a new client delivery project with budget and deadline.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Project title' },
          clientName: { type: Type.STRING, description: 'Client name' },
          budget: { type: Type.NUMBER, description: 'Project budget in USD' },
          deadline: { type: Type.STRING, description: 'Target deadline date' },
          description: { type: Type.STRING, description: 'Project scope and deliverables' },
        },
        required: ['name', 'clientName'],
      },
    },
  },
  {
    name: 'update_project',
    category: 'projects',
    description: 'Update project status or progress percentage.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'update_project',
      description: 'Update project status or progress percentage.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          projectNameOrId: { type: Type.STRING, description: 'Project name or ID' },
          status: { type: Type.STRING, description: 'Status: planning, in_progress, review, completed' },
          progress: { type: Type.NUMBER, description: 'Progress percentage (0-100)' },
        },
        required: ['projectNameOrId'],
      },
    },
  },
  {
    name: 'create_task',
    category: 'projects',
    description: 'Create an actionable task or follow-up item assigned to a team member or AI agent.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'create_task',
      description: 'Create an actionable task or follow-up item assigned to a team member or AI agent.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Task description or title' },
          projectName: { type: Type.STRING, description: 'Associated project name' },
          priority: { type: Type.STRING, description: 'Priority: low, medium, high' },
          assignedTo: { type: Type.STRING, description: 'Assignee name or AI Agent name' },
          dueDate: { type: Type.STRING, description: 'Due date' },
          agentAutomated: { type: Type.BOOLEAN, description: 'Whether an autonomous agent executes this task' },
        },
        required: ['title'],
      },
    },
  },
  {
    name: 'update_task',
    category: 'projects',
    description: 'Mark a task as todo, in_progress, or done.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'update_task',
      description: 'Mark a task as todo, in_progress, or done.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          taskTitleOrId: { type: Type.STRING, description: 'Task title or ID' },
          status: { type: Type.STRING, description: 'New status: todo, in_progress, done' },
        },
        required: ['taskTitleOrId', 'status'],
      },
    },
  },

  // --- AGENTS ---
  {
    name: 'create_agent',
    category: 'agents',
    description: 'Deploy a new autonomous AI agent (e.g., AI Receptionist, Lead Qualification Agent, Sales Agent, CRM Agent) for a client.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'create_agent',
      description: 'Deploy a new autonomous AI agent (e.g., AI Receptionist, Lead Qualification Agent, Sales Agent, CRM Agent) for a client.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Agent name (e.g., ABC Realty AI Receptionist)' },
          category: {
            type: Type.STRING,
            description:
              'Category: AI Receptionist, Lead Qualification Agent, Appointment Setter, Sales Agent, CRM Agent, Customer Support Agent, Marketing Agent, Research Agent, Automation Agent, Project Manager Agent, Data Analysis Agent, Knowledge Assistant, Custom AI Agent',
          },
          clientName: { type: Type.STRING, description: 'Client name to assign the agent to' },
          description: { type: Type.STRING, description: 'Summary of the agent role and capabilities' },
          systemPrompt: { type: Type.STRING, description: 'Detailed system instructions and guardrails' },
          model: { type: Type.STRING, description: 'Model name (default: ROSE Autonomous v4)' },
        },
        required: ['name', 'category', 'description'],
      },
    },
  },
  {
    name: 'update_agent',
    category: 'agents',
    description: 'Update an autonomous agent status (active/inactive) or system prompt.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'update_agent',
      description: 'Update an autonomous agent status (active/inactive) or system prompt.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          agentNameOrId: { type: Type.STRING, description: 'Agent name or ID' },
          status: { type: Type.STRING, description: 'Status: active or inactive' },
          systemPrompt: { type: Type.STRING, description: 'Updated system prompt instructions' },
        },
        required: ['agentNameOrId'],
      },
    },
  },
  {
    name: 'assign_agent',
    category: 'agents',
    description: 'Assign an existing AI agent to a specific client workspace.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'assign_agent',
      description: 'Assign an existing AI agent to a specific client workspace.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          agentNameOrId: { type: Type.STRING, description: 'Agent name or ID' },
          clientNameOrId: { type: Type.STRING, description: 'Client name or ID' },
        },
        required: ['agentNameOrId', 'clientNameOrId'],
      },
    },
  },

  // --- AUTOMATIONS ---
  {
    name: 'create_workflow',
    category: 'automations',
    description: 'Create an event-driven automation workflow connecting triggers and AI actions.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'create_workflow',
      description: 'Create an event-driven automation workflow connecting triggers and AI actions.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Workflow name' },
          description: { type: Type.STRING, description: 'What the workflow automates' },
          triggerApp: { type: Type.STRING, description: 'Trigger application (e.g., Webhooks & Forms, Gmail, Google Calendar, WhatsApp)' },
          triggerEvent: { type: Type.STRING, description: 'Trigger event (e.g., New Lead Received, Form Submission, Slot Reservation)' },
          actionDescriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Ordered list of action steps executed by the workflow',
          },
        },
        required: ['name', 'triggerApp', 'triggerEvent'],
      },
    },
  },
  {
    name: 'update_workflow',
    category: 'automations',
    description: 'Update an existing automation workflow configuration.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'update_workflow',
      description: 'Update an existing automation workflow configuration.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          workflowNameOrId: { type: Type.STRING, description: 'Workflow name or ID' },
          description: { type: Type.STRING, description: 'Updated description' },
        },
        required: ['workflowNameOrId'],
      },
    },
  },
  {
    name: 'activate_workflow',
    category: 'automations',
    description: 'Activate, pause, or trigger a live execution run of an automation workflow.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'activate_workflow',
      description: 'Activate, pause, or trigger a live execution run of an automation workflow.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          workflowNameOrId: { type: Type.STRING, description: 'Workflow name or ID' },
          status: { type: Type.STRING, description: 'Status: active or inactive' },
          runNow: { type: Type.BOOLEAN, description: 'Whether to execute the workflow pipeline immediately' },
        },
        required: ['workflowNameOrId'],
      },
    },
  },

  // --- KNOWLEDGE & RAG ---
  {
    name: 'search_documents',
    category: 'knowledge',
    description: 'Search the vector knowledge base for SOPs, client specs, pricing matrices, and protocols.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'search_documents',
      description: 'Search the vector knowledge base for SOPs, client specs, pricing matrices, and protocols.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query: { type: Type.STRING, description: 'Semantic search query' },
          clientName: { type: Type.STRING, description: 'Optional client filter' },
        },
        required: ['query'],
      },
    },
  },
  {
    name: 'retrieve_document',
    category: 'knowledge',
    description: 'Retrieve full indexed details and summary of a specific knowledge base document.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'retrieve_document',
      description: 'Retrieve full indexed details and summary of a specific knowledge base document.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          documentTitleOrId: { type: Type.STRING, description: 'Document title or ID' },
        },
        required: ['documentTitleOrId'],
      },
    },
  },

  // --- REPORTING & ANALYTICS ---
  {
    name: 'generate_report',
    category: 'reporting',
    description: 'Generate a real-time executive performance report across clients, CRM leads, agents, and ROI.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'generate_report',
      description: 'Generate a real-time executive performance report across clients, CRM leads, agents, and ROI.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          clientName: { type: Type.STRING, description: 'Optional client name for a client-specific report' },
          reportType: { type: Type.STRING, description: 'Type: agency_overview, client_performance, crm_pipeline, or agent_efficiency' },
        },
      },
    },
  },
  {
    name: 'get_usage_statistics',
    category: 'reporting',
    description: 'Get token usage, AI request counts, agent execution metrics, and hours saved.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'get_usage_statistics',
      description: 'Get token usage, AI request counts, agent execution metrics, and hours saved.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          scope: { type: Type.STRING, description: 'Scope: workspace or client' },
        },
      },
    },
  },

  // --- GOOGLE WORKSPACE (GMAIL, CALENDAR, DRIVE) ---
  {
    name: 'gmail_search_emails',
    category: 'google_workspace',
    description: 'Search authorized Gmail messages and threads using a Gmail query string.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'gmail_search_emails',
      description: 'Search authorized Gmail messages and threads using a Gmail query string.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query: { type: Type.STRING, description: 'Gmail search query (e.g., is:unread, from:client, subject:proposal)' },
          maxResults: { type: Type.NUMBER, description: 'Maximum number of emails to return (default 5)' },
        },
        required: ['query'],
      },
    },
  },
  {
    name: 'gmail_create_draft',
    category: 'google_workspace',
    description: 'Create a Gmail draft email without sending it immediately.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'gmail_create_draft',
      description: 'Create a Gmail draft email without sending it immediately.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          to: { type: Type.STRING, description: 'Recipient email address' },
          subject: { type: Type.STRING, description: 'Email subject line' },
          body: { type: Type.STRING, description: 'Email body content' },
        },
        required: ['to', 'subject', 'body'],
      },
    },
  },
  {
    name: 'gmail_send_email',
    category: 'google_workspace',
    description: 'Send an external email via Gmail. Requires Human-in-the-Loop approval before dispatch.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: true,
    declaration: {
      name: 'gmail_send_email',
      description: 'Send an external email via Gmail. Requires Human-in-the-Loop approval before dispatch.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          to: { type: Type.STRING, description: 'Recipient email address' },
          subject: { type: Type.STRING, description: 'Email subject line' },
          body: { type: Type.STRING, description: 'Email body content' },
        },
        required: ['to', 'subject', 'body'],
      },
    },
  },
  {
    name: 'calendar_list_events',
    category: 'google_workspace',
    description: 'Read upcoming events and availability from Google Calendar.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'calendar_list_events',
      description: 'Read upcoming events and availability from Google Calendar.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          maxResults: { type: Type.NUMBER, description: 'Max upcoming events to fetch (default 10)' },
        },
      },
    },
  },
  {
    name: 'calendar_create_event',
    category: 'google_workspace',
    description: 'Schedule a new appointment or meeting on Google Calendar.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'calendar_create_event',
      description: 'Schedule a new appointment or meeting on Google Calendar.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'Event title / summary' },
          startTimeIso: { type: Type.STRING, description: 'Start time in ISO 8601 format (or natural date/time string)' },
          endTimeIso: { type: Type.STRING, description: 'End time in ISO 8601 format' },
          attendeeEmail: { type: Type.STRING, description: 'Optional attendee email address' },
          description: { type: Type.STRING, description: 'Meeting agenda or description' },
        },
        required: ['summary', 'startTimeIso'],
      },
    },
  },
  {
    name: 'calendar_cancel_event',
    category: 'google_workspace',
    description: 'Cancel and delete an appointment from Google Calendar. Requires Human Approval.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: true,
    declaration: {
      name: 'calendar_cancel_event',
      description: 'Cancel and delete an appointment from Google Calendar. Requires Human Approval.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          eventIdOrTitle: { type: Type.STRING, description: 'Google Calendar event ID or title to cancel' },
          reason: { type: Type.STRING, description: 'Reason for cancellation' },
        },
        required: ['eventIdOrTitle'],
      },
    },
  },
  {
    name: 'drive_search_files',
    category: 'google_workspace',
    description: 'Search files and documents stored in the connected Google Drive account.',
    allowedRoles: ['super_admin', 'team_member'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'drive_search_files',
      description: 'Search files and documents stored in the connected Google Drive account.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query: { type: Type.STRING, description: 'Search keyword for file names in Google Drive' },
        },
        required: ['query'],
      },
    },
  },

  // --- WORKSPACE MEMORY ---
  {
    name: 'store_workspace_memory',
    category: 'memory',
    description: 'Save an important business fact, user preference, or client context to long-term workspace memory.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'store_workspace_memory',
      description: 'Save an important business fact, user preference, or client context to long-term workspace memory.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          key: { type: Type.STRING, description: 'Short topic key (e.g., preferred_followup_cadence)' },
          content: { type: Type.STRING, description: 'Detailed fact or preference to remember' },
          memoryType: {
            type: Type.STRING,
            description: 'Type: workspace_knowledge, user_preference, client_knowledge, agent_memory, project_context',
          },
          isFact: { type: Type.BOOLEAN, description: 'True if verified fact, false if working assumption' },
        },
        required: ['key', 'content'],
      },
    },
  },
  {
    name: 'retrieve_workspace_memory',
    category: 'memory',
    description: 'Retrieve stored workspace memories, preferences, and facts matching a topic.',
    allowedRoles: ['super_admin', 'team_member', 'client'],
    requiresApprovalByDefault: false,
    declaration: {
      name: 'retrieve_workspace_memory',
      description: 'Retrieve stored workspace memories, preferences, and facts matching a topic.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query: { type: Type.STRING, description: 'Topic or keyword to search in memory' },
        },
        required: ['query'],
      },
    },
  },
];

function normalizeSystemRole(role: string): SystemRole {
  if (role === 'client') return 'client';
  if (role === 'team_member') return 'team_member';
  return 'super_admin';
}

/**
 * Returns the Gemini FunctionDeclarations permitted for a given SystemRole or UserRole
 */
export function getPermittedFunctionDeclarations(role: SystemRole | string): FunctionDeclaration[] {
  const normalized = normalizeSystemRole(role);
  return TOOL_REGISTRY.filter((t) => t.allowedRoles.includes(normalized)).map((t) => t.declaration);
}

/**
 * Looks up a tool definition by name
 */
export function getToolDefinition(name: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((t) => t.name === name);
}

/**
 * Checks whether a given role is permitted to execute a tool
 */
export function isToolPermitted(name: string, role: SystemRole | string): boolean {
  const def = getToolDefinition(name);
  if (!def) return true;
  return def.allowedRoles.includes(normalizeSystemRole(role));
}

