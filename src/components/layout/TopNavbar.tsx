import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  ChevronDown,
  Plus,
  ShieldCheck,
  Building,
  Check,
} from 'lucide-react';
import { AIOrb } from '../3d/AIOrb';
import { useAuth } from '../../contexts/AuthContext';
import type { NavTab } from './Sidebar';
import type { AppNotification } from '../../types';
import { soundManager } from '../../utils/audio';
import { Volume2, VolumeX, Zap, Command, Menu } from 'lucide-react';

interface TopNavbarProps {
  currentTab: NavTab;
  onOpenNewTicketModal: () => void;
  onNavigateTab: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCommandPalette?: () => void;
  onSimulateInboundTicket?: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onOpenNewTicketModal,
  onNavigateTab,
  searchQuery,
  onSearchChange,
  onOpenCommandPalette,
  onSimulateInboundTicket,
  onToggleMobileMenu,
}) => {
  const { workspace, userProfile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());

  const toggleSound = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
    soundManager.playClick();
  };

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
      description: 'Human approval logged for $450 invoice adjustment.',
      type: 'response',
      isRead: true,
      createdAt: '3 hours ago',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Executive Overview';
      case 'workspace':
        return 'AI Copilot';
      case 'agents':
        return 'AI Agents';
      case 'knowledge':
        return 'Knowledge Base';
      case 'tickets':
        return 'Support Tickets';
      case 'analytics':
        return 'Analytics';
      case 'conversations':
        return 'Audit Logs';
      case 'notifications':
        return 'Notifications';
      case 'settings':
        return 'Settings';
      default:
        return 'OpsMind AI';
    }
  };

  return (
    <header className="h-14 sm:h-16 border-b border-[#1e293b]/80 bg-[#0a0e1a]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Section */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 -ml-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden cursor-pointer"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5 text-slate-200" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 tracking-tight whitespace-nowrap">
            {getTabTitle(currentTab)}
          </h1>
          <p className="text-[11px] text-slate-500 hidden 2xl:block truncate max-w-[200px]">
            {workspace?.name || 'Acme Global Operations'} &bull; Real-time AI
          </p>
        </div>
      </div>

      {/* Middle Search Input with Command Palette trigger */}
      <div
        onClick={onOpenCommandPalette}
        className="hidden md:flex items-center relative max-w-[200px] lg:max-w-[280px] w-full mx-3 cursor-pointer group shrink"
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-violet-400 absolute left-3 pointer-events-none transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tickets, docs, agents..."
          className="w-full bg-[#111827]/80 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-14 py-2 rounded-xl border border-[#1e293b] group-hover:border-violet-500/50 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <div className="absolute right-2 flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[#1e293b] text-[10px] text-slate-400 font-mono border border-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mobile Search Button */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 md:hidden cursor-pointer"
            title="Search or commands (⌘K)"
          >
            <Search className="w-4 h-4 text-slate-300" />
          </button>
        )}

        {/* Simulate Inbound Ticket Button */}
        {onSimulateInboundTicket && (
          <button
            onClick={onSimulateInboundTicket}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-xs transition-all cursor-pointer shadow-sm"
            title="Simulate realistic incoming enterprise customer complaint with instant AI triage"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Simulate Ticket</span>
          </button>
        )}

        {/* Quick New Ticket Action */}
        <button
          onClick={onOpenNewTicketModal}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-violet-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          title="New Ticket"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Ticket</span>
        </button>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          title={isMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
          aria-label={isMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* 3D AI Orb Status Indicator */}
        <div
          onClick={() => onNavigateTab('workspace')}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#131c2e] border border-violet-500/30 cursor-pointer hover:border-violet-400/60 transition-colors"
          title="AI Orchestrator Online & Ready"
        >
          <AIOrb size="sm" state="idle" />
          <span className="text-[11px] font-medium text-slate-300 hidden lg:inline">
            Copilot <span className="text-emerald-400 font-semibold">Ready</span>
          </span>
        </div>

        {/* Workspace Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[100px]">{workspace?.name || 'Workspace'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111827] border border-[#1e293b] shadow-xl p-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Workspace
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-violet-600/15 text-slate-200 text-xs">
                <span className="font-medium truncate">{workspace?.name}</span>
                <Check className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <div className="mt-2 border-t border-[#1e293b] pt-1">
                <button
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md"
                >
                  Manage Workspace Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors relative"
            aria-label="View Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0a0e1a] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#111827] border border-[#1e293b] shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#1e293b]/60">
                {notifications.map((n) => (
                  <div
                    key={n.notificationId}
                    className={`p-3 text-xs transition-colors ${
                      n.isRead ? 'opacity-70 bg-transparent' : 'bg-violet-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {n.createdAt}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">{n.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-[#1e293b] text-center bg-[#0d121f]">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateTab('notifications');
                  }}
                  className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  View all in Notification Center &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
