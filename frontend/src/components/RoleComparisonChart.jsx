import React from 'react';
import { Target, Compass } from 'lucide-react';

const RoleComparisonChart = ({ bestScores = {} }) => {
  const roles = Object.entries(bestScores);

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400';
    if (score >= 60) return 'from-amber-500 to-orange-400';
    return 'from-rose-500 to-red-400';
  };

  const getBadgeClass = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Target Role Comparison</h3>
          <p className="text-xs text-slate-400">Your highest resume scores across targeting profiles</p>
        </div>
      </div>

      {roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-sm gap-2">
          <Compass className="w-8 h-8 opacity-40 animate-pulse" />
          <span>No job roles scored yet.</span>
          <p className="text-xs text-slate-600 text-center max-w-[250px]">
            Go to the Resume Scoring page and run an analysis to see your target stats here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {roles.map(([role, score]) => {
            const gradientColor = getScoreColor(score);
            const badgeClass = getBadgeClass(score);

            return (
              <div key={role} className="group space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-300 group-hover:text-white transition-all">
                    {role}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}`}>
                    {score}%
                  </span>
                </div>

                {/* Outer Progress Bar */}
                <div className="h-2 w-full bg-slate-950/80 border border-slate-800/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${gradientColor} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoleComparisonChart;
