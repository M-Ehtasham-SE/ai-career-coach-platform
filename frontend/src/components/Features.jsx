import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    id: 'resume-scoring',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: '#00B4D8',
    badge: 'Core Feature',
    title: 'AI Resume Scoring',
    description: 'Get your resume scored from 0-100 with detailed, actionable feedback. Our AI identifies strengths, weaknesses, and delivers specific suggestions to make your CV stand out.',
    points: ['Keyword density analysis', 'ATS compatibility check', 'Formatting & structure review'],
    cta: { label: 'Score Your Resume', href: '/score' },
  },
  {
    id: 'role-targeting',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    color: '#7C3AED',
    badge: 'Smart Targeting',
    title: 'Role-Based Analysis',
    description: 'Select from 4 industry roles — Frontend, Backend, Data Science, and UI/UX — and receive analysis tailored to exactly what hiring managers look for in each role.',
    points: ['Frontend & Backend Dev', 'Data Science & UI/UX', 'Skills gap identification'],
    cta: { label: 'Try Role Targeting', href: '/score' },
  },
  {
    id: 'interview-practice',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: '#10B981',
    badge: 'Practice Ready',
    title: 'AI Interview Practice',
    description: 'Practice with AI-generated, role-specific interview questions and receive instant, structured feedback on your answers. Build real confidence before the real interview.',
    points: ['Role-specific questions', 'Instant answer scoring', 'Confidence building'],
    cta: { label: 'Start Practice', href: '/interview' },
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-[#0A1628] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-semibold mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5">
            Everything You Need to <span className="text-[#00B4D8]">Get Hired</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto leading-relaxed">
            From resume analysis to interview simulation — a complete career toolkit powered by AI.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.id}
              id={`feature-${f.id}`}
              className="group bg-[#0D1F38] border border-white/10 rounded-2xl p-7 flex flex-col hover:border-opacity-50 transition-all duration-300 hover:shadow-2xl"
              style={{ '--accent': f.color }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-colors duration-300"
                style={{
                  backgroundColor: `${f.color}15`,
                  borderColor: `${f.color}30`,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>

              {/* Badge + Title */}
              <div className="mb-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: f.color }}
                >
                  {f.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-5">{f.description}</p>

              {/* Points */}
              <ul className="space-y-2 mb-6 flex-1">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                    {p}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={f.cta.href}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
                style={{ color: f.color }}
              >
                {f.cta.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
