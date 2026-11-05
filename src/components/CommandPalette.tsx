import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  LayoutDashboard,
  Bot,
  BrainCircuit,
  FileText,
  LifeBuoy,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  RefreshCw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  ArrowRight,
} from 'lucide-react';
import type { NavTab } from './layout/Sidebar';
import { soundManager } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenNewTicketModal: () => void;
  onSimulateInboundTicket?: () => void;
  onResetDemoData?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'AI Intelligence' | 'System';
  shortcut?: string;
  icon: React.ElementType;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenNewTicketModal,
  onSimulateInboundTicket,
  onResetDemoData,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [muted, setMuted] = useState(soundManager.isMuted());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      soundManager.playClick();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Executive Dashboard & Metrics',
      category: 'Navigation',
      shortcut: 'G D',
      icon: LayoutDashboard,
      action: () => {
        onNavigateTab('dashboard');
        onClose();
      },
    },
    {
      id: 'nav-workspace',
      title: 'AI Copilot Workspace',
      category: 'Navigation',
      shortcut: 'G W',
      icon: Bot,
      action: () => {
        onNavigateTab('workspace');
        onClose();
      },
    },
    {
      id: 'nav-agents',
      title: 'Specialized AI Agents Console',
      category: 'Navigation',
      shortcut: 'G A',
      icon: BrainCircuit,
      action: () => {
        onNavigateTab('agents');
        onClose();
      },
    },
    {
      id: 'nav-knowledge',
      title: 'Enterprise Knowledge Base & Vector RAG',
      category: 'Navigation',
      shortcut: 'G K',
      icon: FileText,
      action: () => {
        onNavigateTab('knowledge');
        onClose();
      },
    },
    {
      id: 'nav-tickets',
      title: 'Customer Support Tickets',
      category: 'Navigation',
      shortcut: 'G T',
      icon: LifeBuoy,
      action: () => {
        onNavigateTab('tickets');
        onClose();
      },
    },
    {
      id: 'nav-analytics',
      title: 'Operational Analytics & Trends',
      category: 'Navigation',
      shortcut: 'G N',
      icon: BarChart3,
      action: () => {
        onNavigateTab('analytics');
        onClose();
      },
    },
    {
      id: 'nav-settings',
      title: 'Workspace Settings & Security',
      category: 'Navigation',
      shortcut: 'G S',
      icon: Settings,
      action: () => {
        onNavigateTab('settings');
        onClose();
      },
    },

    // Actions
    {
      id: 'act-new-ticket',
      title: 'Create New Support Ticket',
      category: 'Actions',
      shortcut: 'N',
      icon: Plus,
      action: () => {
        onClose();
        onOpenNewTicketModal();
      },
    },
    {
      id: 'act-simulate-ticket',
      title: 'Simulate Live Inbound Urgent Ticket',
      category: 'Actions',
      shortcut: 'S',
      icon: Zap,
      action: () => {
        onClose();
        if (onSimulateInboundTicket) {
          onSimulateInboundTicket();
        }
      },
    },
    {
      id: 'act-test-agent',
      title: 'Run Ticket Intelligence Triage Test',
      category: 'AI Intelligence',
      icon: Sparkles,
      action: () => {
        onNavigateTab('agents');
        onClose();
      },
    },
    {
      id: 'act-toggle-sound',
      title: muted ? 'Unmute Sound Effects' : 'Mute Sound Effects',
      category: 'System',
      icon: muted ? VolumeX : Volume2,
      action: () => {
        const next = soundManager.toggleMute();
        setMuted(next);
        soundManager.playClick();
      },
    },
    {
      id: 'act-reset-demo',
      title: 'Reset Recruiter Demo Data',
      category: 'System',
      icon: RefreshCw,
      action: () => {
        onClose();
        if (onResetDemoData) {
          onResetDemoData();
        }
      },
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        soundManager.playClick();
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#0f172a] border border-violet-500/30 rounded-3xl w-full max-w-2xl shadow-2xl shadow-violet-500/10 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1e293b] flex items-center gap-3 bg-[#0a0e1a]/80">
          <Search className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search actions (e.g., 'tickets', 'simulate', 'agents')..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1e293b] text-[10px] text-slate-400 font-mono border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching actions found for "{query}".
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    soundManager.playClick();
                    cmd.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-3 rounded-2xl cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600/30 via-indigo-600/20 to-transparent border border-violet-500/40 text-white'
                      : 'text-slate-300 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{cmd.title}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {cmd.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cmd.shortcut && (
                      <kbd className="text-[10px] px-2 py-0.5 rounded bg-[#111827] text-slate-400 border border-slate-800 font-mono">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1e293b] bg-[#0a0e1a] flex items-center justify-between text-[11px] text-slate-500 px-4">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="text-[10px] font-mono text-slate-400">↑↓</kbd></span>
            <span>Select: <kbd className="text-[10px] font-mono text-slate-400">↵</kbd></span>
          </div>
          <span className="text-violet-400 font-medium">OpsMind Enterprise Intelligence</span>
        </div>
      </div>
    </div>
  );
};
