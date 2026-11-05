import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building,
  User,
  Sliders,
  LifeBuoy,
  FileText,
  BarChart3,
  Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { userProfile, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);

  // Form states
  const [fullName, setFullName] = useState(userProfile?.fullName || 'Alex Vance');
  const [role, setRole] = useState('Operations Director');
  const [companyName, setCompanyName] = useState(userProfile?.companyName || 'Acme Global Operations');
  const [industry, setIndustry] = useState('Enterprise SaaS & Logistics');
  const [companySize, setCompanySize] = useState('250-1000 employees');
  const [selectedPreference, setSelectedPreference] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    'Operations Director',
    'Customer Support Lead',
    'Customer Success Manager',
    'VP of Operations',
    'Product Operations Manager',
    'Business Owner / Executive',
  ];

  const industries = [
    'Enterprise SaaS & Logistics',
    'FinTech & Banking',
    'E-Commerce & Retail',
    'Healthcare & HealthTech',
    'Cloud & Infrastructure',
    'Other Business Services',
  ];

  const companySizes = [
    '1-25 employees',
    '26-100 employees',
    '101-500 employees',
    '500+ employees',
  ];

  const preferences = [
    {
      id: 'support',
      title: 'Customer Support Automation',
      desc: 'Autonomous ticket triage, sentiment scoring, and human-in-the-loop response generation.',
      icon: LifeBuoy,
    },
    {
      id: 'docs',
      title: 'Document Intelligence & RAG',
      desc: 'Semantic retrieval across enterprise contracts, SLA manuals, and product documentation.',
      icon: FileText,
    },
    {
      id: 'analytics',
      title: 'Predictive Business Analytics',
      desc: 'Operational bottleneck clustering, recurring defect patterns, and executive briefs.',
      icon: BarChart3,
    },
    {
      id: 'all',
      title: 'Complete Enterprise Suite (Recommended)',
      desc: 'Full orchestration with all 5 specialized AI agents and autonomous mesh routing.',
      icon: Sparkles,
    },
  ];

  const handleFinish = async () => {
    try {
      setSubmitting(true);
      await completeOnboarding({
        companyName,
        industry,
        companySize,
        role,
      });
      onComplete();
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-xl z-10">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30 ring-2 ring-violet-400'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#151d2e] text-slate-500 border border-[#1e293b]'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 5 && (
                <div
                  className={`w-10 sm:w-16 h-0.5 mx-1 transition-all ${
                    step > s ? 'bg-emerald-500' : 'bg-[#1e293b]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card Body */}
        <div className="bg-[#111827] border border-[#1e293b] rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-violet-500/25 mx-auto mb-6 flex items-center justify-center">
                <div className="w-full h-full bg-[#080b14] rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Welcome to OpsMind AI</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-8">
                Your intelligent copilot to automate customer support workflows, ground answers in company documents, and orchestrate specialized AI agents.
              </p>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-violet-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: USER PROFILE */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Set Up Your Profile</h2>
                <p className="text-xs text-slate-400">Tell us about your operational role.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0b0f19] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Job Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0b0f19] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORGANIZATION */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Company Details</h2>
                <p className="text-xs text-slate-400">Configure your primary organization workspace.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#0b0f19] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-[#0b0f19] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full bg-[#0b0f19] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-[#1e293b] focus:border-violet-500 outline-none"
                  >
                    {companySizes.map((cs) => (
                      <option key={cs} value={cs}>
                        {cs}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERENCES */}
          {step === 4 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Operational Focus</h2>
                <p className="text-xs text-slate-400">Which capability should we prioritize in your workspace?</p>
              </div>

              <div className="space-y-3">
                {preferences.map((pref) => {
                  const Icon = pref.icon;
                  const isSelected = selectedPreference === pref.id;

                  return (
                    <div
                      key={pref.id}
                      onClick={() => setSelectedPreference(pref.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-violet-950/30 border-violet-500 ring-1 ring-violet-500/50'
                          : 'bg-[#0b0f19] border-[#1e293b] hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-violet-600 text-white' : 'bg-[#151d2e] text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-100">{pref.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {pref.desc}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                          isSelected ? 'border-cyan-400 bg-cyan-400 text-[#080b14]' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUMMARY & LAUNCH */}
          {step === 5 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Workspace Ready</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
                We have configured your cloud workspace for <span className="text-slate-200 font-semibold">{companyName}</span> with all 5 specialized AI agents initialized.
              </p>

              <div className="p-4 rounded-2xl bg-[#0b0f19] border border-[#1e293b] text-left text-xs space-y-2 mb-8 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lead Operator:</span>
                  <span className="font-semibold text-slate-200">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-semibold text-slate-200">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Organization:</span>
                  <span className="font-semibold text-slate-200">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Industry:</span>
                  <span className="font-semibold text-slate-200">{industry}</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                disabled={submitting}
                className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-xl shadow-violet-500/25 transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Initializing Workspace...' : 'Launch Operations Copilot &rarr;'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
