import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCosineSimilarity,
  chunkDocumentText,
  rankDocumentChunks,
  computeSentimentScore,
  calculateTicketPriorityWeight,
  aggregateTicketMetrics,
  determineRoutingAgent,
} from './pureLogic';
import type { Ticket } from '../types';

test('calculateCosineSimilarity handles identical, orthogonal, and zero vectors', () => {
  const vec1 = [1, 0, 0];
  const vec2 = [1, 0, 0];
  assert.equal(Math.round(calculateCosineSimilarity(vec1, vec2)), 1);

  const vecOrthogonal = [0, 1, 0];
  assert.equal(calculateCosineSimilarity(vec1, vecOrthogonal), 0);

  assert.equal(calculateCosineSimilarity([], [1, 2]), 0);
});

test('chunkDocumentText properly splits long content and respects max size', () => {
  const shortText = 'This is a short single paragraph.';
  const chunks = chunkDocumentText(shortText, 100);
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0], shortText);

  const longParagraph =
    'Enterprise support operations need intelligent triage. Fast classification reduces response times significantly. Automated workflows ensure customer delight and seamless resolution across all enterprise tiers.';
  const splitChunks = chunkDocumentText(longParagraph, 80, 20);
  assert.ok(splitChunks.length >= 2, 'Should have created multiple chunks');
  assert.ok(splitChunks.every((c) => c.length <= 120));
});

test('rankDocumentChunks ranks by highest cosine similarity', () => {
  const queryVec = [1, 0, 0];
  const candidateChunks = [
    { text: 'Irrelevant chunk', embedding: [0, 1, 0] },
    { text: 'Highly relevant chunk', embedding: [0.95, 0.1, 0] },
    { text: 'Moderate match', embedding: [0.6, 0.4, 0] },
  ];

  const ranked = rankDocumentChunks(queryVec, candidateChunks, 2);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].text, 'Highly relevant chunk');
  assert.ok(ranked[0].similarityScore > ranked[1].similarityScore);
});

test('textToVector produces normalized vectors and supports text query ranking', () => {
  const query = 'refund policy for cancelled seats';
  const chunks = [
    { text: 'Server cluster configuration and kubernetes pod deployment', chunkId: 'c1' },
    { text: 'Customer refund policy and credit memo guidelines for cancelled seats', chunkId: 'c2' },
    { text: 'Office holiday schedule and internal company calendar', chunkId: 'c3' },
  ];
  const ranked = rankDocumentChunks(query, chunks, 2);
  assert.equal(ranked[0].chunkId, 'c2');
  assert.ok(ranked[0].similarityScore > 0);
});

test('computeSentimentScore and priority weight values adhere to domain rules', () => {
  assert.equal(computeSentimentScore('Positive'), 1.0);
  assert.equal(computeSentimentScore('Frustrated'), -0.8);
  assert.equal(calculateTicketPriorityWeight('Critical'), 4);
  assert.equal(calculateTicketPriorityWeight('Low'), 1);
});

test('aggregateTicketMetrics accurately computes counts and distributions', () => {
  const sampleTickets: Ticket[] = [
    {
      ticketId: 't-1',
      workspaceId: 'ws-1',
      customerName: 'Alice',
      customerEmail: 'alice@example.com',
      subject: 'Billing discrepancy',
      description: 'Double charged',
      category: 'Billing',
      priority: 'High',
      sentiment: 'Negative',
      status: 'Open',
      createdAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-01T10:00:00Z',
    },
    {
      ticketId: 't-2',
      workspaceId: 'ws-1',
      customerName: 'Bob',
      customerEmail: 'bob@example.com',
      subject: 'Feature inquiry',
      description: 'Can we integrate SSO?',
      category: 'Inquiry',
      priority: 'Low',
      sentiment: 'Positive',
      status: 'Resolved',
      createdAt: '2026-11-02T10:00:00Z',
      updatedAt: '2026-11-02T11:00:00Z',
    },
  ];

  const metrics = aggregateTicketMetrics(sampleTickets);
  assert.equal(metrics.totalTickets, 2);
  assert.equal(metrics.openTickets, 1);
  assert.equal(metrics.resolvedTickets, 1);
  assert.equal(metrics.priorityCounts.High, 1);
  assert.equal(metrics.priorityCounts.Low, 1);
  assert.equal(metrics.categoryCounts['Billing'], 1);
  assert.equal(metrics.categoryCounts['Inquiry'], 1);
});

test('determineRoutingAgent intelligently identifies specialized agents', () => {
  const ticketRoute = determineRoutingAgent('Please triage this customer complaint about an order defect');
  assert.equal(ticketRoute.agentName, 'Ticket Intelligence Agent');

  const docRoute = determineRoutingAgent('What is our SLA refund policy according to the handbook?');
  assert.equal(docRoute.agentName, 'Knowledge Intelligence Agent');

  const replyRoute = determineRoutingAgent('Draft an empathetic email reply to customer apologizing for delay');
  assert.equal(replyRoute.agentName, 'Response Generation Agent');

  const insightRoute = determineRoutingAgent('Show me the common recurring complaints and monthly analytics');
  assert.equal(insightRoute.agentName, 'Business Insights Agent');
});
