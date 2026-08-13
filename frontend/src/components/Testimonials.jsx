import React from 'react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Tariq',
    role: 'Frontend Developer · Karachi',
    university: 'FAST-NUCES',
    quote: 'My resume score went from 48 to 87 in just one week. The AI pointed out I was missing critical React and TypeScript keywords that hiring managers search for. Got 3 interview calls right after.',
    score: { before: 48, after: 87 },
    initials: 'AT',
    color: '#00B4D8',
  },
  {
    id: 2,
    name: 'Hamza Malik',
    role: 'Backend Engineer · Lahore',
    university: 'NUST',
    quote: 'The role-specific feedback for Backend Developer was incredibly precise. It told me my Spring Boot and microservices experience wasn\'t prominent enough. Fixed it and landed an offer within 2 weeks.',
    score: { before: 55, after: 82 },
    initials: 'HM',
    color: '#7C3AED',
  },
  {
    id: 3,
    name: 'Sara Qureshi',
    role: 'Data Science Graduate · Islamabad',
    university: 'LUMS',
    quote: 'The interview practice feature is a game-changer. The AI generated exactly the kind of questions I faced in my actual Google interview. The confidence boost was real.',
    score: { before: 60, after: 91 },
    initials: 'SQ',
    color: '#10B981',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-[#080F1E] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-semibold mb-4">
            Success Stories
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5">
            Real People, <span className="text-[#00B4D8]">Real Results</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Join hundreds of students and professionals who improved their resumes and landed their dream jobs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              id={`testimonial-${t.id}`}
              className="bg-[#0D1F38] border border-white/10 rounded-2xl p-7 flex flex-col hover:border-white/20 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-6 flex-1">"{t.quote}"</p>

              {/* Score improvement */}
              <div
                className="flex items-center gap-3 px-3 py-2 rounded-xl mb-5 border"
                style={{ backgroundColor: `${t.color}08`, borderColor: `${t.color}20` }}
              >
                <div className="text-center">
                  <div className="text-[#EF4444] font-black text-lg">{t.score.before}</div>
                  <div className="text-[10px] text-[#64748B]">Before</div>
                </div>
                <svg className="w-5 h-5 flex-shrink-0" style={{ color: t.color }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="text-center">
                  <div className="font-black text-lg" style={{ color: t.color }}>{t.score.after}</div>
                  <div className="text-[10px] text-[#64748B]">After</div>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full border"
                    style={{ color: t.color, backgroundColor: `${t.color}15`, borderColor: `${t.color}30` }}
                  >
                    +{t.score.after - t.score.before} pts
                  </span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-[#64748B] text-xs">{t.role}</div>
                  <div className="text-[10px] font-semibold mt-0.5" style={{ color: t.color }}>{t.university}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
