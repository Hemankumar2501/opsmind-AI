import type { Ticket, TicketPriority, TicketSentiment } from '../types';

/**
 * Computes cosine similarity between two numeric embedding vectors.
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;
  return dotProduct / magnitude;
}

/**
 * Splits raw document text into overlapping chunks with sentence/paragraph awareness.
 */
export function chunkDocumentText(text: string, maxChunkSize = 500, overlap = 50): string[] {
  if (!text || text.trim().length === 0) return [];
  const cleanText = text.replace(/\r\n/g, '\n').trim();
  if (cleanText.length <= maxChunkSize) {
    return [cleanText];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < cleanText.length) {
    let endIndex = startIndex + maxChunkSize;
    if (endIndex >= cleanText.length) {
      chunks.push(cleanText.slice(startIndex).trim());
      break;
    }

    // Try finding the nearest paragraph or sentence boundary
    const lookbackLimit = Math.max(startIndex, endIndex - 80);
    const sliceToCheck = cleanText.substring(lookbackLimit, endIndex);
    const breakMatch = sliceToCheck.search(/(\.\s|\n\n|\n)/);

    if (breakMatch !== -1) {
      endIndex = lookbackLimit + breakMatch + 1;
    }

    const chunk = cleanText.substring(startIndex, endIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    startIndex = Math.max(startIndex + 1, endIndex - overlap);
  }

  return chunks;
}

/**
 * Creates a normalized pseudo-embedding vector for text similarity matching.
 */
export function textToVector(text: string, dimensions = 64): number[] {
  if (!text) return new Array(dimensions).fill(0);
  const vec = new Array(dimensions).fill(0);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  
  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vec[idx] += 1;
  }

  // Normalize vector
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vec[i] * vec[i];
  }
  const mag = Math.sqrt(norm);
  if (mag > 0) {
    for (let i = 0; i < dimensions; i++) {
      vec[i] = vec[i] / mag;
    }
  }
  return vec;
}

/**
 * Ranks chunks by cosine similarity to a query vector or query string.
 */
export function rankDocumentChunks<T extends { text: string; embedding?: number[] }>(
  query: number[] | string,
  chunks: T[],
  topK = 4
): Array<T & { similarityScore: number }> {
  if (!query || chunks.length === 0) return [];

  const qVec = typeof query === 'string' ? textToVector(query) : query;

  const scored = chunks.map((chunk) => {
    const chunkVec = chunk.embedding && chunk.embedding.length === qVec.length
      ? chunk.embedding
      : textToVector(chunk.text, qVec.length);
    const similarity = calculateCosineSimilarity(qVec, chunkVec);
    return {
      ...chunk,
      similarityScore: Number(similarity.toFixed(4)),
    };
  });

  return scored.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, topK);
}

/**
 * Converts sentiment into a normalized score between -1.0 and +1.0.
 */
export function computeSentimentScore(sentiment: TicketSentiment): number {
  switch (sentiment) {
    case 'Positive':
      return 1.0;
    case 'Neutral':
      return 0.2;
    case 'Negative':
      return -0.5;
    case 'Frustrated':
      return -0.8;
    case 'Urgent':
      return -0.7;
    default:
      return 0;
  }
}

/**
 * Returns numeric priority weights for operational sorting.
 */
export function calculateTicketPriorityWeight(priority: TicketPriority): number {
  switch (priority) {
    case 'Critical':
      return 4;
    case 'High':
      return 3;
    case 'Medium':
      return 2;
    case 'Low':
      return 1;
    default:
      return 0;
  }
}

export interface AggregatedMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  inProgressTickets: number;
  criticalTickets: number;
  avgSentimentScore: number;
  sentimentLabel: string;
  categoryCounts: Record<string, number>;
  priorityCounts: Record<TicketPriority, number>;
  sentimentCounts: Record<TicketSentiment, number>;
}

/**
 * Calculates deterministic analytics from an array of support tickets.
 */
export function aggregateTicketMetrics(tickets: Ticket[]): AggregatedMetrics {
  const initialPriorityCounts: Record<TicketPriority, number> = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
  };

  const initialSentimentCounts: Record<TicketSentiment, number> = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
    Frustrated: 0,
    Urgent: 0,
  };

  const categoryCounts: Record<string, number> = {};
  let totalSentimentScore = 0;

  let openCount = 0;
  let resolvedCount = 0;
  let inProgressCount = 0;
  let criticalCount = 0;

  for (const t of tickets) {
    // Status counts
    if (t.status === 'Open') openCount++;
    if (t.status === 'Resolved' || t.status === 'Closed') resolvedCount++;
    if (t.status === 'In Progress' || t.status === 'Waiting for Customer') inProgressCount++;
    if (t.priority === 'Critical') criticalCount++;

    // Priority counts
    if (t.priority in initialPriorityCounts) {
      initialPriorityCounts[t.priority]++;
    }

    // Sentiment counts
    if (t.sentiment in initialSentimentCounts) {
      initialSentimentCounts[t.sentiment]++;
      totalSentimentScore += computeSentimentScore(t.sentiment);
    }

    // Category counts
    const cat = t.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  const avgScore = tickets.length > 0 ? totalSentimentScore / tickets.length : 0;
  let sentimentLabel = 'Neutral';
  if (avgScore >= 0.5) sentimentLabel = 'Very Positive';
  else if (avgScore > 0.1) sentimentLabel = 'Positive';
  else if (avgScore <= -0.5) sentimentLabel = 'Needs Attention';
  else if (avgScore < -0.1) sentimentLabel = 'Negative';

  return {
    totalTickets: tickets.length,
    openTickets: openCount,
    resolvedTickets: resolvedCount,
    inProgressTickets: inProgressCount,
    criticalTickets: criticalCount,
    avgSentimentScore: Number(avgScore.toFixed(2)),
    sentimentLabel,
    categoryCounts,
    priorityCounts: initialPriorityCounts,
    sentimentCounts: initialSentimentCounts,
  };
}

/**
 * Agent Supervisor router: classifies user queries to the most suitable specialized agent.
 */
export function determineRoutingAgent(prompt: string): {
  agentName: string;
  reason: string;
  confidence: number;
} {
  const p = prompt.toLowerCase();

  if (
    p.includes('insight') ||
    p.includes('trend') ||
    p.includes('analytics') ||
    p.includes('common recurring') ||
    p.includes('recurring complaints') ||
    p.includes('common complaints') ||
    p.includes('executive summary') ||
    p.includes('business report')
  ) {
    return {
      agentName: 'Business Insights Agent',
      reason: 'Prompt calls for analytical aggregation, repeated complaints, and operational trend analysis.',
      confidence: 0.94,
    };
  }

  if (
    p.includes('document') ||
    p.includes('policy') ||
    p.includes('sla') ||
    p.includes('knowledge') ||
    p.includes('refund rules') ||
    p.includes('handbook') ||
    p.includes('manual')
  ) {
    return {
      agentName: 'Knowledge Intelligence Agent',
      reason: 'Inquiry demands semantic retrieval over enterprise knowledge documents.',
      confidence: 0.96,
    };
  }

  if (
    p.includes('reply') ||
    p.includes('respond') ||
    p.includes('draft') ||
    p.includes('email to customer') ||
    p.includes('customer response')
  ) {
    return {
      agentName: 'Response Generation Agent',
      reason: 'Request asks for professional customer communication drafting.',
      confidence: 0.95,
    };
  }

  if (
    p.includes('ticket') ||
    p.includes('complaint') ||
    p.includes('issue') ||
    p.includes('defect') ||
    p.includes('classify') ||
    p.includes('triage')
  ) {
    return {
      agentName: 'Ticket Intelligence Agent',
      reason: 'User inquiry relates to customer tickets, complaints, or issue categorization.',
      confidence: 0.94,
    };
  }

  return {
    agentName: 'Supervisor Agent',
    reason: 'Multi-faceted or general business operations orchestrator query.',
    confidence: 0.9,
  };
}
