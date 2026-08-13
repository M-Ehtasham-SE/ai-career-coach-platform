import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section id="cta" className="bg-[#080F1E] py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D2850] via-[#0A1E3D] to-[#050D1A]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(#00B4D8 1px, transparent 1px), linear-gradient(90deg, #00B4D8 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#00B4D8]/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#7C3AED]/8 blur-[80px]" />
          <div className="absolute inset-0 border border-[#00B4D8]/15 rounded-3xl" />

          {/* Content */}
          <div className="relative z-10 text-center px-8 py-16 lg:py-20">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
              Free to Start — No Card Required
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Boost Your{' '}
              <span className="text-[#00B4D8]">CV Performance?</span>
            </h2>

            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join 500+ job seekers who have improved their resumes and landed their dream jobs with AI Career Coach.
              Get your first score in under 2 minutes — completely free.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                to="/register"
                id="cta-main-register-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00B4D8] hover:bg-[#0096B7] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[#00B4D8]/30 hover:shadow-[#00B4D8]/50 hover:scale-105 text-sm"
              >
                Get Started Free — No Credit Card Required
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-[#E2E8F0] hover:text-white font-semibold rounded-xl transition-all duration-200 hover:bg-white/5 text-sm"
              >
                Already have an account? Sign In
              </Link>
            </div>

            {/* Mini stats row */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { emoji: '⚡', text: 'Score in under 2 minutes' },
                { emoji: '🎯', text: '4 roles supported' },
                { emoji: '📈', text: 'Average +20 point improvement' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-[#64748B] text-sm">
                  <span>{item.emoji}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
