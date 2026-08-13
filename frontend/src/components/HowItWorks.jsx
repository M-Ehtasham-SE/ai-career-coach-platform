import React from 'react';

const steps = [
  {
    num: '01',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    title: 'Upload Your Resume',
    description: 'Upload your CV as a PDF or DOCX file — up to 5MB. Our system instantly parses and extracts the content.',
    detail: 'Supports PDF, DOCX · Max 5MB',
  },
  {
    num: '02',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    title: 'Select Your Target Role',
    description: 'Choose your target role from Frontend Dev, Backend Dev, Data Science, or UI/UX Design for tailored analysis.',
    detail: 'Frontend · Backend · Data · UI/UX',
  },
  {
    num: '03',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Receive AI Analysis',
    description: 'Get your score from 0-100, with identified strengths, weaknesses, and specific actionable suggestions instantly.',
    detail: 'Score · Strengths · Suggestions',
  },
  {
    num: '04',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Improve & Re-score',
    description: 'Apply the AI suggestions to your resume, re-upload, and watch your score improve. Iterate until you\'re interview-ready.',
    detail: 'Track progress over time',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#080F1E] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-semibold mb-4">
            The Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5">
            Four Steps to a <span className="text-[#00B4D8]">Better CV</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Simple, fast, and actionable. Go from upload to improvement in under 2 minutes.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center group">

                {/* Circle */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#0D1F38] border border-white/10 group-hover:border-[#00B4D8]/40 flex items-center justify-center text-[#00B4D8] mb-5 transition-all duration-300 shadow-xl group-hover:shadow-[#00B4D8]/10">
                  {step.icon}
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#00B4D8] text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-[#00B4D8]/40">
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-3">{step.description}</p>
                <span className="text-[10px] uppercase tracking-widest text-[#64748B] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  {step.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
