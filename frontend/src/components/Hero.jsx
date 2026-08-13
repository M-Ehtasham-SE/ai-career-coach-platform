import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.classList.add('hero-visible');
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-section relative min-h-screen flex items-center overflow-hidden bg-[#0A1628]"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#00B4D8 1px, transparent 1px), linear-gradient(90deg, #00B4D8 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00B4D8]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#1E3A5F]/60 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Copy */}
          <div className="hero-text">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-semibold mb-6 hero-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
              AI-Powered Career Platform — Free to Start
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 hero-title">
              Boost Your{' '}
              <span className="text-[#00B4D8]">CV Performance</span>
              <br />& Land Your Dream Job
            </h1>

            {/* Subtitle */}
            <p className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-xl hero-subtitle">
              AI Career Coach analyzes your resume, identifies strengths and weaknesses, and provides
              actionable feedback to improve your CV performance. Get role-specific analysis, practice
              interviews with AI, and track your career progress — all in one place.
            </p>

            {/* Metric badges */}
            <div className="flex flex-wrap gap-3 mb-10 hero-badges">
              {[
                { emoji: '📈', label: 'Improve CV Score by 20%' },
                { emoji: '🎯', label: '4 Job Roles Supported' },
                { emoji: '⚡', label: 'Instant AI Feedback' },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#E2E8F0] text-xs font-medium"
                >
                  <span>{b.emoji}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 hero-cta">
              <Link
                to="/register"
                id="hero-cta-primary"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#00B4D8] hover:bg-[#0096B7] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#00B4D8]/30 hover:shadow-[#00B4D8]/50 hover:scale-105 text-sm"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                id="hero-cta-secondary"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 text-[#E2E8F0] hover:text-white hover:border-white/40 hover:bg-white/5 font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See How It Works
              </button>
            </div>

            {/* Trust line */}
            <p className="mt-6 text-[#64748B] text-xs hero-trust">
              No credit card required · Trusted by FAST-NUCES, NUST & LUMS students
            </p>
          </div>

          {/* RIGHT — Visual */}
          <div className="hero-visual flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">

              {/* Main Card — Resume Score Display */}
              <div className="relative bg-[#0D1F38] border border-white/10 rounded-2xl p-8 shadow-2xl">

                {/* Score ring */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-44 h-44">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                      <circle
                        cx="80" cy="80" r="68"
                        fill="none"
                        stroke="#00B4D8"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="427"
                        strokeDashoffset="85"
                        style={{ filter: 'drop-shadow(0 0 10px #00B4D8)' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-white">85</span>
                      <span className="text-[#00B4D8] text-xs font-bold tracking-widest">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Score label */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    Excellent — Interview Ready
                  </div>
                </div>

                {/* Improvement indicators */}
                <div className="space-y-3">
                  {[
                    { label: 'Technical Keywords', score: 90, color: '#10B981' },
                    { label: 'Experience Clarity', score: 82, color: '#00B4D8' },
                    { label: 'ATS Compatibility', score: 88, color: '#10B981' },
                    { label: 'Quantifiable Metrics', score: 74, color: '#F59E0B' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#94A3B8]">{item.label}</span>
                        <span className="font-bold" style={{ color: item.color }}>{item.score}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.score}%`, backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}50` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Role badge */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[#64748B] text-xs">Analyzing for:</span>
                  <span className="text-xs font-semibold text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 px-2.5 py-1 rounded-lg">
                    Backend Developer
                  </span>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-[#10B981] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#10B981]/40 animate-bounce-slow">
                ↑ +20 Score
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#0D1F38] border border-white/15 rounded-xl px-3 py-2 text-xs shadow-xl">
                <div className="text-[#94A3B8] mb-0.5">Before Analysis</div>
                <div className="text-[#EF4444] font-black text-lg">65 <span className="text-xs font-normal text-[#64748B]">/ 100</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/30 animate-pulse" />
      </div>
    </section>
  );
};

export default Hero;
