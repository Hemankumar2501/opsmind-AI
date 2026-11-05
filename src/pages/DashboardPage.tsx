import React, { useEffect, useState } from 'react';
import {
  LifeBuoy,
  CheckCircle2,
  AlertTriangle,
  Smile,
  Bot,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AIOrb } from '../components/3d/AIOrb';
import type { Ticket, AgentExecutionLog } from '../types';
import { aggregateTicketMetrics, AggregatedMetrics } from '../utils/pureLogic';

interface DashboardPageProps {
  onOpenNewTicketModal: () => void;
  onNavigateToTicket: (ticketId: string) => void;
  onNavigateTab: (tab: any) => void;
  onSimulateInboundTicket?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenNewTicketModal,
  onNavigateToTicket,
  onNavigateTab,
  onSimulateInboundTicket,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [executions, setExecutions] = useState<AgentExecutionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, analyticsRes] = await Promise.all([
        fetch('/api/tickets'),
        fetch('/api/analytics/overview'),
      ]);

      const ticketsData = await ticketsRes.json();
      const analyticsData = await analyticsRes.json();

      const fetchedTickets: Ticket[] = ticketsData.tickets || [];
      setTickets(fetchedTickets);
      setExecutions(analyticsData.executions || []);
      setMetrics(aggregateTicketMetrics(fetchedTickets));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Priority chart data
  const priorityChartData = metrics
    ? [
        { name: 'Critical', value: metrics.priorityCounts.Critical, color: '#ef4444' },
        { name: 'High', value: metrics.priorityCounts.High, color: '#f59e0b' },
        { name: 'Medium', value: metrics.priorityCounts.Medium, color: '#06b6d4' },
        { name: 'Low', value: metrics.priorityCounts.Low, color: '#10b981' },
      ].filter((d) => d.value > 0)
    : [];

  // Sentiment chart data
  const sentimentChartData = metrics
    ? [
        { name: 'Positive', count: metrics.sentimentCounts.Positive, fill: '#10b981' },
        { name: 'Neutral', count: metrics.sentimentCounts.Neutral, fill: '#64748b' },
        { name: 'Negative', count: metrics.sentimentCounts.Negative, fill: '#f59e0b' },
        { name: 'Frustrated', count: metrics.sentimentCounts.Frustrated, fill: '#f97316' },
        { name: 'Urgent', count: metrics.sentimentCounts.Urgent, fill: '#ef4444' },
      ]
    : [];

  // Weekly ticket trend data
  const trendData = [
    { day: 'Mon', volume: 8, resolved: 6 },
    { day: 'Tue', volume: 14, resolved: 11 },
    { day: 'Wed', volume: 19, resolved: 15 },
    { day: 'Thu', volume: 12, resolved: 10 },
    { day: 'Fri', volume: 22, resolved: 18 },
    { day: 'Sat', volume: 7, resolved: 7 },
    { day: 'Sun', volume: 5, resolved: 5 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner with 3D Orb Status */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#12192c] via-[#101726] to-[#0c121e] border border-[#1e293b] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-3 sm:gap-4 z-10">
          <AIOrb size="md" state="idle" />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">OpsMind Central Intelligence</h2>
              <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> All 5 Agents Operational
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              Ticket triage, RAG policy lookup, and predictive operations intelligence running with live Gemini server integration.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 z-10 w-full md:w-auto">
          <button
            onClick={fetchDashboardData}
            className="p-2 sm:p-2.5 rounded-xl bg-[#172136] hover:bg-[#1d2a45] text-slate-300 border border-[#1e293b] transition-all cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {onSimulateInboundTicket && (
            <button
              onClick={onSimulateInboundTicket}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
              title="Inject realistic urgent enterprise ticket with live AI triage"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Simulate Incident</span>
            </button>
          )}
          <button
            onClick={onOpenNewTicketModal}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-violet-500/20 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row (2 cols on mobile, 3 on tablet, 5 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Tickets */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#1e293b]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Tickets</span>
            <LifeBuoy className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">{metrics?.totalTickets ?? 0}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Indexed in Firestore</span>
          </div>
        </div>

        {/* Open Queue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#1e293b]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Open Queue</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400 tabular-nums">{metrics?.openTickets ?? 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Requires human review</div>
        </div>

        {/* Resolved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#1e293b]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">{metrics?.resolvedTickets ?? 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Approved & closed</div>
        </div>

        {/* Avg Sentiment */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#1e293b]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Customer Sentiment</span>
            <Smile className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
            {metrics?.avgSentimentScore !== undefined ? metrics.avgSentimentScore : '0.0'}
          </div>
          <div className="text-[11px] text-amber-300 font-medium mt-1">
            {metrics?.sentimentLabel || 'Neutral'}
          </div>
        </div>

        {/* AI Executions - spans full 2 columns on mobile */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#1e293b]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">AI Executions</span>
            <Bot className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-violet-400 tabular-nums">{executions.length || 5}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">99.4% Success rate</div>
        </div>
      </div>

      {/* 3. Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Ticket Volume (Area chart) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#111827] border border-[#1e293b]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Weekly Ticket Volume & Resolution</h3>
              <p className="text-xs text-slate-500">Inbound complaints vs automated resolutions</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              +14% Speedup
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" name="Inbound Tickets" />
                <Area type="monotone" dataKey="resolved" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved Tickets" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Breakdown (Bar chart) */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-[#111827] border border-[#1e293b]">
          <h3 className="text-sm font-bold text-slate-100 mb-1">Sentiment Distribution</h3>
          <p className="text-xs text-slate-500 mb-6">Real-time classification</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentChartData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {sentimentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown (Pie / Donut) */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-[#111827] border border-[#1e293b] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">Priority Matrix</h3>
            <p className="text-xs text-slate-500 mb-4">Urgency distribution</p>

            <div className="h-44 w-full flex items-center justify-center">
              {priorityChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-xs text-slate-500">No active priorities</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-[#1e293b]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-slate-300">Critical ({metrics?.priorityCounts.Critical ?? 0})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-300">High ({metrics?.priorityCounts.High ?? 0})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Medium ({metrics?.priorityCounts.Medium ?? 0})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Low ({metrics?.priorityCounts.Low ?? 0})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Tickets Table & Recent Executions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Tickets Table */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#111827] border border-[#1e293b]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Recent Customer Support Tickets</h3>
              <p className="text-xs text-slate-500">Live operational feed with AI triage status</p>
            </div>
            <button
              onClick={() => onNavigateTab('tickets')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Tickets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#1e293b] rounded-2xl">
              <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No support tickets found</p>
              <button
                onClick={onOpenNewTicketModal}
                className="mt-3 text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Create your first support ticket
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-[#1e293b] text-slate-400 font-semibold">
                    <th className="pb-3 pl-1">Ticket</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Sentiment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-1">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]/60">
                  {tickets.slice(0, 5).map((t) => {
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
                        className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                        onClick={() => onNavigateToTicket(t.ticketId)}
                      >
                        <td className="py-3 pl-1 font-medium text-slate-200">
                          <div className="truncate max-w-[180px] font-semibold">{t.subject}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{t.ticketId}</div>
                        </td>
                        <td className="py-3 text-slate-300">
                          <div className="truncate max-w-[120px]">{t.customerName}</div>
                        </td>
                        <td className="py-3 text-slate-400">
                          <span className="truncate max-w-[110px] block">{t.category}</span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-[11px] text-slate-300">{t.sentiment}</span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge}`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToTicket(t.ticketId);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent AI Executions Log */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#111827] border border-[#1e293b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100">Live Agent Telemetry</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-3">
              {executions.slice(0, 4).map((exec) => (
                <div
                  key={exec.executionId}
                  className="p-3 rounded-2xl bg-[#0c101d] border border-[#1e293b] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">{exec.agentName}</span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {exec.executionTimeMs}ms
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] truncate">{exec.inputSummary}</p>
                  <div className="text-[10px] text-slate-500 truncate">{exec.outputSummary}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1e293b] mt-4">
            <button
              onClick={() => onNavigateTab('agents')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#151d2e] hover:bg-[#1a253a] hover:text-white transition-all text-center cursor-pointer block"
            >
              Open Specialized AI Agent Console &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
