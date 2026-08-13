import React from 'react';
import { Link } from 'react-router-dom';

const CheckIcon = () => (
  <svg className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 text-[#475569] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'PKR 0',
    period: 'forever',
    badge: 'Start Here',
    badgeColor: '#64748B',
    description: 'Perfect for getting started. Explore the platform with no commitments.',
    features: [
      { included: true, text: '3 Resume Scorings / month' },
      { included: true, text: 'Basic AI Feedback' },
      { included: true, text: 'Role-Specific Analysis' },
      { included: true, text: 'View Strengths & Weaknesses' },
      { included: false, text: 'Unlimited Resume Scoring' },
      { included: false, text: 'Full AI Improvement Suggestions' },
      { included: false, text: 'Interview Practice' },
      { included: false, text: 'Progress Dashboard' },
    ],
    cta: 'Get Started Free',
    ctaHref: '/register',
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'PKR 500',
    period: '/month',
    badge: 'Most Popular',
    badgeColor: '#00B4D8',
    description: 'Everything you need to land your dream job — unlimited access and full AI features.',
    features: [
      { included: true, text: 'Unlimited Resume Scoring' },
      { included: true, text: 'Detailed AI Feedback & Suggestions' },
      { included: true, text: 'All 4 Role-Specific Analyses' },
      { included: true, text: 'Full Strengths, Weaknesses & Fixes' },
      { included: true, text: 'AI Interview Practice (Unlimited)' },
      { included: true, text: 'Progress Dashboard & Analytics' },
      { included: true, text: 'Score Trend Tracking' },
      { included: true, text: 'Priority Support' },
    ],
    cta: 'Start Premium',
    ctaHref: '/register',
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="bg-[#0A1628] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-semibold mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5">
            Plans for Every <span className="text-[#00B4D8]">Career Stage</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-lg mx-auto">
            Start free and upgrade when you're ready. No hidden fees, no credit card required to get started.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              id={`pricing-${plan.id}`}
              className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-[#0D2850] to-[#0D1F38] border border-[#00B4D8]/40 shadow-2xl shadow-[#00B4D8]/10'
                  : 'bg-[#0D1F38] border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-[#00B4D8] text-white text-xs font-bold shadow-lg shadow-[#00B4D8]/30">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-6">
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-2 block"
                  style={{ color: plan.highlighted ? '#00B4D8' : '#64748B' }}
                >
                  {plan.name}
                </span>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-[#64748B] text-sm mb-1.5">{plan.period}</span>
                </div>
                <p className="text-[#94A3B8] text-sm">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2">
                    {f.included ? <CheckIcon /> : <XIcon />}
                    <span className={`text-sm ${f.included ? 'text-[#CBD5E1]' : 'text-[#475569] line-through'}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.ctaHref}
                className={`block text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-[#00B4D8] hover:bg-[#0096B7] text-white shadow-lg shadow-[#00B4D8]/30'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/25'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-[#64748B] text-sm mt-8">
          Free plan includes 3 resume scorings per month · No credit card required
        </p>
      </div>
    </section>
  );
};

export default Pricing;
