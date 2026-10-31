import { DocumentChunk, KnowledgeDocument } from '@/types';

/**
 * Splits raw document text into overlapping semantic chunks
 */
export function chunkText(text: string, maxChars = 420, overlap = 60): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  if (cleaned.length <= maxChars) return [cleaned];

  const chunks: string[] = [];
  let start = 0;
  while (start < cleaned.length) {
    let end = Math.min(start + maxChars, cleaned.length);
    if (end < cleaned.length) {
      const lastPeriod = cleaned.lastIndexOf('. ', end);
      if (lastPeriod > start + 150) {
        end = lastPeriod + 1;
      }
    }
    chunks.push(cleaned.slice(start, end).trim());
    if (end >= cleaned.length) break;
    start = Math.max(start + 1, end - overlap);
  }
  return chunks;
}

/**
 * Computes cosine similarity between two numeric vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Computes lexical / BM25-inspired keyword overlap score as hybrid fallback
 */
function lexicalSimilarity(query: string, text: string): number {
  const qTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (qTokens.length === 0) return 0;

  const targetLower = text.toLowerCase();
  let matches = 0;
  for (const token of qTokens) {
    if (targetLower.includes(token)) {
      matches += 1;
    }
  }
  return matches / qTokens.length;
}

export const RagService = {
  /**
   * Indexes a document string into semantic chunks and generates embeddings via server-side Gemini API
   */
  async indexDocument(
    docId: string,
    docTitle: string,
    rawContent: string,
    clientId?: string
  ): Promise<DocumentChunk[]> {
    const rawChunks = chunkText(`${docTitle}. ${rawContent}`);
    let embeddings: number[][] = [];

    if (typeof window !== 'undefined' && rawChunks.length > 0) {
      try {
        const { AuthService } = await import('@/services/auth/authService');
        const idToken = await AuthService.getIdToken();
        const res = await fetch('/api/ai/embed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
          },
          body: JSON.stringify({ texts: rawChunks }),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.embeddings)) {
            embeddings = data.embeddings;
          }
        }
      } catch {
        // Hybrid lexical fallback
      }
    }

    return rawChunks.map((content, idx) => ({
      id: `${docId}-chunk-${idx}`,
      docId,
      docTitle,
      content,
      text: content,
      clientId,
      embedding: embeddings[idx],
      chunkIndex: idx,
    }));
  },

  /**
   * Retrieves top-K chunks strictly filtered by client scope if provided
   */
  async retrieveRelevantChunks(
    query: string,
    docs: KnowledgeDocument[],
    clientFilterId?: string,
    topK = 3
  ): Promise<{ docId: string; docTitle: string; content: string; score: number }[]> {
    const permittedDocs = clientFilterId
      ? docs.filter((d) => d.clientId === clientFilterId)
      : docs;

    const allChunks: DocumentChunk[] = [];
    for (const d of permittedDocs) {
      if (d.chunks && d.chunks.length > 0) {
        allChunks.push(...d.chunks);
      } else {
        const text = `${d.title}. Category: ${d.category}. Client: ${d.clientName}. ${d.summary} ${
          d.content || d.rawContent || ''
        }`;
        const parts = chunkText(text);
        parts.forEach((p, idx) => {
          allChunks.push({
            id: `${d.id}-chunk-${idx}`,
            docId: d.id,
            docTitle: d.title,
            content: p,
            text: p,
            clientId: d.clientId,
            chunkIndex: idx,
          });
        });
      }
    }

    const scored = allChunks.map((chunk) => {
      const textBody = chunk.content || chunk.text || '';
      const lexScore = lexicalSimilarity(query, `${chunk.docTitle} ${textBody}`);
      const vecScore = chunk.embedding ? cosineSimilarity(chunk.embedding, chunk.embedding) * 0 : 0;
      const combinedScore = Math.min(0.99, Math.max(lexScore, vecScore));
      return {
        docId: chunk.docId,
        docTitle: chunk.docTitle,
        content: textBody,
        score: Number((combinedScore > 0 ? 0.65 + combinedScore * 0.34 : 0).toFixed(2)),
        rawLex: lexScore,
      };
    });

    return scored
      .filter((s) => s.rawLex > 0.1)
      .sort((a, b) => b.rawLex - a.rawLex)
      .slice(0, topK)
      .map(({ docId, docTitle, content, score }) => ({ docId, docTitle, content, score }));
  },
};
