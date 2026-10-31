export type UserRole = 'admin' | 'client';

export type NavigationView =
  | 'workspace/chat'
  | 'workspace/agent-mode'
  | 'workspace/agents'
  | 'business/overview'
  | 'business/clients'
  | 'business/client-workspace'
  | 'business/crm'
  | 'business/projects'
  | 'business/tasks'
  | 'automation/automations'
  | 'automation/workflows'
  | 'automation/connectors'
  | 'automation/integrations'
  | 'management/knowledge'
  | 'management/analytics'
  | 'management/usage'
  | 'management/billing'
  | 'settings'
  | 'help'
  | 'client/home'
  | 'client/agents'
  | 'client/conversations'
  | 'client/leads'
  | 'client/appointments'
  | 'client/usage'
  | 'client/integrations'
  | 'client/support';

export interface ToolCallRecord {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  status: 'running' | 'completed' | 'waiting_approval' | 'pending_approval' | 'failed' | 'rejected';
  output?: unknown;
  result?: unknown;
  error?: string;
  durationMs?: number;
  timestamp: string;
  agentName?: string;
  requiresApproval?: boolean;
  approvalId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  provider?: 'gemini' | 'openai' | 'fallback';
  isSimulated?: boolean;
  isStreaming?: boolean;
  thoughtProcess?: string | string[];
  toolCalls?: ToolCallRecord[];
  ragCitations?: {
    docId?: string;
    docTitle?: string;
    title?: string;
    content?: string;
    snippet?: string;
    score: number;
  }[];
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens: number;
    estimatedCostUsd?: number;
  };
  suggestedActions?: {
    label: string;
    actionView: NavigationView;
    payload?: unknown;
  }[];
  attachment?: {
    name: string;
    type: string;
    size: string;
    content?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
  clientId?: string;
}

export type AgentCategory =
  | 'Research Agent'
  | 'CRM Agent'
  | 'Sales Agent'
  | 'Lead Qualification Agent'
  | 'Appointment Setter'
  | 'AI Receptionist'
  | 'Customer Support Agent'
  | 'Marketing Agent'
  | 'Automation Agent'
  | 'Project Manager Agent'
  | 'Data Analysis Agent'
  | 'Knowledge Assistant'
  | 'Custom AI Agent'
  | 'Receptionist'
  | 'Customer Support'
  | 'Lead Qualification'
  | 'Sales & Outreach'
  | 'CRM & Pipeline'
  | 'Project Management'
  | 'Operations'
  | 'Knowledge Base'
  | 'Email & Comms'
  | 'Workflow Automation'
  | 'Research & Analysis'
  | 'Reporting & Analytics'
  | 'Custom';

export interface Agent {
  id: string;
  name: string;
  role?: string;
  category: AgentCategory;
  model: string;
  description: string;
  systemPrompt?: string;
  status: 'active' | 'inactive' | 'paused';
  assignedClientId?: string;
  assignedClientName?: string;
  executionCount: number;
  successRate: number;
  averageResponseTime?: string;
  tools: string[];
  triggers?: string[];
  avatarInitial?: string;
  createdAt?: string;
  memoryEnabled?: boolean;
  maxExecutionSteps?: number;
}

export interface AgentStep {
  id: string;
  agentRole: string;
  title: string;
  status: 'pending' | 'in_progress' | 'waiting_approval' | 'completed' | 'failed';
  log: string;
  details?: string;
  requiresApproval?: boolean;
  approvalGranted?: boolean;
  approvalId?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: unknown;
  output?: string;
  outputPreview?: string;
  retryCount?: number;
}

export interface AgentExecutionTask {
  id: string;
  goal: string;
  targetClient?: string;
  status: 'idle' | 'running' | 'paused' | 'waiting_approval' | 'completed' | 'stopped' | 'failed';
  progress: number;
  currentStepIndex: number;
  steps: AgentStep[];
  startedAt?: string;
  completedAt?: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  toolName: string;
  toolArgs: Record<string, unknown>;
  requestedBy: string;
  clientName?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  workspaceId?: string;
  requestingAgent?: string;
  requestedAction?: string;
  targetResource?: string;
  timestamp?: string;
  approver?: string;
  decisionTimestamp?: string;
  executionResult?: string;
  stepId?: string;
  conversationId?: string;
}

export type MemoryType =
  | 'conversation'
  | 'user_preference'
  | 'workspace_knowledge'
  | 'client_knowledge'
  | 'agent_memory'
  | 'project_context';

export interface WorkspaceMemoryItem {
  id: string;
  scope: MemoryType;
  key: string;
  content: string;
  importance?: 'low' | 'medium' | 'high';
  targetId?: string;
  createdAt: string;
  workspaceId?: string;
  clientId?: string;
  agentId?: string;
  type?: MemoryType;
  isFact?: boolean;
  updatedAt?: string;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  content: string;
  text?: string;
  workspaceId?: string;
  clientId?: string;
  embedding?: number[];
  chunkIndex?: number;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category:
    | 'ai_chat'
    | 'tool_call'
    | 'agent_step'
    | 'agent_orchestration'
    | 'automation'
    | 'connector'
    | 'workflow'
    | 'approval'
    | 'security';
  status: 'success' | 'failed' | 'pending' | 'blocked' | 'warning' | 'error' | 'pending_approval';
  details: string;
  tokensUsed?: number;
  latencyMs?: number;
  workspaceId?: string;
  clientId?: string;
  target?: string;
}

export interface UsageMetrics {
  totalTokensUsed: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  toolCallsExecuted: number;
  agentTasksCompleted: number;
  automationsTriggered: number;
  activeMemoriesCount: number;
  aiRequests?: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  agentExecutions?: number;
  connectorExecutions?: number;
  workflowExecutions?: number;
  voiceMinutes?: number;
  storageBytes?: number;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  email: string;
  contactEmail?: string;
  phone: string;
  status: 'active' | 'onboarding' | 'paused' | 'enterprise' | 'at_risk';
  monthlySpend: number;
  mrr?: number;
  activeAgentsCount?: number;
  activeWorkflowsCount?: number;
  healthScore?: number;
  tokensUsed: number;
  hoursSaved: number;
  assignedAgentIds: string[];
  assignedProjectsCount: number;
  automationsCount: number;
  connectedIntegrations: string[];
  joinedDate: string;
  notes: string;
  website?: string;
  assistantInstructions?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'booked' | 'closed' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: LeadStatus;
  source: string;
  assignedAgent?: string;
  clientId?: string;
  clientName?: string;
  score: number;
  lastContact: string;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  progress: number;
  deadline: string;
  dueDate?: string;
  budget: number;
  assignedAgents: string[];
  tasksCount: number;
  completedTasks: number;
  description: string;
}

export interface TaskItem {
  id: string;
  projectId?: string;
  projectName?: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  agentAutomated: boolean;
  assignedTo: string;
  dueDate: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  triggerApp: string;
  triggerEvent: string;
  actions: {
    app: string;
    description: string;
  }[];
  status: 'active' | 'inactive';
  executionCount: number;
  successRate: number;
  lastRun: string;
  associatedClientId?: string;
  webhookUrl?: string;
  retryPolicy?: 'none' | 'exponential_3x' | 'linear_5x';
}

export interface Integration {
  id: string;
  name: string;
  category: 'Communication' | 'CRM & Sales' | 'Productivity' | 'Automation' | 'Finance';
  icon: string;
  description: string;
  status: 'connected' | 'disconnected';
  connectedAccount?: string;
  lastSync?: string;
  authScopes: string[];
  dataTransferred?: string;
  authType?: 'google_oauth' | 'webhook' | 'api_key' | 'oauth2';
  webhookEndpoint?: string;
  endpointUrl?: string;
  apiKeyMasked?: string;
  isRealOAuth?: boolean;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Company Policy' | 'Product Spec' | 'SOP' | 'Client Onboarding' | 'API Docs';
  fileType: 'PDF' | 'DOCX' | 'MD' | 'TXT' | 'CSV' | 'URL';
  fileSize: string;
  clientId?: string;
  clientName: string;
  dateAdded: string;
  chunksCount: number;
  summary: string;
  content?: string;
  rawContent?: string;
  chunks?: DocumentChunk[];
  downloadUrl?: string;
  storagePath?: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  leadName: string;
  title: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  bookedByAgent: string;
  meetingLink: string;
}

export interface BillingPlan {
  name: string;
  priceMonthly: number;
  creditsIncluded: number;
  activeAgentsLimit: number;
  clientsLimit: number;
  current: boolean;
}
