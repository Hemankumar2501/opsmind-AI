import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ChevronDown,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RefreshCw,
} from 'lucide-react';
import type { Ticket, TicketPriority, TicketSentiment, TicketStatus } from '../types';

interface TicketsPageProps {
  onSelectTicket: (ticketId: string) => void;
  onOpenNewTicketModal: () => void;
  onSimulateInboundTicket?: () => void;
}

export const TicketsPage: React.FC<TicketsPageProps> = ({
  onSelectTicket,
  onOpenNewTicketModal,
  onSimulateInboundTicket,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedPriority !== 'all') params.append('priority', selectedPriority);
      if (selectedSentiment !== 'all') params.append('sentiment', selectedSentiment);
      if (search) params.append('search', search);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus, selectedPriority, selectedSentiment, search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Support Ticket Management</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
              {tickets.length} Active Records
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time customer issues triaged by AI with automatic intent classification and sentiment scoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={fetchTickets}
            className="p-2 sm:p-2.5 rounded-xl bg-[#111827] hover:bg-slate-800 text-slate-300 border border-[#1e293b] transition-all cursor-pointer"
            title="Refresh Tickets Queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {onSimulateInboundTicket && (
            <button
              onClick={onSimulateInboundTicket}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              title="Inject realistic urgent enterprise ticket with live AI triage"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Simulate Incident</span>
            </button>
          )}

          <button
            onClick={onOpenNewTicketModal}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#111827] border border-[#1e293b] flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-[180px] sm:min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by subject, customer..."
            className="w-full bg-[#0b0f19] text-xs text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2 rounded-xl border border-[#1e293b] focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0b0f19] text-xs text-slate-200 py-1.5 px-2.5 rounded-xl border border-[#1e293b] outline-none"
          >
            <option value="all">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Customer">Waiting</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#0b0f19] text-xs text-slate-200 py-1.5 px-2.5 rounded-xl border border-[#1e293b] outline-none"
          >
            <option value="all">All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Sentiment Filter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Sentiment:</span>
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="bg-[#0b0f19] text-xs text-slate-200 py-1.5 px-2.5 rounded-xl border border-[#1e293b] outline-none"
          >
            <option value="all">All</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
            <option value="Frustrated">Frustrated</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-[#111827] border border-[#1e293b] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-[#1e293b] bg-[#0d121f] text-slate-400 font-semibold">
                <th className="py-4 pl-6">Ticket ID & Subject</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Sentiment</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">AI Analysis</th>
                <th className="py-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No tickets found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => {
                  const priorityBadge = {
                    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
                    High: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    Medium: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                    Low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                  }[t.priority];

                  const statusBadge = {
                    Open: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
                    'In Progress': 'bg-violet-950/60 text-violet-300 border-violet-500/30',
                    'Waiting for Customer': 'bg-amber-950/60 text-amber-300 border-amber-500/30',
                    Resolved: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
                    Closed: 'bg-slate-800 text-slate-400 border-slate-700',
                  }[t.status];

                  return (
                    <tr
                      key={t.ticketId}
                      onClick={() => onSelectTicket(t.ticketId)}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 pl-6 font-medium text-slate-200">
                        <div className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors truncate max-w-xs">
                          {t.subject}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          #{t.ticketId} &bull; {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-300">
                        <div className="font-medium truncate max-w-[130px]">{t.customerName}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                          {t.customerEmail}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-400">
                        <span className="truncate max-w-[120px] block">{t.category}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${priorityBadge}`}
                        >
                          {t.priority}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-300">
                        <span className="text-[11px] font-medium">{t.sentiment}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${statusBadge}`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {t.aiAnalysis ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Triaged ({Math.round(t.aiAnalysis.confidence * 100)}%)</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Pending AI</span>
                        )}
                      </td>

                      <td className="py-4 pr-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTicket(t.ticketId);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#162032] group-hover:bg-violet-600 group-hover:text-white text-slate-300 text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
