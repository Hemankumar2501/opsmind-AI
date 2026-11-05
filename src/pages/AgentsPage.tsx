import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Bot,
  FileText,
  LifeBuoy,
  BarChart3,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ChevronRight,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import type { AIAgentMeta, AgentExecutionLog } from '../types';

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AIAgentMeta[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgentMeta | null>(null);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data.agents || []);
      if (data.agents && data.agents.length > 0 && !selectedAgent) {
        setSelectedAgent(data.agents[0]);
        setTestInput(data.agents[0].samplePrompt);
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSelectAgent = (agent: AIAgentMeta) => {
    setSelectedAgent(agent);
    setTestInput(agent.samplePrompt);
    setTestOutput(null);
  };

  const handleRunTest = async () => {
    if (!selectedAgent || !testInput.trim()) return;

    setTesting(true);
    setTestOutput(null);

    try {
      let endpoint = '/api/ai/chat';
      let payload: any = { message: testInput };

      if (selectedAgent.name.includes('Ticket')) {
        endpoint = '/api/ai/analyze-ticket';
        payload = { subject: 'Test Incident', description: testInput, customerName: 'Testing Lead' };
      } else if (selectedAgent.name.includes('Response')) {
        endpoint = '/api/ai/generate-response';
        payload = { subject: 'Test Subject', description: testInput, customerName: 'Valued Client' };
      } else if (selectedAgent.name.includes('Insights')) {
        endpoint = '/api/ai/business-insights';
        payload = {};
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setTestOutput(data);
    } catch (err: any) {
      setTestOutput({ error: err.message || 'Execution failed' });
    } finally {
      setTesting(false);
    }
  };

  const toggleAgentStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'disabled' : 'active' } : a
      )
    );
  };

  const copyOutput = () => {
    if (!testOutput) return;
    navigator.clipboard.writeText(JSON.stringify(testOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAgentIcon = (name: string) => {
    if (name.includes('Ticket')) return LifeBuoy;
    if (name.includes('Knowledge')) return FileText;
    if (name.includes('Response')) return Bot;
    if (name.includes('Insights')) return BarChart3;
    return BrainCircuit;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Specialized AI Agent Mesh</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
            5 Autonomous Agents
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Each specialized agent features dedicated system instructions, strict validation schemas, and real-time execution telemetry.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {agents.map((agent) => {
          const Icon = getAgentIcon(agent.name);
          const isSelected = selectedAgent?.id === agent.id;
          const isActive = agent.status === 'active';

          return (
            <div
              key={agent.id}
              onClick={() => handleSelectAgent(agent)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#151e33] border-violet-500 ring-1 ring-violet-500/40 shadow-xl shadow-violet-500/10'
                  : 'bg-[#111827] border-[#1e293b] hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center p-0.5 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-violet-600 to-cyan-400 text-white'
                        : 'bg-[#1a2336] text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <button
                    onClick={(e) => toggleAgentStatus(agent.id, e)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-950/60 text-red-400 border-red-500/40'
                    }`}
                  >
                    {isActive ? '● Active' : '○ Standby'}
                  </button>
                </div>

                <h3 className="text-base font-bold text-white mb-0.5">{agent.name}</h3>
                <div className="text-xs font-semibold text-cyan-400 mb-2">{agent.role}</div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.description}</p>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#1e293b] text-center text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Total Runs</span>
                    <span className="font-bold text-slate-200">{agent.totalExecutions || 1}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Success</span>
                    <span className="font-bold text-emerald-400">{agent.successRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Avg Latency</span>
                    <span className="font-bold text-slate-200">{agent.avgLatencyMs}ms</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-violet-400 group-hover:text-violet-300">
                  <span>Inspect & Test Agent</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Inspector & Live Test Bench */}
      {selectedAgent && (
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#111827] border border-[#1e293b] shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#1e293b] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Live Agent Testbench
                </span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-xs text-slate-400">{selectedAgent.role}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedAgent.name}</h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Capabilities:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#162032] text-slate-300 border border-[#1e293b]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Test Request / Customer Prompt
                </label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0b0f19] text-xs text-slate-100 p-3 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none resize-none leading-relaxed"
                  placeholder="Enter input to evaluate agent logic..."
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setTestInput(selectedAgent.samplePrompt)}
                  className="text-xs text-slate-400 hover:text-cyan-400 cursor-pointer"
                >
                  Load Sample Prompt
                </button>

                <button
                  onClick={handleRunTest}
                  disabled={testing || !testInput.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-violet-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {testing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Executing Agent...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Execute Agent</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Structured Output Stream */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Execution Output & Structured JSON</span>
                </span>
                {testOutput && (
                  <button
                    onClick={copyOutput}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 bg-[#080b14] rounded-2xl border border-[#1e293b] p-4 font-mono text-xs text-slate-300 overflow-x-auto min-h-[180px] max-h-72">
                {testing ? (
                  <div className="h-full flex items-center justify-center text-slate-500 gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Orchestrating agent call via Gemini server runtime...</span>
                  </div>
                ) : testOutput ? (
                  <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(testOutput, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center">
                    <Terminal className="w-8 h-8 mb-2 opacity-50" />
                    <span>Run execution above to inspect live structured outputs</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
