import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../services/interviewService';
import {
  ArrowLeft,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Loader,
  CheckCircle2,
  AlertCircle,
  Send,
  Trophy,
  BarChart2,
  Zap,
  Target,
  Clock,
  RefreshCw,
  Star,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_ROLES = [
  { label: 'Software Engineer',    icon: '💻' },
  { label: 'Frontend Developer',   icon: '🎨' },
  { label: 'Backend Developer',    icon: '⚙️' },
  { label: 'Full Stack Developer', icon: '🔧' },
  { label: 'Data Scientist',       icon: '📊' },
  { label: 'DevOps Engineer',      icon: '🚀' },
  { label: 'UI/UX Designer',       icon: '✏️' },
  { label: 'Product Manager',      icon: '📋' },
];

const DIFFICULTIES = [
  {
    value: 'EASY',
    label: 'Easy',
    description: 'Foundational concepts & definitions',
    color: 'emerald',
    icon: '🌱',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    description: 'Applied knowledge & problem-solving',
    color: 'amber',
    icon: '⚡',
  },
  {
    value: 'HARD',
    label: 'Hard',
    description: 'Deep expertise & architecture decisions',
    color: 'rose',
    icon: '🔥',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

const getScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-400';
};

const getScoreGradient = (score) => {
  if (score >= 80) return 'from-emerald-500 to-teal-400';
  if (score >= 60) return 'from-amber-500 to-orange-400';
  return 'from-rose-500 to-red-400';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
};

const getAnswerScoreColor = (score) => {
  if (score >= 8) return 'text-emerald-400';
  if (score >= 6) return 'text-amber-400';
  return 'text-rose-400';
};

// ─── Step Components ──────────────────────────────────────────────────────────

const SetupStep = ({ onStart }) => {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedDifficulty, setSelectedDifficulty] = useState('MEDIUM');
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setStarting(true);
    setError('');
    try {
      const response = await interviewService.startSession(selectedRole, selectedDifficulty);
      if (response?.status === 'success') {
        onStart(response.data);
      } else {
        setError('Failed to start session. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Role Selection */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          Step 1 — Choose Your Target Role
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {JOB_ROLES.map((role) => (
            <button
              key={role.label}
              id={`role-btn-${role.label.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedRole(role.label)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all text-xs font-semibold ${
                selectedRole === role.label
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-2xl">{role.icon}</span>
              <span className="leading-tight">{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Step 2 — Select Difficulty
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.value}
              id={`difficulty-btn-${diff.value.toLowerCase()}`}
              onClick={() => setSelectedDifficulty(diff.value)}
              className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all ${
                selectedDifficulty === diff.value
                  ? `border-${diff.color}-500/40 bg-${diff.color}-500/10 text-${diff.color}-300`
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl">{diff.icon}</span>
              <div>
                <p className="font-bold text-sm text-white">{diff.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{diff.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Session Preview + Start */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="text-slate-400 space-y-1">
            <p>Role: <span className="text-white font-semibold">{selectedRole}</span></p>
            <p>Difficulty: <span className="text-white font-semibold">{selectedDifficulty}</span></p>
            <p className="text-slate-500 text-xs mt-2">5 AI-generated questions will be provided</p>
          </div>
          <div className="text-4xl">
            {JOB_ROLES.find(r => r.label === selectedRole)?.icon}
          </div>
        </div>
        <button
          id="start-interview-btn"
          onClick={handleStart}
          disabled={starting}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          {starting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating questions with AI…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Start Interview Session</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Question Step ─────────────────────────────────────────────────────────────

const QuestionStep = ({ session, onComplete }) => {
  const totalQuestions = session.answers?.length || 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedFeedback, setSubmittedFeedback] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState('');

  const currentQuestion = session.answers?.[currentIndex];
  const allAnswered = Object.keys(submittedFeedback).length === totalQuestions;

  const handleSubmitAnswer = async () => {
    const text = answers[currentIndex] || '';
    if (!text.trim()) {
      setError('Please write an answer before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await interviewService.submitAnswer(
        session.id,
        currentQuestion.questionIndex,
        text.trim()
      );

      if (response?.status === 'success') {
        setSubmittedFeedback(prev => ({
          ...prev,
          [currentIndex]: response.data,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    setFinalizing(true);
    setError('');
    try {
      const response = await interviewService.finalizeSession(session.id);
      if (response?.status === 'success') {
        onComplete(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finalize session.');
    } finally {
      setFinalizing(false);
    }
  };

  const feedback = submittedFeedback[currentIndex];
  const isAnswered = !!feedback;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-300">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-700 bg-slate-800 text-slate-400">
              {session.jobRole}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              {session.difficulty}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {Object.keys(submittedFeedback).length}/{totalQuestions} answered
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Nav Pills */}
        <div className="flex gap-2 mt-4">
          {session.answers?.map((_, idx) => (
            <button
              key={idx}
              id={`question-nav-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${
                idx === currentIndex
                  ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                  : submittedFeedback[idx]
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 bg-slate-800 text-slate-500 hover:border-slate-600'
              }`}
            >
              {submittedFeedback[idx] ? '✓' : idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
            <MessageSquare className="w-4 h-4" />
          </div>
          <p className="text-white font-medium leading-relaxed text-base">
            {currentQuestion?.question}
          </p>
        </div>

        {/* Answer textarea */}
        <textarea
          id={`answer-textarea-${currentIndex}`}
          value={answers[currentIndex] || ''}
          onChange={(e) => setAnswers(prev => ({ ...prev, [currentIndex]: e.target.value }))}
          disabled={isAnswered}
          placeholder="Type your answer here — be specific and detailed…"
          rows={6}
          className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors resize-none ${
            isAnswered
              ? 'border-slate-700 opacity-70 cursor-not-allowed'
              : 'border-slate-700 focus:border-indigo-500'
          }`}
        />

        {/* Error */}
        {error && (
          <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        {!isAnswered && (
          <button
            id={`submit-answer-btn-${currentIndex}`}
            onClick={handleSubmitAnswer}
            disabled={submitting || !answers[currentIndex]?.trim()}
            className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:pointer-events-none"
          >
            {submitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>AI is evaluating your answer…</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Answer</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* AI Feedback Panel */}
      {isAnswered && feedback && (
        <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white">AI Feedback</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Score</span>
              <span className={`text-2xl font-extrabold ${getAnswerScoreColor(feedback.score)}`}>
                {feedback.score}<span className="text-sm font-normal text-slate-500">/10</span>
              </span>
            </div>
          </div>

          {/* Score bar */}
          <div className="mb-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getScoreGradient(feedback.score * 10)} rounded-full transition-all duration-1000`}
              style={{ width: `${(feedback.score / 10) * 100}%` }}
            />
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{feedback.aiFeedback}</p>

          {/* Navigate to next */}
          {currentIndex < totalQuestions - 1 && (
            <button
              id={`next-question-btn-${currentIndex}`}
              onClick={() => { setCurrentIndex(currentIndex + 1); setError(''); }}
              className="mt-5 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Finalize button (shown when all answered) */}
      {allAnswered && (
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">All Questions Answered!</h3>
          <p className="text-slate-400 text-sm mb-5">
            You've answered all {totalQuestions} questions. Ready to see your results?
          </p>
          <button
            id="finalize-session-btn"
            onClick={handleFinalize}
            disabled={finalizing}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center gap-2 mx-auto text-sm disabled:opacity-50"
          >
            {finalizing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Calculating results…</span>
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4" />
                <span>View My Results</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Results Step ──────────────────────────────────────────────────────────────

const ResultsStep = ({ session, onRestart }) => {
  const score = session.overallScore ?? 0;
  const answers = session.answers || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreGradient(score)} opacity-20 blur-xl`} />
          <div className={`w-32 h-32 rounded-full border-4 ${score >= 80 ? 'border-emerald-500/50' : score >= 60 ? 'border-amber-500/50' : 'border-rose-500/50'} flex items-center justify-center bg-slate-950 relative`}>
            <div>
              <span className={`text-4xl font-extrabold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-slate-500 text-sm block text-center">/100</span>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <span className={`text-2xl font-extrabold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>
        <p className="text-slate-400 text-sm">
          Your overall interview performance score for <span className="text-white font-semibold">{session.jobRole}</span>
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-center gap-6 mt-5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>{session.jobRole}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>{session.difficulty}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{answers.length} questions</span>
          </div>
        </div>

        {/* Score progress bar */}
        <div className="mt-6 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getScoreGradient(score)} rounded-full transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
          <BarChart2 className="w-4 h-4" />
          Question-by-Question Breakdown
        </h3>
        <div className="space-y-4">
          {answers.map((answer, idx) => (
            <div key={answer.id || idx} className="border border-slate-800 rounded-xl p-4 bg-slate-950/40">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed">{answer.question}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-xl font-extrabold ${getAnswerScoreColor(answer.score ?? 0)}`}>
                    {answer.score ?? '—'}
                  </span>
                  <span className="text-slate-600 text-xs">/10</span>
                </div>
              </div>

              {/* Answer score bar */}
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden ml-9 mb-3" style={{ width: 'calc(100% - 2.25rem)' }}>
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient((answer.score ?? 0) * 10)} rounded-full transition-all duration-700`}
                  style={{ width: `${((answer.score ?? 0) / 10) * 100}%` }}
                />
              </div>

              {/* AI Feedback */}
              {answer.aiFeedback && (
                <p className="text-xs text-slate-500 ml-9 leading-relaxed italic">
                  "{answer.aiFeedback}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          id="restart-interview-btn"
          onClick={onRestart}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Another Session
        </button>
        <button
          id="view-history-from-results"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Star className="w-4 h-4" />
          Session Complete
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const STEPS = ['setup', 'questions', 'results'];

const InterviewPracticePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup');
  const [session, setSession] = useState(null);

  const handleSessionStarted = (sessionData) => {
    setSession(sessionData);
    setStep('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSessionComplete = (finalizedSession) => {
    setSession(finalizedSession);
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setSession(null);
    setStep('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Navigation */}
        <div className="flex items-center justify-between mb-10">
          <button
            id="back-to-dashboard-btn"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800/80 transition-all text-slate-300 hover:text-white text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI Career Coach
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Interview Practice
            </h1>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed ml-[52px]">
            Simulate a real job interview. Get AI-generated questions, submit your answers, and receive instant, personalized feedback.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['Setup', 'Questions', 'Results'].map((label, idx) => (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                idx === stepIndex
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : idx < stepIndex
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-slate-900/40 border border-slate-800 text-slate-600'
              }`}>
                {idx < stepIndex ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-4 h-4 text-center">{idx + 1}</span>}
                {label}
              </div>
              {idx < 2 && <ChevronRight className="w-3.5 h-3.5 text-slate-700" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {step === 'setup' && (
          <SetupStep onStart={handleSessionStarted} />
        )}
        {step === 'questions' && session && (
          <QuestionStep session={session} onComplete={handleSessionComplete} />
        )}
        {step === 'results' && session && (
          <ResultsStep session={session} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export default InterviewPracticePage;
