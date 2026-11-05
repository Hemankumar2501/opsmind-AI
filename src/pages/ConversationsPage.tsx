import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Trash2,
  ArrowRight,
  Sparkles,
  Bot,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import type { Conversation } from '../types';

interface ConversationsPageProps {
  onOpenConversationInWorkspace: (convId: string) => void;
}

export const ConversationsPage: React.FC<ConversationsPageProps> = ({
  onOpenConversationInWorkspace,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      conversationId: 'conv-default',
      userId: 'user-1',
      workspaceId: 'default-workspace',
      title: 'Operations & SLA Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageSnippet: 'SLA response times for Critical Tier 1 outages.',
      agentType: 'Supervisor Agent',
    },
    {
      conversationId: 'conv-billing',
      userId: 'user-1',
      workspaceId: 'default-workspace',
      title: 'Monthly Invoicing & Quota Review',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      lastMessageSnippet: 'Reviewing David Chen $450 seat adjustment.',
      agentType: 'Business Insights Agent',
    },
    {
      conversationId: 'conv-triage',
      userId: 'user-1',
      workspaceId: 'default-workspace',
      title: 'API Gateway Rate Throttling Investigation',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      lastMessageSnippet: 'Triaged 429 webhook drop for Sarah Jenkins.',
      agentType: 'Ticket Intelligence Agent',
    },
  ]);

  const [search, setSearch] = useState('');

  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.lastMessageSnippet && c.lastMessageSnippet.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this conversation log from persistent storage?')) {
      setConversations(conversations.filter((c) => c.conversationId !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>AI Audit & Conversation History</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
            {conversations.length} Sessions Saved
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Complete audit trail of all previous multi-agent investigations, citations, and customer correspondence drafts.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search saved conversations..."
          className="w-full bg-[#111827] text-xs text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl border border-[#1e293b] focus:outline-none focus:border-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((c) => (
          <div
            key={c.conversationId}
            onClick={() => onOpenConversationInWorkspace(c.conversationId)}
            className="p-6 rounded-3xl bg-[#111827] border border-[#1e293b] hover:border-violet-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                  {c.agentType || 'Supervisor'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(c.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                {c.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {c.lastMessageSnippet}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs">
              <span className="text-violet-400 font-semibold group-hover:underline flex items-center gap-1">
                <span>Resume in Copilot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c.conversationId);
                }}
                className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                title="Delete Conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
