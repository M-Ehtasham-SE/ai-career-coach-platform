import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import resumeService from '../services/resumeService';
import scoreService from '../services/scoreService';
import ScoreDisplay from '../components/ScoreDisplay';
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Award,
  Loader,
  ChevronDown,
  History,
  Clock,
  Zap,
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

// ─── Curated Job Roles ────────────────────────────────────────────────────────
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

// ─── Helper: score colour ─────────────────────────────────────────────────────
const getScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-400';
};
const getScoreBadgeBg = (score) => {
  if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  if (score >= 60) return 'bg-amber-500/10  border-amber-500/30  text-amber-400';
  return                   'bg-rose-500/10   border-rose-500/30   text-rose-400';
};
const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
};

// ─── Component ────────────────────────────────────────────────────────────────
const ResumeScoringPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [useCustomRole, setUseCustomRole] = useState(false);

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [activeScore, setActiveScore] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Load resumes on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const response = await resumeService.getMyResumes();
        if (response?.status === 'success') {
          const list = response.data || [];
          setResumes(list);
          if (list.length > 0) setSelectedResumeId(list[0].id);
        }
      } catch (err) {
        setError('Could not load your resumes. Please go back and try again.');
      } finally {
        setLoadingResumes(false);
      }
    };
    loadResumes();
  }, []);

  // ── Load history whenever selected resume changes ─────────────────────────
  useEffect(() => {
    if (!selectedResumeId) {
      setScoreHistory([]);
      setActiveScore(null);
      return;
    }
    const loadHistory = async () => {
      setLoadingHistory(true);
      setActiveScore(null);
      setScoreHistory([]);
      try {
        const response = await scoreService.getScoresForResume(selectedResumeId);
        if (response?.status === 'success') {
          setScoreHistory(response.data || []);
        }
      } catch {
        // No history yet — that is fine
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, [selectedResumeId]);

  // ── Analyze ───────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      setError('Please select a resume first.');
      return;
    }
    const role = useCustomRole ? customRole.trim() : selectedRole;
    if (!role) {
      setError('Please specify a job role.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setSuccess('');
    setActiveScore(null);

    try {
      const response = await scoreService.scoreResume(selectedResumeId, role);
      if (response?.status === 'success') {
        setActiveScore(response.data);
        setSuccess('Analysis complete!');
        // Prepend to history
        setScoreHistory(prev => [response.data, ...prev]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // ── View a historical score ────────────────────────────────────────────────
  const handleViewHistory = (score) => {
    setActiveScore(score);
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Selected resume helper ─────────────────────────────────────────────────
  const selectedResume = resumes.find(r => r.id === selectedResumeId);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-900/8 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Navigation ──────────────────────────────────────────────────── */}
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

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AI Resume Scoring
            </h1>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed ml-13 pl-[52px]">
            Select a resume, choose your target role, and let the AI evaluate your strengths, weaknesses, and suggest improvements.
          </p>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && !error && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* ── Main Grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Panel: Controls ───────────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Resume Selector */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Step 1 — Resume
              </h2>

              {loadingResumes ? (
                <div className="flex items-center gap-3 py-4 text-slate-500 text-sm">
                  <Loader className="w-4 h-4 animate-spin text-indigo-400" />
                  Loading resumes…
                </div>
              ) : resumes.length === 0 ? (
                <div className="py-6 flex flex-col items-center gap-3 text-center">
                  <FileText className="w-8 h-8 text-slate-700" />
                  <p className="text-sm text-slate-500">No resumes found.</p>
                  <button
                    onClick={() => navigate('/resumes')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Upload one first →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {resumes.map((r) => (
                    <button
                      key={r.id}
                      id={`resume-select-${r.id}`}
                      onClick={() => setSelectedResumeId(r.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        selectedResumeId === r.id
                          ? 'border-indigo-500/40 bg-indigo-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedResumeId === r.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{r.fileName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {r.rawText ? `${r.rawText.length.toLocaleString()} chars` : 'No text extracted'}
                        </p>
                      </div>
                      {selectedResumeId === r.id && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Selector */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Step 2 — Target Role
              </h2>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {JOB_ROLES.map((role) => (
                  <button
                    key={role.label}
                    id={`role-btn-${role.label.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => { setSelectedRole(role.label); setUseCustomRole(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all text-xs font-semibold ${
                      !useCustomRole && selectedRole === role.label
                        ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm">{role.icon}</span>
                    <span className="leading-tight">{role.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom role */}
              <div>
                <button
                  id="custom-role-toggle"
                  onClick={() => setUseCustomRole(!useCustomRole)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all mb-2 ${
                    useCustomRole
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>✏️ Custom Role</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${useCustomRole ? 'rotate-180' : ''}`} />
                </button>
                {useCustomRole && (
                  <input
                    id="custom-role-input"
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. Cloud Architect"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                )}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              id="analyze-btn"
              onClick={handleAnalyze}
              disabled={analyzing || !selectedResumeId || resumes.length === 0}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              {analyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing with AI…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>

            {/* Selected Resume Preview */}
            {selectedResume && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300 truncate">{selectedResume.fileName}</p>
                <p>Role: <span className="text-white font-medium">{useCustomRole ? (customRole || '—') : selectedRole}</span></p>
                {selectedResume.rawText && (
                  <p>Resume length: <span className="text-white font-medium">{selectedResume.rawText.length.toLocaleString()} chars</span></p>
                )}
              </div>
            )}
          </div>

          {/* ── Right Panel: Results ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Analyzing state */}
            {analyzing && (
              <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center animate-fadeIn">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="w-9 h-9 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-ping" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI is analyzing your resume…</h3>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                  Evaluating skills, experience, formatting, and ATS compatibility for the target role.
                </p>
                <div className="mt-6 flex gap-2">
                  {['Parsing content', 'Evaluating skills', 'Generating report'].map((step, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Score result */}
            {!analyzing && activeScore && (
              <ScoreDisplay scoreData={activeScore} />
            )}

            {/* Empty state */}
            {!analyzing && !activeScore && (
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5">
                  <Award className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-400 mb-2">No Analysis Yet</h3>
                <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
                  Select a resume, choose a target role, and click <span className="text-indigo-400 font-medium">Analyze Resume</span> to get your AI-powered evaluation.
                </p>
              </div>
            )}

            {/* Score History */}
            {scoreHistory.length > 0 && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Score History
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] border border-slate-700 font-normal normal-case tracking-normal">
                    {scoreHistory.length} {scoreHistory.length === 1 ? 'entry' : 'entries'}
                  </span>
                </h3>

                <div className="space-y-3">
                  {scoreHistory.map((s, idx) => (
                    <button
                      key={s.id || idx}
                      id={`history-score-${idx}`}
                      onClick={() => handleViewHistory(s)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                        activeScore?.id === s.id
                          ? 'border-indigo-500/30 bg-indigo-500/5'
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      {/* Score ring */}
                      <div className={`text-2xl font-extrabold shrink-0 w-14 text-center ${getScoreColor(s.overallScore)}`}>
                        {s.overallScore}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-slate-200 truncate">{s.jobRole || 'General'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-600 shrink-0" />
                          <span className="text-[11px] text-slate-500">
                            {s.scoredAt
                              ? new Date(s.scoredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                              : 'Unknown date'}
                          </span>
                        </div>
                      </div>

                      <div className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${getScoreBadgeBg(s.overallScore)}`}>
                        {getScoreLabel(s.overallScore)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading history */}
            {loadingHistory && (
              <div className="flex items-center gap-3 text-slate-500 text-sm py-4">
                <Loader className="w-4 h-4 animate-spin text-indigo-400" />
                Loading score history…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScoringPage;
