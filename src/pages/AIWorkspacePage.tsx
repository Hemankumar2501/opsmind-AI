import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Zap,
  MessageSquare,
  X,
} from 'lucide-react';
import { AIOrb, AIOrbState } from '../components/3d/AIOrb';
import type { ChatMessage, Conversation, MessageCitation } from '../types';
import { soundManager } from '../utils/audio';

export const AIWorkspacePage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      conversationId: 'conv-default',
      userId: 'user-1',
      workspaceId: 'default-workspace',
      title: 'Operations & SLA Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageSnippet: 'SLA response times for Critical Tier 1 outages.',
    },
    {
      conversationId: 'conv-billing',
      userId: 'user-1',
      workspaceId: 'default-workspace',
      title: 'Monthly Invoicing & Quota Review',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      lastMessageSnippet: 'Reviewing David Chen $450 seat adjustment.',
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string>('conv-default');
  const [searchConvQuery, setSearchConvQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'conv-default': [
      {
        messageId: 'm-1',
        conversationId: 'conv-default',
        workspaceId: 'default-workspace',
        role: 'assistant',
        content: `Hello! I am **OpsMind AI**, your Enterprise Business Operations Copilot.\n\nI can assist you with:\n- **Ticket Intelligence**: Triage, urgency scoring, and customer intent classification.\n- **Knowledge Intelligence**: RAG search across your company policies and SLA manuals.\n- **Response Generation**: Draft policy-grounded replies with human approval.\n- **Business Insights**: Spot recurring bottlenecks and sentiment trends.\n\nWhat operations would you like to explore today?`,
        agentName: 'Supervisor Agent',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    'conv-billing': [
      {
        messageId: 'm-2',
        conversationId: 'conv-billing',
        workspaceId: 'default-workspace',
        role: 'assistant',
        content: `Billing & seat adjustment review open. I have analyzed ticket #t-1002 (David Chen) regarding 15 downgraded seats. A credit memo of $450 is grounded in our October renewal logs.`,
        agentName: 'Business Insights Agent',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  });

  const [orbState, setOrbState] = useState<AIOrbState>('idle');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [isMobileSessionsOpen, setIsMobileSessionsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    'Analyze my customer support tickets',
    'Find the most common complaints',
    'Search our SLA and refund policy',
    'Generate a response for ticket t-1001',
    'Explain the latest business trends',
  ];

  const currentMessages = messages[activeConversationId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, orbState]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      messageId: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      workspaceId: 'default-workspace',
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), userMsg],
    }));

    setInputMessage('');
    setOrbState('thinking');
    soundManager.playAgentPulse();

    try {
      // Simulate/call server-side Gemini chat orchestrator
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: (messages[activeConversationId] || []).slice(-4),
        }),
      });

      const data = await res.json();
      setOrbState('responding');
      soundManager.playNotification();

      const botMsg: ChatMessage = {
        messageId: `msg-ai-${Date.now()}`,
        conversationId: activeConversationId,
        workspaceId: 'default-workspace',
        role: 'assistant',
        content: data.reply || 'OpsMind Copilot processed your request successfully.',
        agentName: data.agentName || 'Supervisor Agent',
        citations: data.citations || [],
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), botMsg],
      }));

      // Update snippet on conversation
      setConversations((prev) =>
        prev.map((c) =>
          c.conversationId === activeConversationId
            ? { ...c, lastMessageSnippet: text.slice(0, 50), updatedAt: new Date().toISOString() }
            : c
        )
      );
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        messageId: `msg-err-${Date.now()}`,
        conversationId: activeConversationId,
        workspaceId: 'default-workspace',
        role: 'assistant',
        content: 'I encountered an error connecting to the AI Orchestrator. Please verify your network connection and try again.',
        agentName: 'System Guard',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), errorMsg],
      }));
    } finally {
      setTimeout(() => setOrbState('idle'), 1500);
    }
  };

  const handleCreateNewChat = () => {
    const newId = `conv-${Date.now().toString(36)}`;
    const newConv: Conversation = {
      conversationId: newId,
      userId: 'user-1',
      workspaceId: 'default-workspace',
      title: 'New Investigation Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageSnippet: 'Session started.',
    };

    setConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    setMessages((prev) => ({
      ...prev,
      [newId]: [
        {
          messageId: `msg-init-${Date.now()}`,
          conversationId: newId,
          workspaceId: 'default-workspace',
          role: 'assistant',
          content: 'New operations session started. How can I help triage or analyze your workspace today?',
          agentName: 'Supervisor Agent',
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) return;
    setConversations(conversations.filter((c) => c.conversationId !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.conversationId !== id);
      setActiveConversationId(remaining[0].conversationId);
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback((prev) => ({ ...prev, [id]: type }));
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchConvQuery.toLowerCase())
  );

  const renderSessionList = (isMobile = false) => (
    <div className="flex flex-col h-full bg-[#0c101d]">
      <div className="p-3 sm:p-4 border-b border-[#1e293b] flex items-center justify-between gap-2">
        <button
          onClick={() => {
            handleCreateNewChat();
            if (isMobile) setIsMobileSessionsOpen(false);
          }}
          className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Investigation</span>
        </button>
        {isMobile && (
          <button
            onClick={() => setIsMobileSessionsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Chats */}
      <div className="p-3 border-b border-[#1e293b]/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchConvQuery}
            onChange={(e) => setSearchConvQuery(e.target.value)}
            placeholder="Search chat history..."
            className="w-full bg-[#111827] text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-lg border border-[#1e293b] focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.map((c) => {
          const isActive = c.conversationId === activeConversationId;
          return (
            <div
              key={c.conversationId}
              onClick={() => {
                setActiveConversationId(c.conversationId);
                if (isMobile) setIsMobileSessionsOpen(false);
              }}
              className={`p-3 rounded-xl cursor-pointer transition-all group flex items-start justify-between ${
                isActive
                  ? 'bg-violet-950/30 border border-violet-500/40 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className="truncate flex-1 pr-2">
                <div className="text-xs font-semibold truncate text-slate-200">{c.title}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {c.lastMessageSnippet || 'No messages yet'}
                </div>
              </div>

              {conversations.length > 1 && (
                <button
                  onClick={(e) => handleDeleteConversation(c.conversationId, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-opacity"
                  title="Delete Conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-[#080b14] relative">
      {/* Mobile Drawer Overlay */}
      {isMobileSessionsOpen && (
        <div
          onClick={() => setIsMobileSessionsOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Sessions Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] border-r border-[#1e293b] z-40 md:hidden transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileSessionsOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSessionList(true)}
      </div>

      {/* Desktop Standard Sidebar */}
      <div className="hidden md:flex w-72 border-r border-[#1e293b] flex-col shrink-0">
        {renderSessionList(false)}
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col h-full bg-[#080b14] min-w-0 relative">
        {/* Top Header of Chat Area */}
        <div className="h-14 border-b border-[#1e293b] px-3 sm:px-6 flex items-center justify-between bg-[#0a0e1a]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Sessions Toggle */}
            <button
              onClick={() => setIsMobileSessionsOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden flex items-center gap-1.5 text-xs border border-[#1e293b] shrink-0"
              title="Open Chat Sessions"
            >
              <MessageSquare className="w-4 h-4 text-violet-400" />
              <span className="hidden xs:inline">Sessions</span>
            </button>

            <AIOrb size="sm" state={orbState} />
            <div className="truncate">
              <span className="text-xs font-bold text-slate-200 truncate block">
                {conversations.find((c) => c.conversationId === activeConversationId)?.title}
              </span>
              <div className="text-[10px] text-slate-500 truncate hidden sm:block">
                AI Orchestration Mode &bull; Gemini 2.5 Server-Side
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setMessages((prev) => ({ ...prev, [activeConversationId]: [] }));
              }}
              className="text-xs text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear Thread"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto">
              <AIOrb size="lg" state={orbState} />
              <h3 className="text-lg font-bold text-white mt-4 mb-2">OpsMind Copilot Ready</h3>
              <p className="text-xs text-slate-400 mb-8 max-w-md">
                Select a starter prompt below or enter an operational query regarding tickets, SLAs, customer correspondence, or business trends.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {starterPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-3 text-left rounded-xl bg-[#111827] hover:bg-[#162032] border border-[#1e293b] text-xs text-slate-300 hover:text-cyan-400 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.messageId}
                  className={`flex gap-3 sm:gap-4 max-w-4xl mx-auto ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 shrink-0 flex items-center justify-center mt-1">
                      <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center text-cyan-400 font-bold text-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed max-w-2xl ${
                      isUser
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-[#111827] border border-[#1e293b] text-slate-200 rounded-tl-none shadow-lg'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1e293b]">
                        <span className="text-[11px] font-bold text-violet-400 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>{msg.agentName || 'Supervisor Agent'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}

                    {/* Content Body formatted */}
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm space-y-2">
                      {msg.content}
                    </div>

                    {/* Citations preview */}
                    {!isUser && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#1e293b] space-y-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Verified Citations & Grounding:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cite, idx) => (
                            <div
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-[#0a0e1a] border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-1.5"
                              title={cite.snippet}
                            >
                              <BookOpen className="w-3 h-3 text-cyan-400" />
                              <span className="font-medium truncate max-w-[180px]">
                                {cite.documentName} ({cite.pageOrSection})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Message Footer Actions */}
                    {!isUser && (
                      <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.messageId, msg.content)}
                            className="p-1 hover:text-slate-300 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                          >
                            {copiedId === msg.messageId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleFeedback(msg.messageId, 'up')}
                            className={`p-1 rounded transition-colors ${
                              feedback[msg.messageId] === 'up'
                                ? 'text-emerald-400'
                                : 'hover:text-slate-300'
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.messageId, 'down')}
                            className={`p-1 rounded transition-colors ${
                              feedback[msg.messageId] === 'down'
                                ? 'text-red-400'
                                : 'hover:text-slate-300'
                            }`}
                            title="Needs Improvement"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 p-0.5 shrink-0 flex items-center justify-center mt-1 text-slate-300">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {orbState === 'thinking' && (
            <div className="flex gap-4 max-w-4xl mx-auto items-center text-xs text-slate-400">
              <AIOrb size="sm" state="thinking" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-cyan-400">Supervisor Orchestrator</span>
                <span>is querying vector index and generating answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Message Composer */}
        <div className="p-4 sm:p-6 bg-[#0a0e1a]/90 border-t border-[#1e293b] shrink-0">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center"
            >
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask OpsMind AI to triage tickets, search documents, draft replies..."
                className="w-full bg-[#111827] text-sm text-slate-100 placeholder-slate-500 pl-4 pr-14 py-3.5 rounded-2xl border border-[#1e293b] focus:outline-none focus:border-violet-500 shadow-xl resize-none min-h-[50px] max-h-36"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || orbState === 'thinking'}
                className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
              <span>OpsMind AI grounds all statements in your active workspace data.</span>
              <span className="hidden sm:inline">Press Enter to send, Shift+Enter for newline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
