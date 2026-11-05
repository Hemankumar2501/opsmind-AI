import React, { useState } from 'react';
import { Sparkles, LifeBuoy, X, ArrowRight, AlertCircle } from 'lucide-react';
import type { TicketPriority, TicketSentiment } from '../../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Platform Performance');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [sentiment, setSentiment] = useState<TicketSentiment>('Neutral');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !subject.trim() || !description.trim()) {
      setError('Please provide customer name, subject, and description.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Create ticket
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          subject,
          description,
          category,
          priority,
          sentiment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create ticket');

      // 2. Automatically trigger Agent 1 triage in background
      fetch('/api/ai/analyze-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          description,
          customerName,
        }),
      })
        .then((r) => r.json())
        .then((analysisData) => {
          if (analysisData.analysis && data.ticket?.ticketId) {
            fetch(`/api/tickets/${data.ticket.ticketId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                aiAnalysis: analysisData.analysis,
                priority: analysisData.analysis.priority || priority,
                sentiment: analysisData.analysis.sentiment || sentiment,
                category: analysisData.analysis.category || category,
              }),
            });
          }
        })
        .catch(() => {});

      onTicketCreated();
      onClose();
    } catch (err: any) {
      console.error('Error creating ticket:', err);
      setError(err.message || 'Server error creating ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#1e293b] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create Support Ticket</h3>
            <p className="text-xs text-slate-400">Agent 1 will automatically triage upon creation</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Marcus Aurelius"
                required
                className="w-full bg-[#080b14] text-xs text-slate-100 px-3 py-2 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="client@enterprise.com"
                required
                className="w-full bg-[#080b14] text-xs text-slate-100 px-3 py-2 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ticket Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Webhook signature validation failing on staging"
              required
              className="w-full bg-[#080b14] text-xs text-slate-100 px-3 py-2 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide full customer complaint or operational incident details..."
              required
              className="w-full bg-[#080b14] text-xs text-slate-100 p-3 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#080b14] text-xs text-slate-200 py-1.5 px-2 rounded-xl border border-[#1e293b] outline-none"
              >
                <option value="Platform Performance">Platform</option>
                <option value="Billing & Invoicing">Billing</option>
                <option value="API & Integration">API</option>
                <option value="Security & SSO">Security</option>
                <option value="General Inquiry">General</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Initial Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-[#080b14] text-xs text-slate-200 py-1.5 px-2 rounded-xl border border-[#1e293b] outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Initial Sentiment</label>
              <select
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value as TicketSentiment)}
                className="w-full bg-[#080b14] text-xs text-slate-200 py-1.5 px-2 rounded-xl border border-[#1e293b] outline-none"
              >
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
                <option value="Frustrated">Frustrated</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-violet-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{submitting ? 'Creating...' : 'Create & Triage Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
