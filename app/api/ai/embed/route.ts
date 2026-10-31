import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { verifyServerAuth } from '@/lib/serverAuth';

export async function POST(req: NextRequest) {
  try {
    // Verify caller identity server-side
    const authResult = await verifyServerAuth(req);
    if (!authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required to generate embeddings.' },
        { status: authResult.status || 401 }
      );
    }

    const body = await req.json();
    const texts: string[] = Array.isArray(body.texts) ? body.texts : body.text ? [body.text] : [];

    if (texts.length === 0) {
      return NextResponse.json({ error: 'No text provided for embedding' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured on server', embeddings: [] },
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const result = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: texts.slice(0, 16),
    });

    const embeddings = (result.embeddings || []).map((e) => e.values || []);
    return NextResponse.json({
      model: 'gemini-embedding-2-preview',
      embeddings,
    });
  } catch (err: any) {
    console.error('[API /api/ai/embed] Embedding error:', err?.message || err);
    return NextResponse.json(
      {
        error: err?.message || 'Embedding generation failed',
        embeddings: [],
      },
      { status: 200 }
    );
  }
}
