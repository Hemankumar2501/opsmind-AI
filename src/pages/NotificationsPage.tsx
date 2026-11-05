import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Check,
  LifeBuoy,
  FileText,
  Sparkles,
  Bot,
  Filter,
} from 'lucide-react';
import type { AppNotification } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      notificationId: 'notif-1',
      userId: 'user-1',
      workspaceId: 'default',
      title: 'Ticket #t-1001 AI Triage Completed',
      description: 'Critical priority assigned with 98% confidence. Recommended quota expansion.',
      type: 'agent',
      isRead: false,
      createdAt: '10 mins ago',
    },
    {
      notificationId: 'notif-2',
      userId: 'user-1',
      workspaceId: 'default',
      title: 'Enterprise SLA Policy v4.1 Indexed',
      description: 'Knowledge document chunked and ready for semantic vector search.',
      type: 'document',
      isRead: false,
      createdAt: '1 hour ago',
    },
    {
      notificationId: 'notif-3',
      userId: 'user-1',
      workspaceId: 'default',
      title: 'Credit Memo Approved for t-1002',
      description: 'Human approval logged for $450 invoice adjustment by Marcus Vance.',
      type: 'response',
      isRead: true,
      createdAt: '3 hours ago',
    },
    {
      notificationId: 'notif-4',
      userId: 'user-1',
      workspaceId: 'default',
      title: 'Weekly Sentiment Report Generated',
      description: 'Business Insights Agent compiled 4-week complaint trend analysis.',
      type: 'agent',
      isRead: true,
      createdAt: 'Yesterday',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true));
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ticket':
        return LifeBuoy;
      case 'document':
        return FileText;
      case 'response':
        return CheckCircle2;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Notification Center</span>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                {unreadCount} Unread
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time operational alerts for ticket priorities, document indexing, and AI agent outputs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-[#111827] border border-[#1e293b] text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'unread' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unread
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 transition-all cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#111827] border border-[#1e293b] text-slate-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-400">No notifications found</p>
            <span className="text-xs text-slate-500">You are all caught up with your operational alerts.</span>
          </div>
        ) : (
          filtered.map((item) => {
            const Icon = getIcon(item.type);

            return (
              <div
                key={item.notificationId}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  item.isRead
                    ? 'bg-[#111827] border-[#1e293b] opacity-80'
                    : 'bg-[#141d30] border-violet-500/40 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.isRead ? 'bg-[#162032] text-slate-400' : 'bg-violet-600/20 text-cyan-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                      {!item.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      {item.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!item.isRead && (
                    <button
                      onClick={() => markAsRead(item.notificationId)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.notificationId)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
