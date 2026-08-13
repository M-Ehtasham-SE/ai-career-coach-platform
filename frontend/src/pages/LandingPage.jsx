import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ScoreImprovement from '../components/ScoreImprovement';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

/**
 * Landing page — the public-facing homepage of the AI Career Coach Platform.
 * Route: /
 */
const LandingPage = () => {
  useEffect(() => {
    document.title = 'AI Career Coach — Boost Your CV Performance & Land Your Dream Job';
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1628] font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <ScoreImprovement />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
