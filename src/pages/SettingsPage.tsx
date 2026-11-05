import React, { useState } from 'react';
import {
  User,
  Building,
  Shield,
  Bot,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Mail,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const SettingsPage: React.FC = () => {
  const {
    userProfile,
    workspace,
    updateProfileDetails,
    updateWorkspaceDetails,
    sendResetEmail,
    logout,
    isDemoMode,
  } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.fullName || 'Alex Vance');
  const [role, setRole] = useState(userProfile?.role || 'Operations Director');
  const [companyName, setCompanyName] = useState(workspace?.name || 'Acme Global Operations');
  const [industry, setIndustry] = useState(workspace?.industry || 'Enterprise SaaS');
  const [defaultTone, setDefaultTone] = useState('professional');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resettingData, setResettingData] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileDetails({ fullName, role });
      await updateWorkspaceDetails({ name: companyName, industry });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const handlePasswordReset = async () => {
    if (userProfile?.email) {
      try {
        await sendResetEmail(userProfile.email);
        setResetSent(true);
        setTimeout(() => setResetSent(false), 4000);
      } catch (err) {
        console.error('Password reset failed:', err);
      }
    }
  };

  const handleResetDemoData = async () => {
    if (!confirm('Reset all tickets and documents to clean baseline demo data?')) return;
    setResettingData(true);
    try {
      await fetch('/api/demo/seed', { method: 'POST' });
      window.location.reload();
    } catch (e) {
      console.error('Reset failed:', e);
    } finally {
      setResettingData(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Workspace & AI Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your enterprise profile, authentication security, and multi-agent AI parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile and workspace preferences saved successfully.</span>
        </div>
      )}

      {/* 1. Profile & Organization */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1e293b] shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1e293b]">
          <User className="w-5 h-5 text-violet-400" />
          <h3 className="text-sm font-bold text-white">Profile & Identity</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0b0f19] text-xs text-slate-100 p-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Operational Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#0b0f19] text-xs text-slate-100 p-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#0b0f19] text-xs text-slate-100 p-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[#0b0f19] text-xs text-slate-100 p-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. AI Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1e293b] shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1e293b]">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">AI Copilot Parameters</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Default Response Tone Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['professional', 'empathetic', 'concise', 'formal'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setDefaultTone(tone)}
                  className={`text-xs capitalize p-2.5 rounded-xl border transition-all cursor-pointer ${
                    defaultTone === tone
                      ? 'bg-violet-600 text-white border-violet-500'
                      : 'bg-[#0b0f19] text-slate-400 border-[#1e293b]'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b0f19] border border-[#1e293b] text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-200 block mb-1">
              Deterministic RAG Grounding Mode: Active
            </span>
            All specialized agents enforce strict citations against uploaded knowledge base chunks. Temperature is clamped to 0.2 to prevent hallucinations.
          </div>
        </div>
      </div>

      {/* 3. Security & Sessions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1e293b] shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1e293b]">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Security & Access Control</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0b0f19] border border-[#1e293b]">
            <div>
              <span className="font-semibold text-slate-200 block">Password Management</span>
              <span className="text-slate-400">
                Send a secure reset link to {userProfile?.email || 'your registered email'}.
              </span>
            </div>
            <button
              onClick={handlePasswordReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#162032] hover:bg-[#1d2a45] text-slate-200 font-semibold border border-[#1e293b] transition-all cursor-pointer"
            >
              {resetSent ? 'Email Sent!' : 'Send Reset Link'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0b0f19] border border-[#1e293b]">
            <div>
              <span className="font-semibold text-slate-200 block">Session Management</span>
              <span className="text-slate-400">Terminate current authenticated session.</span>
            </div>
            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 font-semibold border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Data Management & Demo Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1e293b] shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1e293b]">
          <Database className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Data Maintenance & Seed Controls</h3>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0b0f19] border border-[#1e293b] text-xs">
          <div>
            <span className="font-semibold text-slate-200 block">Reset Verified Demo Data</span>
            <span className="text-slate-400">
              Restore baseline enterprise tickets, SLA policies, and agent executions.
            </span>
          </div>
          <button
            onClick={handleResetDemoData}
            disabled={resettingData}
            className="px-3.5 py-1.5 rounded-xl bg-[#162032] hover:bg-[#1d2a45] text-cyan-300 font-semibold border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resettingData ? 'animate-spin' : ''}`} />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
