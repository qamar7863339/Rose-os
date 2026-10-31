import { GoogleGenAI, FunctionDeclaration } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { getPermittedFunctionDeclarations } from '@/services/ai/toolRegistry';
import { verifyServerAuth } from '@/lib/serverAuth';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
});

function resolveGeminiModel(selectedModel?: string): string {
  if (!selectedModel) return 'gemini-3.8-flash';
  const normalized = selectedModel.toLowerCase();
  if (normalized.includes('ultra-fast') || normalized.includes('lite')) {
    return 'gemini-3.1-flash-lite';
  }
  return 'gemini-3.8-flash';
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Verify caller identity server-side
    const authResult = await verifyServerAuth(req);
    if (!authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required to access AI workspace.' },
        { status: authResult.status || 401 }
      );
    }
    const verifiedUser = authResult.user;

    const body = await req.json();
    const {
      messages = [],
      selectedModel = 'ROSE Autonomous v4',
      workspaceContext = {},
      ragContext = [],
      memories = [],
      systemOverride = '',
      clientScopeId = null,
      disableTools = false,
      toolExecutionResults = null,
    } = body;

    // Strict Security: Derive effectiveRole from verified session identity, NEVER trust body
    const effectiveRole = verifiedUser.role;
    const effectiveClientScopeId = effectiveRole === 'client' ? verifiedUser.clientId : clientScopeId;

    const modelName = resolveGeminiModel(selectedModel);
    const permittedDeclarations: FunctionDeclaration[] = disableTools
      ? []
      : getPermittedFunctionDeclarations(effectiveRole);

    // Construct comprehensive AI OS System Instruction
    const ragSection =
      Array.isArray(ragContext) && ragContext.length > 0
        ? `\n\n=== RETRIEVED KNOWLEDGE BASE CONTEXT (RAG) ===\n${ragContext
            .map(
              (c: { docTitle?: string; content?: string; score?: number }, i: number) =>
                `[Source ${i + 1}: ${c.docTitle || 'Document'} (Relevance: ${Math.round((c.score || 0.85) * 100)}%)]\n${c.content}`
            )
            .join('\n\n')}`
        : '';

    const memorySection =
      Array.isArray(memories) && memories.length > 0
        ? `\n\n=== PERSISTENT WORKSPACE MEMORY ===\n${memories
            .slice(0, 15)
            .map(
              (m: { scope?: string; key?: string; content?: string }) =>
                `- [${m.scope || 'workspace'}] ${m.key}: ${m.content}`
            )
            .join('\n')}`
        : '';

    const clientIsolationInstruction = effectiveClientScopeId
      ? `\nCRITICAL SECURITY BOUNDARY: You are operating inside an authenticated Client Portal for Client ID "${effectiveClientScopeId}". You MUST ONLY reference data, projects, tasks, and knowledge belonging to this specific client. Never disclose or modify other clients' records or agency CRM data.`
      : '';

    const baseSystemInstruction =
      systemOverride ||
      `You are ROSE AI OS (${selectedModel}), a principal AI-Native Business Operating System for managing clients, CRM pipelines, projects, autonomous AI agents, automations, knowledge bases, and Google Workspace integrations.

CURRENT OPERATOR ROLE: ${effectiveRole}
${clientIsolationInstruction}

OPERATIONAL DIRECTIVES:
1. REAL ACTION EXECUTION: You do not merely describe what you would do. When the user asks you to create a client, add a CRM lead, create a project or task, deploy an AI agent, build an automation, search the knowledge base, generate an executive report, store a workspace memory, or interact with Gmail / Google Calendar / Google Drive, you MUST invoke the corresponding tool function immediately.
2. SENSITIVE ACTIONS & APPROVALS: Certain sensitive tools (such as sending external emails, cancelling calendar events, or deleting records) require human approval. Still invoke the tool call when requested—the ROSE Tool Calling Engine will automatically intercept sensitive tool calls and present an inline Approval Card to the operator if required.
3. GROUNDED INTELLIGENCE: Always ground your answers in the live Workspace Snapshot, Retrieved Knowledge Base Context (RAG), and Persistent Workspace Memory provided below. Cite knowledge base sources clearly when used.
4. MINIMALIST CLARITY: Format responses with crisp, scannable Markdown, structured tables or bullet points, and executive precision.

=== LIVE WORKSPACE SNAPSHOT ===
${JSON.stringify(workspaceContext, null, 2)}${ragSection}${memorySection}`;

    // Build conversation contents for Gemini
    const contents: Array<{
      role: 'user' | 'model';
      parts: Array<{ text?: string }>;
    }> = [];

    for (const msg of messages.slice(-16)) {
      const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
      const text = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
      if (text.trim()) {
        contents.push({
          role,
          parts: [{ text }],
        });
      }
    }

    // If toolExecutionResults are provided as a follow-up turn to synthesize final response
    if (toolExecutionResults && Array.isArray(toolExecutionResults) && toolExecutionResults.length > 0) {
      contents.push({
        role: 'user',
        parts: [
          {
            text: `SYSTEM TOOL EXECUTION RESULTS:\n${JSON.stringify(
              toolExecutionResults,
              null,
              2
            )}\n\nPlease provide a clear, accurate summary of the actions executed and any pending approvals for the user.`,
          },
        ],
      });
    }

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Hello ROSE AI OS.' }],
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: baseSystemInstruction,
        temperature: 0.25,
        ...(permittedDeclarations.length > 0 && !toolExecutionResults
          ? { tools: [{ functionDeclarations: permittedDeclarations }] }
          : {}),
      },
    });

    const functionCalls = (response.functionCalls || []).map((fc, idx) => ({
      id: `call-${Date.now()}-${idx}`,
      name: fc.name || 'unknown_tool',
      args: (fc.args as Record<string, unknown>) || {},
    }));

    const text = response.text || '';
    const usageMetadata = response.usageMetadata;
    const promptTokens = usageMetadata?.promptTokenCount || 320;
    const completionTokens = usageMetadata?.candidatesTokenCount || 180;
    const totalTokens = usageMetadata?.totalTokenCount || promptTokens + completionTokens;
    const estimatedCostUsd = Number(((totalTokens / 1_000_000) * 0.35).toFixed(6));

    return NextResponse.json({
      text,
      functionCalls,
      modelUsed: modelName,
      latencyMs: Date.now() - startTime,
      tokenUsage: {
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd,
      },
    });
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process AI request',
        text: 'ROSE AI encountered a temporary provider issue while processing your request. Please verify your configuration or try again.',
        functionCalls: [],
      },
      { status: 500 }
    );
  }
}
