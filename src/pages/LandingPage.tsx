import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  FileText,
  LifeBuoy,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Lock,
  Search,
  Check,
  Play,
} from 'lucide-react';
import { NeuralSphere } from '../components/3d/NeuralSphere';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onOpenDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onOpenDemo,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const agentsList = [
    {
      name: 'Ticket Intelligence Agent',
      badge: 'Agent 01',
      role: 'Support Triage & Intent Classifier',
      desc: 'Parses complex customer tickets, detects customer urgency, calculates sentiment scores, and produces deterministic structured triage JSON.',
      metric: 'Sub-450ms Latency',
    },
    {
      name: 'Knowledge Intelligence Agent',
      badge: 'Agent 02',
      role: 'Semantic Document RAG & Citations',
      desc: 'Retrieves relevant enterprise policies, SLAs, and technical manuals using vector embeddings, returning grounded answers with verified citations.',
      metric: 'Zero-Hallucination Guard',
    },
    {
      name: 'Response Generation Agent',
      badge: 'Agent 03',
      role: 'Human-in-the-Loop Reply Drafter',
      desc: 'Drafts policy-compliant customer correspondence across formal, empathetic, or concise tones with mandatory human review before transmission.',
      metric: 'Human Sign-off Workflow',
    },
    {
      name: 'Business Insights Agent',
      badge: 'Agent 04',
      role: 'Executive Intelligence & Trend Analyst',
      desc: 'Continuously clusters customer complaints, exposes systemic operational bottlenecks, and compiles actionable executive briefs.',
      metric: 'Pure Database Grounding',
    },
    {
      name: 'Supervisor Orchestrator',
      badge: 'Agent 05',
      role: 'Central AI Multi-Agent Coordinator',
      desc: 'Decides task routing, coordinates sequential agent execution pipelines, merges outputs, and maintains end-to-end execution audit trails.',
      metric: 'Self-Guiding Router',
    },
  ];

  const faqs = [
    {
      q: 'How does OpsMind AI prevent hallucinations in customer support replies?',
      a: 'OpsMind AI pairs every response with the Knowledge Intelligence Agent using Retrieval-Augmented Generation (RAG). Before an answer is drafted, our vector retrieval system pulls exact sentences from verified company policies and SLAs. If the information does not exist in your knowledge base, the model explicitly flags the policy absence rather than inventing terms.',
    },
    {
      q: 'Are customer tickets and documents isolated between companies?',
      a: 'Yes. OpsMind AI enforces strict multi-tenant workspace isolation at both the database and application layers. Cloud Firestore security rules strictly constrain reads and queries to the authenticated user’s active workspace ID. Cross-workspace data leakage is cryptographically prevented.',
    },
    {
      q: 'Can human agents edit and approve responses before they are sent?',
      a: 'Absolutely. OpsMind AI treats human verification as a core principle. The Response Generation Agent drafts replies with multiple tone presets (Professional, Empathetic, Concise), but replies require an explicit "Approve & Send" action by an authorized team member.',
    },
    {
      q: 'What document formats are supported for the Knowledge Base?',
      a: 'The platform ingests and chunks PDF contracts, TXT guides, and DOCX standard operating procedures up to 10MB per file with automated text extraction, chunking, and semantic vector indexing.',
    },
    {
      q: 'Is there a way for recruiters or stakeholders to test the app without signing up?',
      a: 'Yes! We have integrated a full Recruiter Demo Mode with verified sample data across tickets, SLA policies, and agent executions. Click "Explore Demo Workspace" in the header to jump straight in.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 selection:bg-violet-500/30 font-sans">
      {/* 1. Global Navigation Bar */}
      <nav className="h-16 sm:h-20 border-b border-[#1e293b]/70 bg-[#080b14]/80 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#080b14] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">OpsMind</span>
            <span className="text-[10px] sm:text-xs uppercase font-extrabold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
              AI
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#agents" className="hover:text-white transition-colors">
            AI Agents
          </a>
          <a href="#architecture" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#security" className="hover:text-white transition-colors">
            Security
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDemo}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400" />
            <span className="hidden sm:inline">Try Demo Mode</span>
            <span className="sm:hidden">Demo</span>
          </button>
          <button
            onClick={onLogin}
            className="hidden md:block px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 transition-all shadow-lg shadow-violet-500/25 cursor-pointer"
          >
            <span className="hidden sm:inline">Get Started Free</span>
            <span className="sm:hidden">Get Started</span>
          </button>
        </div>
      </nav>

      {/* 2. Hero Section with 3D Sphere */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 px-6 lg:px-12">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/15 via-cyan-500/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-medium text-violet-300 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Next-Generation Multi-Agent Copilot for Operations</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
              Transform Business Operations With{' '}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                Intelligent AI.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
              One intelligent workspace to understand documents, automate customer support, analyze
              business activity and make better decisions with collaborative AI agents.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onGetStarted}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-violet-500/30 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDemo}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-[#131c2e] hover:bg-[#18233a] border border-[#1e293b] text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Explore Interactive Demo</span>
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Cloud Firestore Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SOC2-ready Isolation</span>
              </div>
            </div>
          </div>

          {/* 3D Neural Sphere Canvas */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="w-full max-w-[500px] h-[440px] relative">
              <NeuralSphere className="w-full h-full" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#101625]/90 border border-slate-700/60 backdrop-blur-md text-[11px] text-slate-400 pointer-events-none flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Interactive Neural Sphere &bull; Move mouse to tilt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Enterprise Value & Metrics Pillar (No fake logos) */}
      <section className="border-y border-[#1e293b]/80 bg-[#0d121f] py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-3xl lg:text-4xl font-extrabold text-cyan-400 mb-1">
              99.95%
            </span>
            <span className="text-sm font-semibold text-slate-200 mb-0.5">Uptime SLA Guarantee</span>
            <span className="text-xs text-slate-400">High-availability enterprise clusters</span>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <span className="text-3xl lg:text-4xl font-extrabold text-violet-400 mb-1">
              &lt; 15 min
            </span>
            <span className="text-sm font-semibold text-slate-200 mb-0.5">Severity 1 SLA Target</span>
            <span className="text-xs text-slate-400">Automated triage & immediate dispatch</span>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <span className="text-3xl lg:text-4xl font-extrabold text-emerald-400 mb-1">
              100%
            </span>
            <span className="text-sm font-semibold text-slate-200 mb-0.5">Grounded RAG Citations</span>
            <span className="text-xs text-slate-400">Zero unsupported policy claims</span>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <span className="text-3xl lg:text-4xl font-extrabold text-amber-400 mb-1">
              5 Agents
            </span>
            <span className="text-sm font-semibold text-slate-200 mb-0.5">Orchestrated Mesh</span>
            <span className="text-xs text-slate-400">Dedicated operational roles</span>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3 block">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Built for Serious Business Operations.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Eliminate operational chaos with a unified platform combining customer support workflows,
            document retrieval, and automated business analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b] hover:border-violet-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Automated Ticket Triage</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatically extracts intent, classifies urgency, detects emotional sentiment, and
                suggests operational action plans in sub-second intervals.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center text-xs font-semibold text-violet-400">
              Structured JSON output &rarr;
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b] hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Vector Document Intelligence</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ingest PDF policies, SLA contracts, and SOPs. Semantic RAG retrieves exact clauses and
                displays verified citations for complete transparency.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center text-xs font-semibold text-cyan-400">
              Chunked & embedded search &rarr;
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b] hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Predictive Operations Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Real-time charts powered by actual Firestore records. Spot recurring product defects,
                billing proration friction, and seasonal SLA spikes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center text-xs font-semibold text-indigo-400">
              Zero fabricated statistics &rarr;
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI Agents Showcase */}
      <section id="agents" className="py-24 px-6 lg:px-12 bg-[#0c101d] border-t border-[#1e293b]/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 block">
              Autonomous Mesh
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Five Specialized AI Agents.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Not a decorative chatbot. Each agent executes a distinct operational duty with dedicated
              inputs, validation gates, and execution audit records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentsList.map((agent, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#131b2e] border border-[#1e293b] hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                      {agent.badge}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 mb-1">{agent.name}</h3>
                  <div className="text-xs font-semibold text-violet-400 mb-3">{agent.role}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{agent.desc}</p>
                </div>

                <div className="pt-4 border-t border-[#1e293b]/70 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Key Advantage:</span>
                  <span className="font-semibold text-slate-200">{agent.metric}</span>
                </div>
              </div>
            ))}

            <div className="p-6 rounded-2xl bg-gradient-to-tr from-violet-950/40 to-[#131b2e] border border-violet-500/30 flex flex-col justify-center items-center text-center">
              <BrainCircuit className="w-12 h-12 text-violet-400 mb-3" />
              <h4 className="font-bold text-slate-100 mb-2">Test Live In Workspace</h4>
              <p className="text-xs text-slate-400 mb-4 max-w-xs">
                Launch interactive tests and inspect raw structured outputs directly in our agent management
                console.
              </p>
              <button
                onClick={onOpenDemo}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all cursor-pointer"
              >
                Open Agent Console &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How it Works Interactive Flow */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3 block">
            End-to-End Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            How OpsMind AI Orchestrates Operations.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b] relative">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 font-extrabold flex items-center justify-center text-sm mb-4">
              1
            </div>
            <h4 className="font-bold text-slate-100 mb-2">Ingest & Embed</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer tickets arrive via API, while policy PDFs and guidelines are chunked into semantic
              embeddings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b] relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 font-extrabold flex items-center justify-center text-sm mb-4">
              2
            </div>
            <h4 className="font-bold text-slate-100 mb-2">Autonomous Triage</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ticket Intelligence Agent scores urgency, extracts root intent, and assigns operational priority.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b] relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 font-extrabold flex items-center justify-center text-sm mb-4">
              3
            </div>
            <h4 className="font-bold text-slate-100 mb-2">RAG Context Matching</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Knowledge Agent retrieves exact SLA clauses and refund policies, binding answers to hard citations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b] relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold flex items-center justify-center text-sm mb-4">
              4
            </div>
            <h4 className="font-bold text-slate-100 mb-2">Human Approval & Send</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drafted reply is previewed by a human agent with 1-click tone adjustments before transmission.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Architecture Showcase */}
      <section id="architecture" className="py-24 px-6 lg:px-12 bg-[#0c101d] border-t border-[#1e293b]/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 block">
              System Topology
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Enterprise Full-Stack Architecture.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Constructed with zero-trust security, server-side Gemini orchestration, and strict data isolation.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#111827] border border-[#1e293b] shadow-2xl overflow-x-auto">
            <div className="min-w-[700px] flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-[#162032] border border-[#1e293b]">
                  <span className="text-xs font-bold text-cyan-400 block mb-1">FRONTEND LAYER</span>
                  <span className="text-sm font-semibold text-slate-200">
                    React 19 &bull; Vite &bull; Tailwind &bull; Three.js
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    3D Neural Network, Interactive Charts, Zero-Pill UX
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#162032] border border-[#1e293b]">
                  <span className="text-xs font-bold text-violet-400 block mb-1">SERVER RUNTIME</span>
                  <span className="text-sm font-semibold text-slate-200">
                    Node.js &bull; Express REST API &bull; Gemini 2.5
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Protected server-side keys & multi-agent routing
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#162032] border border-[#1e293b]">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">STORAGE & AUTH</span>
                  <span className="text-sm font-semibold text-slate-200">
                    Cloud Firestore &bull; Firebase Auth
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    ABAC rules, isolated workspaces, audit trails
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b0f1a] border border-dashed border-slate-700 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>[Client Request]</span>
                <span className="text-violet-400">&rarr; Firebase Token Verification &rarr;</span>
                <span className="text-cyan-400">&rarr; Supervisor Orchestrator &rarr;</span>
                <span className="text-emerald-400">&rarr; Specialized Agent & Vector RAG &rarr;</span>
                <span>[Grounded Response]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Security Section */}
      <section id="security" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Zero-Trust Security by Design.
            </h2>
            <p className="text-slate-400 text-sm">
              We never expose API keys, execute unvalidated client queries, or blend tenant documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b]">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-violet-400" />
                <h4 className="font-bold text-slate-100 text-sm">Server-Side Secret Isolation</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini API credentials and administrative tokens never reach the browser. All AI logic executes
                in secure server endpoints.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827] border border-[#1e293b]">
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-slate-100 text-sm">Workspace RBAC Enforcement</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cloud Firestore security rules guarantee that queries only retrieve documents, tickets, and
                analytics belonging strictly to the verified workspace owner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pricing Section (Informational) */}
      <section id="pricing" className="py-24 px-6 lg:px-12 bg-[#0c101d] border-t border-[#1e293b]/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3 block">
              Transparent Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Simple, Predictable Tiers.
            </h2>
            <p className="text-slate-400 text-sm">
              Plans are informational; no payment is processed in this environment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-[#111827] border border-[#1e293b] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-1">Starter Free</h3>
                <p className="text-xs text-slate-400 mb-6">For small teams getting started with AI triage.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Up to 500 tickets/month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 5 Knowledge Base documents
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Standard response drafting
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 7-day analytics retention
                  </li>
                </ul>
              </div>
              <button
                onClick={onGetStarted}
                className="mt-8 w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="p-8 rounded-3xl bg-[#151e33] border-2 border-violet-500 shadow-xl shadow-violet-500/10 flex flex-col justify-between relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Most Popular
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-1">Pro Operations</h3>
                <p className="text-xs text-slate-400 mb-6">For scaling support and operations teams.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">$149</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Unlimited support tickets
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> 50 Knowledge documents + embeddings
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> All 5 specialized AI agents
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Human approval workflow & tone presets
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> 90-day predictive analytics & exports
                  </li>
                </ul>
              </div>
              <button
                onClick={onGetStarted}
                className="mt-8 w-full py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 transition-all cursor-pointer"
              >
                Start Pro Workspace
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 rounded-3xl bg-[#111827] border border-[#1e293b] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-1">Enterprise Custom</h3>
                <p className="text-xs text-slate-400 mb-6">Dedicated SLA, custom vector RAG, and audit logs.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Custom SLA guarantees (99.95%)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Unlimited documents & fine-tuning
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Dedicated Cloud Run cluster
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> SAML / Okta SSO & SCIM
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenDemo}
                className="mt-8 w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
              >
                Contact Enterprise Ops
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ Section */}
      <section id="faq" className="py-24 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 block">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#111827] border border-[#1e293b] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between text-slate-100 font-semibold text-sm hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-[#1e293b]/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="border-t border-[#1e293b]/80 bg-[#06080e] py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-violet-600/30 text-cyan-400 flex items-center justify-center font-bold text-xs">
              OM
            </div>
            <span className="font-semibold text-slate-300">OpsMind AI</span>
            <span>&bull; Intelligence That Powers Better Decisions.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-300">
              Features
            </a>
            <a href="#security" className="hover:text-slate-300">
              Security
            </a>
            <a href="#pricing" className="hover:text-slate-300">
              Pricing
            </a>
            <button onClick={onOpenDemo} className="hover:text-cyan-400 cursor-pointer">
              Recruiter Demo
            </button>
          </div>

          <div>&copy; {new Date().getFullYear()} OpsMind AI. Production-grade operations system.</div>
        </div>
      </footer>
    </div>
  );
};
