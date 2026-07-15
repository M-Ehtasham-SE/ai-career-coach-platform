import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Award,
  Briefcase
} from 'lucide-react';

const ScoreDisplay = ({ scoreData }) => {
  if (!scoreData) return null;

  const { overallScore, strengths, weaknesses, suggestions, jobRole } = scoreData;

  // Parse JSON strings back to arrays if necessary
  const parseList = (data) => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      return [];
    }
  };

  const parsedStrengths = parseList(strengths);
  const parsedWeaknesses = parseList(weaknesses);
  const parsedSuggestions = parseList(suggestions);

  // Determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-400';
    if (score >= 60) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  const scoreColor = getScoreColor(overallScore);
  const scoreBg = getScoreBg(overallScore);

  // Calculate SVG circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-fadeIn">
      
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        {/* Radial Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              className="text-slate-800 stroke-current"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
            />
            {/* Progress circle */}
            <circle
              className={`${scoreColor} transition-all duration-1000 ease-out`}
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold ${scoreColor.split(' ')[0]}`}>
              {overallScore}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
              Score
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className={`w-6 h-6 ${scoreColor.split(' ')[0]}`} />
            <h2 className="text-2xl font-bold">AI Resume Evaluation</h2>
          </div>
          <p className="text-slate-400">
            Based on an analysis for the role of <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded-md">{jobRole}</span>.
          </p>
        </div>
      </div>

      {/* Grid for Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Strengths */}
        <div className="bg-slate-950/50 border border-emerald-500/20 rounded-xl p-5">
          <h3 className="font-bold text-emerald-400 flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5" />
            Top Strengths
          </h3>
          <ul className="space-y-3">
            {parsedStrengths.length > 0 ? parsedStrengths.map((item, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            )) : <li className="text-sm text-slate-500">No specific strengths identified.</li>}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-slate-950/50 border border-rose-500/20 rounded-xl p-5">
          <h3 className="font-bold text-rose-400 flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5" />
            Areas to Improve
          </h3>
          <ul className="space-y-3">
            {parsedWeaknesses.length > 0 ? parsedWeaknesses.map((item, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            )) : <li className="text-sm text-slate-500">No specific weaknesses identified.</li>}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="bg-slate-950/50 border border-amber-500/20 rounded-xl p-5">
          <h3 className="font-bold text-amber-400 flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5" />
            Actionable Suggestions
          </h3>
          <ul className="space-y-3">
            {parsedSuggestions.length > 0 ? parsedSuggestions.map((item, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            )) : <li className="text-sm text-slate-500">No suggestions available.</li>}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default ScoreDisplay;
