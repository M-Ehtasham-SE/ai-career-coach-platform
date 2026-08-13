import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 500, suffix: '+', label: 'Resumes Scored', icon: '📄', color: '#00B4D8' },
  { value: 100, suffix: '+', label: 'Interview Sessions', icon: '🎤', color: '#7C3AED' },
  { value: 90, suffix: '%', label: 'User Satisfaction', icon: '⭐', color: '#10B981' },
  { value: 20, suffix: 'pts', label: 'Avg Score Improvement', icon: '📈', color: '#F59E0B' },
];

const universities = ['FAST-NUCES', 'NUST', 'LUMS', 'IBA', 'GIKI'];

const useCounter = (target, active, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, active, duration]);

  return count;
};

const StatCard = ({ stat, active }) => {
  const count = useCounter(stat.value, active);
  return (
    <div id={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`} className="bg-[#0D1F38] border border-white/10 rounded-2xl p-7 text-center hover:border-white/20 transition-all duration-300">
      <div
        className="text-3xl mb-3 w-14 h-14 rounded-xl flex items-center justify-center mx-auto border"
        style={{ backgroundColor: `${stat.color}15`, borderColor: `${stat.color}30` }}
      >
        {stat.icon}
      </div>
      <div className="text-4xl font-black text-white mb-1">
        {count}
        <span style={{ color: stat.color }}>{stat.suffix}</span>
      </div>
      <div className="text-[#94A3B8] text-sm">{stat.label}</div>
    </div>
  );
};

const Stats = () => {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={ref} className="bg-[#0A1628] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-semibold mb-4">
            Platform Impact
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Results That <span className="text-[#00B4D8]">Speak for Themselves</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} active={active} />
          ))}
        </div>

        {/* Universities */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-[#64748B] text-sm mr-2">Trusted by students from:</span>
          {universities.map((uni) => (
            <span
              key={uni}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#CBD5E1] text-xs font-medium"
            >
              {uni}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
