import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import progressService from '../services/progressService';
import RoleComparisonChart from '../components/RoleComparisonChart';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Award,
  FileText,
  MessageSquare,
  Target,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  Loader,
  Clock,
  Zap,
  ChevronRight,
  RefreshCw,
  Trophy,
} from 'lucide-react';

// ── Helper Functions ─────────────────────────────────────────────────────────

const getReadinessColor = (score) => {
  if (score == null) return 'text-slate-500';
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-400';
};

const getReadinessGradient = (score) => {
  if (score == null) return 'from-slate-700 to-slate-800';
  if (score >= 80) return 'from-emerald-500 via-teal-500 to-cyan-500';
  if (score >= 60) return 'from-amber-500 via-orange-500 to-yellow-500';
  return 'from-rose-500 via-red-500 to-pink-500';
};

const getReadinessLabel = (score) => {
  if (score == null) return 'No Data Yet';
  if (score >= 85) return 'Interview Ready';
  if (score >= 70) return 'Highly Competitive';
  if (score >= 50) return 'Developing Competency';
  return 'Needs Targeted Improvement';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ProgressDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await progressService.getProgressStats();
      if (response?.status === 'success') {
        setStats(response.data);
      } else {
        setError('Failed to load progress statistics.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const readinessIndex = stats?.careerReadinessIndex;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/15 blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Career Progress Analytics
            </h1>
          </div>
          <p className="text-slate-400 text-sm ml-[52px]">
            Comprehensive insights across your resume evaluations, job role targeting, and interview practice performance.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader className="w-10 h-10 text-indigo-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading your career analytics…</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between text-rose-400 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* Content View */}
        {!loading && !error && stats && (
          <div className="space-y-8">

            {/* Hero — Career Readiness Ring + Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Career Readiness Hero Card */}
              <div className="md:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Trophy className="w-5 h-5 text-indigo-400/40" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                  Career Readiness Index
                </h3>

                {/* Score Ring */}
                <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getReadinessGradient(readinessIndex)} opacity-20 blur-xl`} />
                  <div className={`w-36 h-36 rounded-full border-4 ${readinessIndex >= 80 ? 'border-emerald-500/40' : readinessIndex >= 60 ? 'border-amber-500/40' : readinessIndex != null ? 'border-rose-500/40' : 'border-slate-800'} flex items-center justify-center bg-slate-950 relative`}>
                    <div>
                      <span className={`text-4xl font-extrabold ${getReadinessColor(readinessIndex)}`}>
                        {readinessIndex != null ? readinessIndex : '—'}
                      </span>
                      <span className="text-slate-500 text-xs block text-center">/100</span>
                    </div>
                  </div>
                </div>

                <span className={`text-sm font-bold ${getReadinessColor(readinessIndex)}`}>
                  {getReadinessLabel(readinessIndex)}
                </span>
                <p className="text-[11px] text-slate-500 mt-2 max-w-[200px]">
                  Weighted index combining 60% resume quality & 40% interview readiness
                </p>
              </div>

              {/* 4 KPI Cards Grid */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">

                {/* Total Resumes */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">Total Resumes</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-white">{stats.totalResumes}</span>
                    <span className="text-xs text-slate-500 block mt-1">Uploaded & processed</span>
                  </div>
                </div>

                {/* Resume Evaluations */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">Evaluations Run</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-white">{stats.totalScores}</span>
                    <span className="text-xs text-slate-500 block mt-1">AI score reports generated</span>
                  </div>
                </div>

                {/* Best Resume Score */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">Best Resume Score</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-indigo-400">
                      {stats.bestResumeScore != null ? stats.bestResumeScore : '—'}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">Highest score achieved</span>
                  </div>
                </div>

                {/* Best Interview Score */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">Best Interview Score</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-purple-400">
                      {stats.bestInterviewScore != null ? stats.bestInterviewScore : '—'}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">
                      {stats.completedInterviews} completed sessions
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Role Performance Chart */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Target Role Performance
              </h3>
              <RoleComparisonChart roleScores={stats.bestScoresByRole || {}} />
            </div>

            {/* Two Column Layout — Score Trend + Interview History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Resume Score Trend */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-400" />
                    Recent Resume Scores
                  </h3>

                  {stats.recentScores?.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentScores.map((score, idx) => (
                        <div key={idx} className="border border-slate-800/80 rounded-xl p-3.5 bg-slate-950/40">
                          <div className="flex items-center justify-between mb-2 text-xs">
                            <span className="font-semibold text-white">{score.jobRole || 'General Resume'}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">{formatDate(score.scoredAt)}</span>
                              <span className="font-extrabold text-indigo-400 text-sm">{score.overallScore}/100</span>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                              style={{ width: `${score.overallScore}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-slate-500 text-xs">
                      No resume scores recorded yet. Upload a resume to get started!
                    </div>
                  )}
                </div>

                <Link
                  to="/upload"
                  className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-3 border-t border-slate-800 transition-colors"
                >
                  Upload New Resume <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Interview Session History */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    Recent Interview Sessions
                  </h3>

                  {stats.recentInterviews?.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentInterviews.map((session, idx) => (
                        <div key={idx} className="border border-slate-800/80 rounded-xl p-3.5 bg-slate-950/40 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white text-xs">{session.jobRole}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-500/30 bg-purple-500/10 text-purple-300">
                                {session.difficulty}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {session.answeredQuestions}/{session.totalQuestions} answered • {formatDate(session.createdAt)}
                            </span>
                          </div>

                          <div className="text-right">
                            {session.finalized ? (
                              <div>
                                <span className="text-base font-extrabold text-purple-400 block">
                                  {session.overallScore ?? 0}<span className="text-xs text-slate-500">/100</span>
                                </span>
                                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Finalized
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg inline-block">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-slate-500 text-xs">
                      No interview practice sessions recorded yet. Start a session!
                    </div>
                  )}
                </div>

                <Link
                  to="/interview"
                  className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 pt-3 border-t border-slate-800 transition-colors"
                >
                  Start Practice Interview <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboardPage;
