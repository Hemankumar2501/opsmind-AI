import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { CommandPalette } from './components/CommandPalette';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIWorkspacePage } from './pages/AIWorkspacePage';
import { AgentsPage } from './pages/AgentsPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { TicketsPage } from './pages/TicketsPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ConversationsPage } from './pages/ConversationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NewTicketModal } from './components/tickets/NewTicketModal';
import { soundManager } from './utils/audio';
import { Sparkles, CheckCircle2, AlertTriangle, Zap, X } from 'lucide-react';

type PublicRoute = 'landing' | 'login' | 'register' | 'forgot-password';

function parsePathname(): { tab: NavTab; ticketId: string | null; publicRoute: PublicRoute } {
  if (typeof window === 'undefined') {
    return { tab: 'dashboard', ticketId: null, publicRoute: 'landing' };
  }
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  
  if (path === '/login') return { tab: 'dashboard', ticketId: null, publicRoute: 'login' };
  if (path === '/register') return { tab: 'dashboard', ticketId: null, publicRoute: 'register' };
  if (path === '/forgot-password') return { tab: 'dashboard', ticketId: null, publicRoute: 'forgot-password' };
  if (path === '/workspace') return { tab: 'workspace', ticketId: null, publicRoute: 'landing' };
  if (path === '/agents') return { tab: 'agents', ticketId: null, publicRoute: 'landing' };
  if (path === '/knowledge') return { tab: 'knowledge', ticketId: null, publicRoute: 'landing' };
  if (path === '/analytics') return { tab: 'analytics', ticketId: null, publicRoute: 'landing' };
  if (path === '/conversations') return { tab: 'conversations', ticketId: null, publicRoute: 'landing' };
  if (path === '/notifications') return { tab: 'notifications', ticketId: null, publicRoute: 'landing' };
  if (path === '/settings') return { tab: 'settings', ticketId: null, publicRoute: 'landing' };
  
  const ticketMatch = path.match(/^\/tickets\/(.+)$/);
  if (ticketMatch) {
    return { tab: 'tickets', ticketId: ticketMatch[1], publicRoute: 'landing' };
  }
  if (path === '/tickets') {
    return { tab: 'tickets', ticketId: null, publicRoute: 'landing' };
  }

  return { tab: 'dashboard', ticketId: null, publicRoute: 'landing' };
}

function MainApp() {
  const { currentUser, userProfile, isDemoMode, loading, loginAsDemo } = useAuth();
  const initial = parsePathname();
  const [publicRoute, setPublicRoute] = useState<PublicRoute>(initial.publicRoute);
  const [currentTab, setCurrentTab] = useState<NavTab>(initial.tab);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(initial.ticketId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    type: 'success' | 'agent' | 'urgent';
  } | null>(null);

  // Synchronize browser history and path changes
  const navigateTo = useCallback((tab: NavTab, ticketId: string | null = null) => {
    soundManager.playClick();
    setCurrentTab(tab);
    setSelectedTicketId(ticketId);
    setIsMobileSidebarOpen(false);

    let newPath = `/${tab}`;
    if (tab === 'dashboard') newPath = '/';
    if (tab === 'tickets' && ticketId) newPath = `/tickets/${ticketId}`;

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  }, []);

  // Listen to popstate (back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePathname();
      setCurrentTab(parsed.tab);
      setSelectedTicketId(parsed.ticketId);
      setPublicRoute(parsed.publicRoute);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle ?autostart=1 or ?demo=1 query params for automated testing and quick demo access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || params.get('demo') === '1') {
      loginAsDemo();
    }
  }, [loginAsDemo]);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate an urgent inbound ticket with real-time AI Agent triage
  const handleSimulateInboundTicket = async () => {
    try {
      soundManager.playAgentPulse();
      const res = await fetch('/api/tickets/simulate-inbound', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.ticket) {
        soundManager.playNotification();
        setToastMessage({
          title: `Inbound Ticket Triaged: #${data.ticket.ticketId}`,
          description: `${data.ticket.subject} (Urgency: ${data.ticket.priority})`,
          type: 'urgent',
        });
        setTimeout(() => setToastMessage(null), 7000);
        // Navigate to tickets page and select it
        navigateTo('tickets', data.ticket.ticketId);
      }
    } catch (err) {
      console.error('Failed to simulate ticket:', err);
    }
  };

  const handleResetDemoData = async () => {
    try {
      soundManager.playClick();
      await fetch('/api/demo/seed', { method: 'POST' });
      soundManager.playSuccess();
      setToastMessage({
        title: 'Demo Data Refreshed',
        description: 'Verified enterprise records reloaded successfully.',
        type: 'success',
      });
      setTimeout(() => setToastMessage(null), 4000);
      setTimeout(() => window.location.reload(), 600);
    } catch (e) {
      console.error('Failed to reset demo data', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b14] flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wide text-slate-300">
          OpsMind AI &bull; Initializing Enterprise Runtime...
        </span>
      </div>
    );
  }

  // If not authenticated and not demo mode, render public pages
  const isAuthenticated = Boolean(currentUser || isDemoMode);

  if (!isAuthenticated) {
    switch (publicRoute) {
      case 'login':
        return (
          <LoginPage
            onNavigateRegister={() => {
              setPublicRoute('register');
              window.history.pushState(null, '', '/register');
            }}
            onNavigateForgotPassword={() => {
              setPublicRoute('forgot-password');
              window.history.pushState(null, '', '/forgot-password');
            }}
            onLoginSuccess={() => {
              soundManager.playSuccess();
              navigateTo('dashboard');
            }}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onNavigateLogin={() => {
              setPublicRoute('login');
              window.history.pushState(null, '', '/login');
            }}
            onRegisterSuccess={() => {
              soundManager.playSuccess();
              navigateTo('dashboard');
            }}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onNavigateLogin={() => {
              setPublicRoute('login');
              window.history.pushState(null, '', '/login');
            }}
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage
            onGetStarted={() => {
              setPublicRoute('register');
              window.history.pushState(null, '', '/register');
            }}
            onLogin={() => {
              setPublicRoute('login');
              window.history.pushState(null, '', '/login');
            }}
            onOpenDemo={() => {
              soundManager.playSuccess();
              loginAsDemo();
              navigateTo('dashboard');
            }}
          />
        );
    }
  }

  // If authenticated but onboarding not completed, render onboarding wizard
  if (userProfile && !userProfile.onboardingCompleted) {
    return <OnboardingPage onComplete={() => navigateTo('dashboard')} />;
  }

  // Authenticated workspace shell
  return (
    <div className="min-h-screen flex bg-[#080b14] text-slate-100 font-sans overflow-x-hidden selection:bg-violet-600 selection:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => navigateTo(tab)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => {
          soundManager.playClick();
          setSidebarCollapsed(!sidebarCollapsed);
        }}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <TopNavbar
          currentTab={currentTab}
          onOpenNewTicketModal={() => {
            soundManager.playClick();
            setIsNewTicketModalOpen(true);
          }}
          onNavigateTab={(tab) => navigateTo(tab)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onSimulateInboundTicket={handleSimulateInboundTicket}
          onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 pb-12">
          {/* Active Tab Router */}
          {currentTab === 'dashboard' && (
            <DashboardPage
              onOpenNewTicketModal={() => {
                soundManager.playClick();
                setIsNewTicketModalOpen(true);
              }}
              onNavigateToTicket={(id) => navigateTo('tickets', id)}
              onNavigateTab={(tab) => navigateTo(tab)}
              onSimulateInboundTicket={handleSimulateInboundTicket}
            />
          )}

          {currentTab === 'workspace' && <AIWorkspacePage />}

          {currentTab === 'agents' && <AgentsPage />}

          {currentTab === 'knowledge' && <KnowledgeBasePage />}

          {currentTab === 'tickets' && (
            selectedTicketId ? (
              <TicketDetailsPage
                ticketId={selectedTicketId}
                onBack={() => navigateTo('tickets')}
              />
            ) : (
              <TicketsPage
                onSelectTicket={(id) => navigateTo('tickets', id)}
                onOpenNewTicketModal={() => {
                  soundManager.playClick();
                  setIsNewTicketModalOpen(true);
                }}
                onSimulateInboundTicket={handleSimulateInboundTicket}
              />
            )
          )}

          {currentTab === 'analytics' && <AnalyticsPage />}

          {currentTab === 'conversations' && (
            <ConversationsPage
              onOpenConversationInWorkspace={(convId) => {
                navigateTo('workspace');
              }}
            />
          )}

          {currentTab === 'notifications' && <NotificationsPage />}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => navigateTo(tab)}
        onOpenNewTicketModal={() => {
          soundManager.playClick();
          setIsNewTicketModalOpen(true);
        }}
        onSimulateInboundTicket={handleSimulateInboundTicket}
        onResetDemoData={handleResetDemoData}
      />

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onTicketCreated={() => {
          soundManager.playSuccess();
          if (currentTab === 'tickets') {
            window.location.reload();
          } else {
            navigateTo('tickets');
          }
        }}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0f172a] border border-cyan-500/40 rounded-2xl shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            {toastMessage.type === 'urgent' ? (
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              {toastMessage.description}
            </p>
          </div>

          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-500 hover:text-slate-300 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
