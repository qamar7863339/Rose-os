import { ChatMessage, NavigationView } from '@/types';

interface SimulatedResponseTemplate {
  keywords: string[];
  title: string;
  thoughtProcess: string;
  response: string;
  suggestedActions: {
    label: string;
    actionView: NavigationView;
    payload?: any;
  }[];
}

const SIMULATED_TEMPLATES: SimulatedResponseTemplate[] = [
  {
    keywords: ['create a new client workspace', 'new client', 'add client', 'client workspace'],
    title: 'Client Workspace Generator',
    thoughtProcess: 'Analyzing client onboarding requirements...\n1. Querying workspace template library for agency clients\n2. Initializing isolated client data sandbox\n3. Setting up permission boundaries & role-based access\n4. Preparing default agent assignments and integrations',
    response: `### Client Workspace Provisioning Initialized

I have prepared the blueprint for a new dedicated client workspace.

**Configured Components:**
- **Isolated Workspace Sandbox**: Dedicated data partition with encryption & audit logging.
- **Client Portal Access**: Clean, white-label client-facing dashboard with role switching.
- **Default AI Agent Allocation**: Slots for 2 autonomous agents (Receptionist & Support).
- **Integration Bridges**: Google Calendar, WhatsApp Business, and CRM webhook listeners.

Would you like me to open the Client Management interface to finalize the company profile and assign the domain?`,
    suggestedActions: [
      { label: 'Open Client Management', actionView: 'business/clients' },
      { label: 'View Sample Client Workspace', actionView: 'business/client-workspace' },
    ],
  },
  {
    keywords: ['build an ai receptionist for my client', 'ai receptionist', 'receptionist', 'frontdesk'],
    title: 'AI Receptionist Builder',
    thoughtProcess: 'Compiling AI Receptionist architecture...\n1. Selecting ROSE Autonomous v4 model for natural conversation\n2. Configuring multilingual voice & chat comprehension\n3. Wiring calendar scheduling tools & conflict prevention logic\n4. Binding WhatsApp & web widget triggers',
    response: `### AI Receptionist Blueprint Generated

I have drafted an **AI Receptionist** agent optimized for client front-desk operations.

**Agent Capabilities:**
- **24/7 Omnichannel Availability**: Answers incoming inquiries across Web Widget, WhatsApp, and SMS.
- **Real-Time Calendar Booking**: Checks Google Calendar for open slots and creates calendar invites with zero conflicts.
- **Lead Intake & Screening**: Captures prospect name, company, intent, and estimated budget before handing off.
- **Smart Escalation**: Detects urgent requests and alerts on-call staff via Slack or SMS.

You can inspect, customize system prompts, or activate this agent directly in the **Agents** hub.`,
    suggestedActions: [
      { label: 'Open AI Agents Hub', actionView: 'workspace/agents' },
      { label: 'Launch in Autonomous Agent Mode', actionView: 'workspace/agent-mode' },
    ],
  },
  {
    keywords: ['create a lead qualification workflow', 'lead qualification', 'lead workflow', 'qualify leads'],
    title: 'Lead Qualification Workflow Orchestrator',
    thoughtProcess: 'Synthesizing automated lead pipeline...\n1. Configuring webhook intake from forms & ad campaigns\n2. Defining scoring heuristic (budget, decision authority, timeline)\n3. Setting up conditional branch: Score > 80 -> Instant calendar invite\n4. Routing lower-score leads to nurture drip campaign',
    response: `### Lead Qualification Workflow Configured

The automation workflow **"Instant Inbound Lead Qualification & SMS Ping"** is ready for deployment.

**Workflow Execution Path:**
1. **Trigger**: Inbound submission from Web Form, Zillow, or Meta Lead Ad.
2. **AI Analysis**: ROSE Autonomous engine parses lead data, computes buyer score (0–100), and checks historical CRM interactions.
3. **High Intent Route (Score $\\ge 80$)**: Automatically schedules showing in Google Calendar, updates HubSpot deal to *Qualified*, and alerts rep via WhatsApp.
4. **Nurture Route (Score $< 80$)**: Enrolls lead in customized 3-part educational email sequence.

Would you like to review and test run this automation?`,
    suggestedActions: [
      { label: 'View Automation Workflows', actionView: 'automation/workflows' },
      { label: 'Inspect CRM Pipeline', actionView: 'business/crm' },
    ],
  },
  {
    keywords: ['show my business performance', 'business performance', 'analytics', 'performance', 'metrics', 'revenue'],
    title: 'Agency Performance Analytics',
    thoughtProcess: 'Compiling agency-wide operational telemetry...\n1. Aggregating client MRR and token consumption\n2. Calculating total autonomous hours saved this month\n3. Querying active agent uptime and success rates\n4. Auditing CRM deal conversion velocity',
    response: `### ROSE AI OS — Business Performance Summary

Here is your executive operational overview for this month:

- **Active Clients**: **5 clients** (4 active, 1 onboarding)
- **Monthly Run Rate**: **$23,300 MRR** (+18.4% month-over-month)
- **Autonomous Hours Saved**: **789 hours** across all client deployments
- **Agent Execution Count**: **11,832 autonomous tasks** completed
- **Workflow Reliability**: **98.2% average success rate**
- **Pipeline Value**: **$509,000** in active CRM opportunities

All system nodes are operating nominally. You can explore deep usage telemetry and client breakdown in the Analytics console.`,
    suggestedActions: [
      { label: 'Open Analytics Console', actionView: 'management/analytics' },
      { label: 'View Usage & Token Telemetry', actionView: 'management/usage' },
      { label: 'Review Billing & Invoices', actionView: 'management/billing' },
    ],
  },
  {
    keywords: ['connect google calendar', 'google calendar', 'calendar', 'connect calendar'],
    title: 'Google Calendar Connector',
    thoughtProcess: 'Checking Google Workspace Integration status...\n1. Verifying OAuth token permissions\n2. Testing bi-directional read/write latency\n3. Checking conflict-resolution webhook endpoints\n4. Syncing provider free/busy availability matrix',
    response: `### Google Calendar Integration

**Status**: **Connected & Active**
- **Account**: \`founder@agencyrose.ai\`
- **Synced Calendars**: 3 (Agency Consultations, Client Showings, VIP Booking)
- **Conflict Prevention**: Active with 15-minute automatic padding buffers.
- **Active Agents Hooked**: *Aura FrontDesk AI*, *Vance Calendar Concierge*.

To reconfigure calendar permissions, add extra practitioner schedules, or link other client accounts, visit the Integrations Marketplace.`,
    suggestedActions: [
      { label: 'Open Integrations Marketplace', actionView: 'automation/integrations' },
      { label: 'Review Client Appointments', actionView: 'business/crm' },
    ],
  },
  {
    keywords: ['create a new ai agent', 'new agent', 'create agent', 'build agent'],
    title: 'Autonomous Agent Creator',
    thoughtProcess: 'Launching agent specification wizard...\n1. Preparing system prompt template with strict security guardrails\n2. Selecting foundation model tier based on latency requirements\n3. Binding available tools (Calendar, WhatsApp, Webhooks, CRM)\n4. Setting human-in-the-loop approval thresholds',
    response: `### Autonomous Agent Creation Wizard

You can configure and launch a new custom AI agent in seconds.

**Available Agent Types:**
- **AI Receptionist** (Omnichannel voice & chat bookings)
- **Customer Support Agent** (Tier 1 triage with SOP vector knowledge)
- **Lead Qualification Agent** (B2B intent scoring & CRM sync)
- **Appointment Setter** (Multi-practitioner schedule coordinator)
- **Sales & Research Agent** (Document parser & pitch evaluation)

Click below to open the interactive **Create Agent** modal.`,
    suggestedActions: [
      { label: 'Launch Create Agent Modal', actionView: 'workspace/agents' },
      { label: 'Switch to Autonomous Agent Mode', actionView: 'workspace/agent-mode' },
    ],
  },
];

export function generateSimulatedAiResponse(
  userPrompt: string,
  modelName: string = 'ROSE Autonomous v4'
): Omit<ChatMessage, 'id' | 'timestamp'> {
  const normalized = userPrompt.toLowerCase().trim();

  // Find best match in templates
  const match = SIMULATED_TEMPLATES.find((t) =>
    t.keywords.some((kw) => normalized.includes(kw))
  );

  if (match) {
    return {
      role: 'assistant',
      content: match.response,
      model: modelName,
      isSimulated: true,
      thoughtProcess: match.thoughtProcess,
      suggestedActions: match.suggestedActions,
    };
  }

  // Fallback intelligent response tailored to ROSE AI OS
  return {
    role: 'assistant',
    content: `### Request Processed by ${modelName}

I have analyzed your directive: **"${userPrompt}"**

**Operational Breakdown:**
1. **System Context**: ROSE AI OS has indexed this request across your connected agency modules.
2. **Autonomous Execution**: Relevant agents and workflows can be scheduled to execute this task with automated human-in-the-loop verification.
3. **Data Integrity**: All client records, CRM pipelines, and vector knowledge bases remain synced.

**Recommended Next Step:**
You can deploy this as an autonomous workflow in **Agent Mode**, or configure individual client assignments in the **Clients** workspace.`,
    model: modelName,
    isSimulated: true,
    thoughtProcess: `Interpreting user query: "${userPrompt}"\n1. Dispatched intent to ${modelName} reasoning engine\n2. Querying local CRM and Agent registry for related records\n3. Formulating structured execution recommendations`,
    suggestedActions: [
      { label: 'Run in Agent Mode', actionView: 'workspace/agent-mode' },
      { label: 'View Business Overview', actionView: 'business/overview' },
      { label: 'Explore Automations', actionView: 'automation/workflows' },
    ],
  };
}
