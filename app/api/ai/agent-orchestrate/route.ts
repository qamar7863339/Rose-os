import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { verifyServerAuth } from '@/lib/serverAuth';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify caller identity server-side
    const authResult = await verifyServerAuth(req);
    if (!authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required to orchestrate multi-agent workflows.' },
        { status: authResult.status || 401 }
      );
    }

    if (authResult.user.role === 'client') {
      return NextResponse.json(
        { error: 'Forbidden: Client portal users cannot trigger workspace-wide autonomous agent orchestration.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { goal, targetClient, workspaceContext = {}, availableAgents = [] } = body;

    if (!goal || typeof goal !== 'string') {
      return NextResponse.json({ error: 'Goal is required for Agent Orchestration' }, { status: 400 });
    }

    const prompt = `You are the Autonomous Multi-Agent Orchestrator for ROSE AI OS.
Decompose the following executive goal into a concrete, sequential 5-step multi-agent execution plan that uses real tools in the ROSE AI OS ecosystem.

GOAL: "${goal}"
TARGET CLIENT: "${targetClient || 'Workspace-Wide'}"

AVAILABLE SPECIALIZED AGENTS:
${JSON.stringify(availableAgents, null, 2)}

WORKSPACE SNAPSHOT:
${JSON.stringify(workspaceContext, null, 2)}

AVAILABLE BACKEND TOOLS (Optional toolName per step if the step performs a real database or workspace mutation):
- create_client (args: name, industry, contactName, contactEmail, status, mrr)
- update_client_status (args: clientNameOrId, status, healthScore)
- create_crm_lead (args: company, contact, email, value, stage, probability)
- move_crm_deal_stage (args: dealCompanyOrId, stage)
- create_project (args: name, clientName, status, deadline, progress)
- create_project_task (args: projectNameOrId, title, assignee, priority, dueDate)
- create_ai_agent (args: name, role, category, description, model)
- create_automation_workflow (args: name, description, trigger, steps, targetClient)
- query_knowledge_base (args: query, clientFilter)
- generate_executive_report (args: reportType, period)
- store_workspace_memory (args: scope, key, content, importance, targetId)
- gmail_create_draft (args: to, subject, body)
- gmail_send_email (args: to, subject, body) [requiresApproval: true]
- calendar_create_event (args: summary, description, startTime, endTime)

Rules:
1. Create exactly 5 logical steps progressing from discovery/context retrieval -> strategy/creation -> tool execution -> external communication/approval -> memory & audit logging.
2. Assign the most appropriate specialized agent name to "agentRole" for each step.
3. Include a concrete "toolName" and "toolArgs" JSON string when a step creates records, queries knowledge, drafts emails, or stores memory.
4. Set "requiresApproval" to true for steps that send external communications, modify production workflows, or commit client deliverables.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planSummary: {
              type: Type.STRING,
              description: 'Executive summary of the autonomous multi-agent execution strategy.',
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  agentRole: { type: Type.STRING },
                  details: { type: Type.STRING },
                  toolName: {
                    type: Type.STRING,
                    description: 'Name of the backend tool to execute in this step, or empty string if reasoning only.',
                  },
                  toolArgsJson: {
                    type: Type.STRING,
                    description: 'JSON string of arguments for toolName, e.g. {"name":"Acme"}',
                  },
                  requiresApproval: { type: Type.BOOLEAN },
                },
                required: ['title', 'agentRole', 'details', 'toolName', 'toolArgsJson', 'requiresApproval'],
              },
            },
          },
          required: ['planSummary', 'steps'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"planSummary":"","steps":[]}');
    const formattedSteps = (parsed.steps || []).map(
      (
        s: {
          title: string;
          agentRole: string;
          details: string;
          toolName?: string;
          toolArgsJson?: string;
          requiresApproval?: boolean;
        },
        idx: number
      ) => {
        let toolArgs: Record<string, unknown> = {};
        if (s.toolArgsJson) {
          try {
            toolArgs = JSON.parse(s.toolArgsJson);
          } catch {
            toolArgs = {};
          }
        }
        return {
          id: `step-${Date.now()}-${idx + 1}`,
          title: s.title,
          agentRole: s.agentRole,
          details: s.details,
          toolName: s.toolName || undefined,
          toolArgs: Object.keys(toolArgs).length > 0 ? toolArgs : undefined,
          requiresApproval: Boolean(s.requiresApproval),
          status: 'pending' as const,
        };
      }
    );

    return NextResponse.json({
      planSummary: parsed.planSummary,
      steps: formattedSteps,
    });
  } catch (error) {
    console.error('Agent Orchestration Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to orchestrate agent plan' },
      { status: 500 }
    );
  }
}
