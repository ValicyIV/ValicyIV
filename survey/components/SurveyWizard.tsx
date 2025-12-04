import React, { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import clsx from 'clsx';
import { z } from 'zod';
import { logEvent } from '../lib/logger';

const totalSteps = 5;
const adoptionStatuses = ['Yes', 'No', 'Needs support'] as const;
type AdoptionStatus = (typeof adoptionStatuses)[number];

const departments = ['Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Sales', 'People'];
const locations = ['Remote', 'Hybrid', 'On-site'];
const tenures = ['< 1 year', '1-3 years', '3-5 years', '5+ years'];

const likertQuestions = [
  {
    id: 'trust',
    title: 'Trust in data quality',
    helper: 'How confident are you that our datasets can responsibly support AI training? (1-5)',
  },
  {
    id: 'efficiency',
    title: 'Workflow lift',
    helper: 'How much time can AI realistically save you each week? (1-5)',
  },
  {
    id: 'safety',
    title: 'Safety posture',
    helper: 'How confident are you in our privacy, security, and compliance guardrails? (1-5)',
  },
  {
    id: 'adoption',
    title: 'Adoption appetite',
    helper: 'How ready is your team to pilot AI-driven workflows this quarter? (1-5)',
  },
  {
    id: 'impact',
    title: 'Impact clarity',
    helper: 'How clear are you on the business outcomes this AI program should drive? (1-5)',
  },
];

const qualitativeQuestions = [
  {
    id: 'priorityUseCase',
    label: 'Most valuable AI co-pilot moment',
    placeholder: 'Describe a single workflow that would save the most time if co-piloted by AI.',
  },
  {
    id: 'risks',
    label: 'Risks to avoid',
    placeholder: 'Where could AI adoption go wrong for your team? Mention failure modes or edge cases.',
  },
  {
    id: 'training',
    label: 'Enablement request',
    placeholder: 'What training, policies, or guardrails would make you comfortable adopting AI sooner?',
  },
];

const adoptionChecks = [
  {
    id: 'automationReady',
    title: 'Automation-ready workflows',
    helper: 'Data sources are stable, documented, and monitored for drift.',
  },
  {
    id: 'securityAligned',
    title: 'Security alignment',
    helper: 'You know what is safe to share, what to redact, and escalation paths.',
  },
] as const;

const submissionSchema = z.object({
  department: z.string().min(2),
  role: z.string().min(2),
  location: z.string().min(2),
  tenure: z.string().min(2),
  sentiment: z
    .record(z.number().min(1).max(5))
    .refine((val) => Object.keys(val).length >= 3, { message: 'At least 3 sentiment signals required' }),
  adoption: z.object({
    automationReady: z.enum(adoptionStatuses),
    securityAligned: z.enum(adoptionStatuses),
  }),
  qualitative: z.object({
    priorityUseCase: z.string().min(10),
    risks: z.string().min(10),
    training: z.string().min(10),
  }),
  email: z.string().email().optional().or(z.literal('')),
});

type SurveyForm = {
  department: string;
  role: string;
  location: string;
  tenure: string;
  sentiment: Record<string, number>;
  adoption: Record<(typeof adoptionChecks)[number]['id'], AdoptionStatus | ''>;
  qualitative: Record<(typeof qualitativeQuestions)[number]['id'], string>;
  email: string;
};

const initialForm: SurveyForm = {
  department: '',
  role: '',
  location: '',
  tenure: '',
  sentiment: {},
  adoption: {
    automationReady: '',
    securityAligned: '',
  },
  qualitative: {
    priorityUseCase: '',
    risks: '',
    training: '',
  },
  email: '',
};

const partialValidators: Record<number, (data: SurveyForm) => boolean> = {
  0: (data) => data.department.length > 0 && data.role.length > 1 && data.location.length > 0 && data.tenure.length > 0,
  1: (data) => Object.keys(data.sentiment).length >= 3,
  2: (data) => adoptionChecks.every((check) => data.adoption[check.id]?.length > 0),
  3: (data) =>
    qualitativeQuestions.every((q) => data.qualitative[q.id as keyof SurveyForm['qualitative']]?.length >= 10) &&
    (!data.email || z.string().email().safeParse(data.email).success),
};

const badge = (label: string) => (
  <span className="inline-flex items-center rounded-full bg-emerald-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-400/30">
    {label}
  </span>
);

const StepShell: React.FC<{ title: string; helper: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  helper,
  icon,
  children,
}) => (
  <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-black/70 p-6 shadow-[0_0_50px_-20px_rgba(16,185,129,0.8)]">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-teal-900/20" />
    <div className="relative flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-500/50">
        {icon}
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-emerald-100/70">{helper}</p>
      </div>
    </div>
    <div className="relative mt-6 space-y-4">{children}</div>
  </div>
);

const LikertScale: React.FC<{
  question: (typeof likertQuestions)[number];
  value: number | undefined;
  onChange: (value: number) => void;
}> = ({ question, value, onChange }) => (
  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-900/20 p-4">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-white">{question.title}</p>
        <p className="text-xs text-emerald-100/70">{question.helper}</p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition',
              value === score
                ? 'border-emerald-400 bg-emerald-500 text-black shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                : 'border-emerald-500/30 bg-black/30 text-emerald-100 hover:border-emerald-400/60 hover:text-white',
            )}
            aria-label={`${question.title} score ${score}`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export function SurveyWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SurveyForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const progress = useMemo(() => ((step + 1) / totalSteps) * 100, [step]);

  const summary = useMemo(() => {
    const scores = Object.values(form.sentiment);
    const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const alignment = average >= 4 ? 'High alignment' : average >= 3 ? 'Moderate alignment' : 'Low alignment';
    return { average: average.toFixed(1), alignment };
  }, [form.sentiment]);

  const updateField = <K extends keyof SurveyForm>(key: K, value: SurveyForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    const validator = partialValidators[step];
    if (validator && !validator(form)) {
      setServerError('Please complete the required inputs before continuing.');
      return;
    }
    setServerError(null);
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setServerError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    const validation = submissionSchema.safeParse(form);
    if (!validation.success) {
      setServerError('Some answers are incomplete or invalid.');
      return;
    }

    setSubmitting(true);
    setServerError(null);
    setServerMessage(null);

    const payload = {
      respondent: {
        department: form.department,
        role: form.role,
        location: form.location,
        tenure: form.tenure,
        email: form.email || undefined,
      },
      sentimentScores: likertQuestions.map((q) => ({
        id: q.id,
        question: q.title,
        score: form.sentiment[q.id] ?? 0,
      })),
      adoption: form.adoption,
      qualitative: qualitativeQuestions.map((q) => ({
        id: q.id,
        response: form.qualitative[q.id as keyof SurveyForm['qualitative']],
      })),
      summary: {
        avg: summary.average,
        text: summary.alignment,
      },
      capturedAt: new Date().toISOString(),
    };

    try {
      logEvent('submit:client', payload.summary);
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Submission failed');
      }

      setServerMessage('Submission complete. Thanks for strengthening the AI roadmap!');
      setServerError(null);
      setStep(totalSteps - 1);
      logEvent('submit:success', { alignment: summary.alignment });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setServerError(message);
      logEvent('submit:error', { message });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setStep(0);
    setServerError(null);
    setServerMessage(null);
  };

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-black via-slate-950 to-emerald-950 px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.15),transparent_25%)]" />
      <div className="relative mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-emerald-500/30 bg-black/60 p-6 shadow-[0_0_60px_-25px_rgba(52,211,153,0.8)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-200">{badge('AI Initiative Healthcheck')}</div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Employee AI Confidence Pulse</h1>
              <p className="text-sm text-emerald-100/70">
                Calibrate readiness, surface risks, and prioritize the next wave of AI co-pilot experiments.
              </p>
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-emerald-500/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        {serverError && (
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-100">{serverError}</div>
        )}
        {serverMessage && (
          <div className="rounded-2xl border border-emerald-400/50 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            {serverMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {step === 0 && (
              <StepShell
                title="Profile & context"
                helper="So we can tailor recommendations by discipline and location."
                icon={<ClipboardList className="h-6 w-6" />}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-emerald-100">Department</label>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => updateField('department', dept)}
                          className={clsx(
                            'rounded-full border px-4 py-2 text-sm font-semibold transition',
                            form.department === dept
                              ? 'border-emerald-400 bg-emerald-500 text-black'
                              : 'border-emerald-500/30 bg-emerald-900/30 text-emerald-100 hover:border-emerald-400',
                          )}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-emerald-100">Location</label>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => updateField('location', loc)}
                          className={clsx(
                            'rounded-full border px-4 py-2 text-sm font-semibold transition',
                            form.location === loc
                              ? 'border-emerald-400 bg-emerald-500 text-black'
                              : 'border-emerald-500/30 bg-emerald-900/30 text-emerald-100 hover:border-emerald-400',
                          )}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-emerald-100">Role</label>
                    <input
                      className="w-full rounded-xl border border-emerald-500/30 bg-black/40 px-3 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      placeholder="e.g. Staff Engineer"
                      value={form.role}
                      onChange={(e) => updateField('role', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-emerald-100">Tenure</label>
                    <div className="flex flex-wrap gap-2">
                      {tenures.map((tenure) => (
                        <button
                          key={tenure}
                          type="button"
                          onClick={() => updateField('tenure', tenure)}
                          className={clsx(
                            'rounded-full border px-4 py-2 text-sm font-semibold transition',
                            form.tenure === tenure
                              ? 'border-emerald-400 bg-emerald-500 text-black'
                              : 'border-emerald-500/30 bg-emerald-900/30 text-emerald-100 hover:border-emerald-400',
                          )}
                        >
                          {tenure}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </StepShell>
            )}

            {step === 1 && (
              <StepShell
                title="Confidence signals"
                helper="Rate how prepared we are for responsible AI rollouts."
                icon={<ShieldCheck className="h-6 w-6" />}
              >
                <div className="space-y-3">
                  {likertQuestions.map((question) => (
                    <LikertScale
                      key={question.id}
                      question={question}
                      value={form.sentiment[question.id]}
                      onChange={(score) =>
                        updateField('sentiment', { ...form.sentiment, [question.id]: score })
                      }
                    />
                  ))}
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                title="Risk & readiness checks"
                helper="Quick checkpoints to understand where support is needed."
                icon={<Activity className="h-6 w-6" />}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {adoptionChecks.map((check) => (
                    <div key={check.id} className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-900/20 p-4">
                      <div className="flex items-center gap-2 text-emerald-100">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="text-sm font-semibold">{check.title}</p>
                      </div>
                      <p className="text-xs text-emerald-100/70">{check.helper}</p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {adoptionStatuses.map((label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() =>
                              updateField('adoption', {
                                ...form.adoption,
                                [check.id]: label,
                              })
                            }
                            className={clsx(
                              'rounded-xl border px-3 py-2 text-xs font-semibold transition',
                              form.adoption[check.id] === label
                                ? 'border-emerald-400 bg-emerald-500 text-black'
                                : 'border-emerald-500/30 bg-emerald-900/30 text-emerald-100 hover:border-emerald-400',
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                title="Narrative feedback"
                helper="Your perspective helps us design safer, more useful copilots."
                icon={<TrendingUp className="h-6 w-6" />}
              >
                <div className="space-y-4">
                  {qualitativeQuestions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-white">{question.label}</label>
                        <span className="text-xs text-emerald-100/60">10+ words</span>
                      </div>
                      <textarea
                        className="min-h-[110px] w-full rounded-xl border border-emerald-500/30 bg-black/40 px-3 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        placeholder={question.placeholder}
                        value={form.qualitative[question.id as keyof SurveyForm['qualitative']]}
                        onChange={(e) =>
                          updateField('qualitative', {
                            ...form.qualitative,
                            [question.id]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-sm text-emerald-100">Email for follow-up (optional)</label>
                    <input
                      className="w-full rounded-xl border border-emerald-500/30 bg-black/40 px-3 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </div>
                </div>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell
                title="Thanks for your perspective"
                helper="Your input will be compiled, analyzed, and visualized on the internal dashboard."
                icon={<CheckCircle2 className="h-6 w-6" />}
              >
                <div className="space-y-4">
                  <p className="text-sm text-emerald-100/80">
                    We have logged your signals and qualitative notes. Program owners will review them alongside other
                    respondents to prioritize enablement, safeguards, and pilot candidates. No individual scorecards are
                    shown here; updates will be shared via the admin/shareholder dashboard.
                  </p>
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/30 p-4 text-sm text-emerald-100">
                    <p className="font-semibold text-white">What happens next</p>
                    <ul className="mt-2 space-y-2 list-disc pl-4 text-emerald-100/80">
                      <li>Insights roll into the dashboard for trend analysis by department and tenure.</li>
                      <li>Risk themes inform our policy, review steps, and guardrail backlog.</li>
                      <li>We will follow up with enablement resources based on the gaps you flagged.</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={reset}
                      className="flex items-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-300"
                    >
                      <ChevronLeft className="h-4 w-4" /> Submit another response
                    </button>
                  </div>
                </div>
              </StepShell>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-emerald-500/30 bg-black/60 p-5 text-sm text-emerald-100/80">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <p className="font-semibold">What to expect</p>
              </div>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Scores stay client-side; we only send aggregated insights to the admin dashboard.</li>
                <li>We use your role and tenure to tailor enablement priorities - never to rate individuals.</li>
                <li>Do not paste secrets or customer data. Keep examples high level.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-black to-teal-500/10 p-5 text-sm text-emerald-100/80">
              <div className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <p className="font-semibold">Signals we aggregate</p>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>Confidence patterns</span>
                  <span className="font-semibold text-white">Readiness, clarity, safety</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Top blockers</span>
                  <span className="font-semibold text-white">Data quality, guardrails, oversight</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enablement needs</span>
                  <span className="font-semibold text-white">Training, policy clarity, success metrics</span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-900/10 p-4 text-xs text-emerald-100/70">
              Submissions timestamped: {new Date().toLocaleString()}
            </div>
          </aside>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-emerald-500/20 pt-4 text-sm">
          <div className="flex items-center gap-2 text-emerald-100/70">
            <ChevronRight className="h-4 w-4" />
            <span>Step {step + 1} of {totalSteps}</span>
          </div>
          <div className="flex gap-2">
            {step > 0 && step < totalSteps - 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300"
              >
                Back
              </button>
            )}
            {step < totalSteps - 2 && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_40px_-20px_rgba(52,211,153,0.9)] transition hover:shadow-[0_10px_40px_-15px_rgba(52,211,153,1)]"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            {step === totalSteps - 2 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_40px_-20px_rgba(52,211,153,0.9)] transition hover:shadow-[0_10px_40px_-15px_rgba(52,211,153,1)] disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send responses'}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            {step === totalSteps - 1 && (
              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300"
              >
                Start over
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SurveyWizard;
