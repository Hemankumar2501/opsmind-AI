import React from 'react';
import {
  LayoutDashboard,
  Bot,
  BrainCircuit,
  FileText,
  LifeBuoy,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'workspace'
  | 'agents'
  | 'knowledge'
  | 'tickets'
  | 'analytics'
  | 'conversations'
  | 'notifications'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { userProfile, workspace, isDemoMode, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'workspace' as NavTab, label: 'AI Workspace', icon: Bot, badge: 'Copilot' },
    { id: 'agents' as NavTab, label: 'AI Agents', icon: BrainCircuit, badge: '5 Active' },
    { id: 'knowledge' as NavTab, label: 'Knowledge Base', icon: FileText },
    { id: 'tickets' as NavTab, label: 'Support Tickets', icon: LifeBuoy },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'conversations' as NavTab, label: 'Conversations', icon: MessageSquare },
    { id: 'notifications' as NavTab, label: 'Notifications', icon: Bell },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  const handleResetDemoData = async () => {
    try {
      await fetch('/api/demo/seed', { method: 'POST' });
      window.location.reload();
    } catch (e) {
      console.error('Failed to reset demo data', e);
    }
  };

  const renderContent = (isMobileView = false) => {
    const isEffectivelyCollapsed = !isMobileView && collapsed;

    return (
      <div className="flex flex-col h-full select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e293b]/70 shrink-0">
          <div
            onClick={() => {
              onSelectTab('dashboard');
              if (isMobileView && onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/20 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            {!isEffectivelyCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    OpsMind
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 truncate max-w-[130px]">
                  {workspace?.name || 'Enterprise Copilot'}
                </span>
              </div>
            )}
          </div>

          {isMobileView ? (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && !isEffectivelyCollapsed && (
          <div className="mx-3 mt-3 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Recruiter Demo Mode</span>
            </div>
            <button
              onClick={handleResetDemoData}
              title="Reset verified sample records"
              className="p-1 hover:bg-cyan-900/50 rounded transition-colors text-cyan-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (isMobileView && onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/25 to-indigo-600/10 text-white border border-violet-500/40 shadow-sm shadow-violet-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                title={isEffectivelyCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-violet-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!isEffectivelyCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-violet-500/30 text-violet-300'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-violet-500 to-cyan-400 rounded-r" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-[#1e293b]/70 bg-[#0a0e18]/80 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center text-xs font-bold text-white">
                  {userProfile?.fullName ? userProfile.fullName.slice(0, 2).toUpperCase() : 'OP'}
                </div>
              </div>
              {!isEffectivelyCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold text-slate-200 truncate">
                    {userProfile?.fullName || 'Alex Vance'}
                  </span>
                  <span className="text-xs text-slate-500 truncate">
                    {userProfile?.role || 'Operations Lead'}
                  </span>
                </div>
              )}
            </div>

            {!isEffectivelyCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#0d121f] border-r border-[#1e293b] flex flex-col z-50 lg:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {renderContent(true)}
      </aside>

      {/* Desktop Standard Sidebar */}
      <aside
        className={`hidden lg:flex h-screen bg-[#0d121f] border-r border-[#1e293b] flex-col transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderContent(false)}
      </aside>
    </>
  );
};
