import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  LifeBuoy,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Mail,
  Copy,
  Check,
  RefreshCw,
  Send,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import type { Ticket, TicketStatus } from '../types';
import { soundManager } from '../utils/audio';

interface TicketDetailsPageProps {
  ticketId: string;
  onBack: () => void;
}

export const TicketDetailsPage: React.FC<TicketDetailsPageProps> = ({
  ticketId,
  onBack,
}) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [responseTone, setResponseTone] = useState<'professional' | 'empathetic' | 'concise' | 'formal'>('professional');
  const [draftedReply, setDraftedReply] = useState('');
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [teamNotes, setTeamNotes] = useState<string[]>([
    'Customer account verified with SLA Platinum tier.',
  ]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tickets/${ticketId}`);
      const data = await res.json();
      if (data.ticket) {
        setTicket(data.ticket);
        setDraftedReply(data.ticket.proposedResponse || '');
        setApproved(data.ticket.isResponseApproved || false);
      }
    } catch (err) {
      console.error('Error loading ticket details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleRunAnalysis = async () => {
    if (!ticket) return;
    setAnalyzing(true);
    soundManager.playAgentPulse();
    try {
      const res = await fetch('/api/ai/analyze-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticket.subject,
          description: ticket.description,
          customerName: ticket.customerName,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        soundManager.playSuccess();
        // Persist to ticket
        const patchRes = await fetch(`/api/tickets/${ticket.ticketId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aiAnalysis: data.analysis,
            priority: data.analysis.priority || ticket.priority,
            sentiment: data.analysis.sentiment || ticket.sentiment,
            category: data.analysis.category || ticket.category,
          }),
        });
        const updated = await patchRes.json();
        setTicket(updated.ticket);
      }
    } catch (err) {
      console.error('Error running AI analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateResponse = async () => {
    if (!ticket) return;
    setGeneratingResponse(true);
    soundManager.playAgentPulse();
    try {
      const res = await fetch('/api/ai/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: ticket.customerName,
          subject: ticket.subject,
          description: ticket.description,
          tone: responseTone,
          customNotes: noteText,
        }),
      });

      const data = await res.json();
      if (data.responseText) {
        soundManager.playSuccess();
        setDraftedReply(data.responseText);
        setApproved(false);

        // Update ticket
        await fetch(`/api/tickets/${ticket.ticketId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proposedResponse: data.responseText,
            isResponseApproved: false,
          }),
        });
      }
    } catch (err) {
      console.error('Error generating reply:', err);
    } finally {
      setGeneratingResponse(false);
    }
  };

  const handleApproveAndResolve = async () => {
    if (!ticket) return;
    soundManager.playSuccess();
    try {
      await fetch(`/api/tickets/${ticket.ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Resolved',
          isResponseApproved: true,
          proposedResponse: draftedReply,
        }),
      });
      setApproved(true);
      setTicket((prev) => (prev ? { ...prev, status: 'Resolved', isResponseApproved: true } : null));
    } catch (err) {
      console.error('Failed to approve response:', err);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    soundManager.playClick();
    try {
      const res = await fetch(`/api/tickets/${ticket.ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      setTicket(data.ticket);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCopyReply = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(draftedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !ticket) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading ticket details...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ticket Queue</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-400 whitespace-nowrap">Status:</span>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
            className="bg-[#111827] text-xs text-slate-200 py-1.5 px-3 rounded-xl border border-[#1e293b] outline-none font-semibold"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Customer">Waiting for Customer</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Customer Complaint & Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#111827] border border-[#1e293b] shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                #{ticket.ticketId}
              </span>
              <span className="text-[11px] text-slate-500">
                Created {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 leading-snug">{ticket.subject}</h2>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0a0e1a] border border-[#1e293b] text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap mb-6">
              {ticket.description}
            </div>

            {/* Customer Details Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-[#1e293b] text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="font-semibold truncate">{ticket.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{ticket.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* AI Ticket Intelligence Card (Agent 1) */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-[#131b2e] to-[#0f172a] border border-violet-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Ticket Intelligence Agent Triage</h3>
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{ticket.aiAnalysis ? 'Re-analyze' : 'Run Triage'}</span>
              </button>
            </div>

            {ticket.aiAnalysis ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-[#080b14] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-500 block">Category</span>
                    <span className="font-bold text-slate-200">{ticket.aiAnalysis.category}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#080b14] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-500 block">Sentiment</span>
                    <span className="font-bold text-amber-400">{ticket.aiAnalysis.sentiment}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#080b14] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-500 block">Priority</span>
                    <span className="font-bold text-red-400">{ticket.aiAnalysis.priority}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#080b14] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-500 block">Confidence</span>
                    <span className="font-bold text-emerald-400">
                      {Math.round(ticket.aiAnalysis.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-2 pt-2">
                  <div>
                    <span className="font-semibold text-slate-400">Customer Intent: </span>
                    <span className="text-slate-200">{ticket.aiAnalysis.intent}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Executive Summary: </span>
                    <span className="text-slate-300">{ticket.aiAnalysis.summary}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30 text-violet-200">
                    <span className="font-bold block mb-0.5">Recommended Next Action:</span>
                    <span>{ticket.aiAnalysis.recommended_action}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                <p className="mb-3">This ticket has not yet undergone AI automated triage.</p>
                <button
                  onClick={handleRunAnalysis}
                  disabled={analyzing}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all cursor-pointer"
                >
                  {analyzing ? 'Triaging with Gemini...' : 'Analyze Ticket with Agent 1'}
                </button>
              </div>
            )}
          </div>

          {/* Internal Team Collaboration & Activity Timeline */}
          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1e293b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Internal Operations Notes</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Team-Only Visibility</span>
            </div>

            <div className="space-y-2">
              {teamNotes.map((note, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#0a0e1a] border border-[#1e293b] text-xs text-slate-300">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-semibold text-violet-400">Alex Vance (Operations Lead)</span>
                    <span>Verified</span>
                  </div>
                  <div>{note}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && noteText.trim()) {
                    setTeamNotes([...teamNotes, noteText.trim()]);
                    setNoteText('');
                    soundManager.playClick();
                  }
                }}
                placeholder="Add private note for ops team..."
                className="flex-1 bg-[#080b14] text-xs text-slate-200 placeholder-slate-500 px-3 py-2 rounded-xl border border-[#1e293b] focus:border-cyan-500 outline-none"
              />
              <button
                onClick={() => {
                  if (noteText.trim()) {
                    setTeamNotes([...teamNotes, noteText.trim()]);
                    setNoteText('');
                    soundManager.playClick();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Response Generator (Agent 3) & Human Approval */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1e293b] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-violet-400" />
                <h3 className="text-sm font-bold text-white">
                  Response Generation Agent (Agent 03)
                </h3>
              </div>

              {approved && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Human
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Grounds replies in your SLA policies and Customer Care standards with human review.
            </p>

            {/* Tone Selector */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400">Tone:</span>
              {(['professional', 'empathetic', 'concise', 'formal'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setResponseTone(tone)}
                  className={`text-xs capitalize px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    responseTone === tone
                      ? 'bg-violet-600 text-white border-violet-500'
                      : 'bg-[#162032] text-slate-400 border-[#1e293b] hover:text-slate-200'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>

            {/* Drafted Response Area */}
            <div className="space-y-3">
              <textarea
                value={draftedReply}
                onChange={(e) => {
                  setDraftedReply(e.target.value);
                  setApproved(false);
                }}
                rows={8}
                placeholder="Click 'Generate Policy Grounded Response' to draft a reply..."
                className="w-full bg-[#080b14] text-xs sm:text-sm text-slate-100 p-4 rounded-2xl border border-[#1e293b] focus:border-violet-500 outline-none resize-none leading-relaxed font-sans"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateResponse}
                    disabled={generatingResponse}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{generatingResponse ? 'Drafting...' : draftedReply ? 'Regenerate' : 'Generate Reply'}</span>
                  </button>

                  {draftedReply && (
                    <button
                      onClick={handleCopyReply}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#162032] hover:bg-[#1c2940] border border-[#1e293b] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? (
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
                  )}
                </div>

                {draftedReply && (
                  <button
                    onClick={handleApproveAndResolve}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Send to Customer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
