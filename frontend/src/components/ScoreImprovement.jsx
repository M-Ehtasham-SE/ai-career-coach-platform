import React, { useEffect, useRef, useState } from 'react';

const ScoreGauge = ({ score, color, label }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)`, transition: 'stroke-dashoffset 1.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-[10px] text-[#94A3B8]">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold" style={{ color }}>{label}</span>
    </div>
  );
};

const ScoreImprovement = () => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { icon: '📤', title: 'Upload Resume', desc: 'Upload your PDF or DOCX — max 5MB, no account setup needed.' },
    { icon: '🤖', title: 'AI Analyzes', desc: 'Our AI engine evaluates keywords, structure, metrics and role fit.' },
    { icon: '💡', title: 'Get Feedback', desc: 'Receive specific strengths, weaknesses, and actionable suggestions.' },
    { icon: '📈', title: 'Improve & Re-score', desc: 'Apply suggestions and watch your score climb in real time.' },
  ];

  return (
    <section id="improvement" ref={ref} className="bg-[#080F1E] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-semibold mb-4">
            How We Boost Your Score
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            CV Performance, <span className="text-[#00B4D8]">Transformed</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Our AI doesn't just score — it shows you exactly what to fix and how to fix it.
          </p>
        </div>

        {/* Before / After */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-20">
          <div className="bg-[#0D1F38] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center min-w-[200px] shadow-xl">
            <span className="text-[#94A3B8] text-xs uppercase tracking-widest mb-4">Before Coaching</span>
            <ScoreGauge score={animated ? 45 : 0} color="#EF4444" label="Below Average" />
            <div className="mt-4 space-y-1">
              <p className="text-[#64748B] text-xs">Missing keywords</p>
              <p className="text-[#64748B] text-xs">No quantified metrics</p>
              <p className="text-[#64748B] text-xs">Weak ATS compatibility</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="w-16 h-16 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-[#00B4D8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-[#10B981] font-black text-xl">+40</div>
              <div className="text-[#64748B] text-xs">Score Boost</div>
            </div>
          </div>

          <div className="bg-[#0D1F38] border border-[#10B981]/20 rounded-2xl p-8 flex flex-col items-center text-center min-w-[200px] shadow-xl shadow-[#10B981]/5 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]">
              Goal
            </div>
            <span className="text-[#94A3B8] text-xs uppercase tracking-widest mb-4">After Coaching</span>
            <ScoreGauge score={animated ? 85 : 0} color="#10B981" label="Interview Ready" />
            <div className="mt-4 space-y-1">
              <p className="text-[#4ADE80] text-xs">✓ Role-matched keywords</p>
              <p className="text-[#4ADE80] text-xs">✓ Quantified achievements</p>
              <p className="text-[#4ADE80] text-xs">✓ 90%+ ATS score</p>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <div className="flex justify-center mb-20">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10">
            <span className="text-[#F59E0B]">⭐</span>
            <span className="text-[#E2E8F0] text-sm font-medium">Users improve their scores by an average of <strong className="text-[#10B981]">20 points</strong></span>
            <span className="w-px h-4 bg-white/20" />
            <span className="text-[#94A3B8] text-sm">Tested by 500+ Users</span>
          </div>
        </div>

        {/* 4 Step Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px border-t border-dashed border-white/15 z-0" style={{ width: '100%', left: '75%', right: '-25%' }} />
              )}
              <div className="bg-[#0D1F38] border border-white/10 rounded-xl p-6 hover:border-[#00B4D8]/30 transition-all duration-300 group relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center text-xl mb-4 group-hover:bg-[#00B4D8]/20 transition-colors">
                  {step.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-[#00B4D8]/20 text-[#00B4D8] text-[10px] font-black flex items-center justify-center border border-[#00B4D8]/30">
                    {i + 1}
                  </span>
                  <h4 className="text-white font-bold text-sm">{step.title}</h4>
                </div>
                <p className="text-[#64748B] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScoreImprovement;
