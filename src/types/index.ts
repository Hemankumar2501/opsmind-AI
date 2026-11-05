export type TicketStatus = 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketSentiment = 'Positive' | 'Neutral' | 'Negative' | 'Frustrated' | 'Urgent';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL?: string;
  role?: string;
  companyName?: string;
  createdAt: string;
  onboardingCompleted: boolean;
  activeWorkspaceId?: string;
}

export interface Workspace {
  workspaceId: string;
  name: string;
  industry: string;
  companySize?: string;
  ownerId: string;
  createdAt: string;
}

export interface TicketAIAnalysis {
  category: string;
  sentiment: TicketSentiment;
  priority: TicketPriority;
  intent: string;
  summary: string;
  recommended_action: string;
  confidence: number;
}

export interface Ticket {
  ticketId: string;
  workspaceId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  sentiment: TicketSentiment;
  status: TicketStatus;
  assignedTo?: string;
  aiAnalysis?: TicketAIAnalysis | null;
  proposedResponse?: string | null;
  isResponseApproved?: boolean;
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

export type DocumentProcessingStatus =
  | 'Uploaded'
  | 'Validating'
  | 'Extracting'
  | 'Chunking'
  | 'Embedding'
  | 'Indexed'
  | 'Ready'
  | 'Failed';

export interface KnowledgeDocument {
  documentId: string;
  workspaceId: string;
  uploadedBy: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  processingStatus: DocumentProcessingStatus;
  chunkCount: number;
  contentSnippet?: string;
  content?: string;
  createdAt: string;
}

export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  workspaceId: string;
  text: string;
  pageNumber?: number;
  chunkIndex: number;
  embedding?: number[];
  similarityScore?: number;
}

export interface Conversation {
  conversationId: string;
  userId: string;
  workspaceId: string;
  title: string;
  agentType?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageSnippet?: string;
}

export interface MessageCitation {
  documentId: string;
  documentName: string;
  pageOrSection?: string;
  snippet: string;
}

export interface ChatMessage {
  messageId: string;
  conversationId: string;
  workspaceId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentName?: string;
  citations?: MessageCitation[];
  createdAt: string;
}

export interface AgentExecutionLog {
  executionId: string;
  workspaceId: string;
  agentName: string;
  status: 'success' | 'failure' | 'running';
  inputSummary: string;
  outputSummary: string;
  executionTimeMs: number;
  createdAt: string;
}

export interface AppNotification {
  notificationId: string;
  userId: string;
  workspaceId: string;
  title: string;
  description: string;
  type: 'ticket' | 'agent' | 'document' | 'response' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface AIAgentMeta {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'active' | 'standby' | 'disabled';
  totalExecutions: number;
  successRate: number;
  avgLatencyMs: number;
  lastExecuted: string;
  capabilities: string[];
  samplePrompt: string;
}
