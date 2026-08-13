import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A1628]/95 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#00B4D8] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#00B4D8]/30">
              AI
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Career<span className="text-[#00B4D8]">Coach</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('features')}
              className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('testimonials')}
              className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors font-medium"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollTo('pricing')}
              className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors font-medium"
            >
              Pricing
            </button>
            {user && (
              <Link
                to="/dashboard"
                className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-[#00B4D8] hover:bg-[#0096B7] text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-[#00B4D8]/25 hover:shadow-[#00B4D8]/40 hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-[#E2E8F0] hover:text-white transition-colors font-medium px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-[#00B4D8] hover:bg-[#0096B7] text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-[#00B4D8]/25 hover:shadow-[#00B4D8]/40 hover:scale-105"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        } bg-[#0A1628]/98 border-t border-white/10`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          <button onClick={() => scrollTo('features')} className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors text-left font-medium py-1">Features</button>
          <button onClick={() => scrollTo('how-it-works')} className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors text-left font-medium py-1">How It Works</button>
          <button onClick={() => scrollTo('testimonials')} className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors text-left font-medium py-1">Testimonials</button>
          <button onClick={() => scrollTo('pricing')} className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors text-left font-medium py-1">Pricing</button>
          {user && <Link to="/dashboard" className="text-sm text-[#E2E8F0] hover:text-[#00B4D8] transition-colors font-medium py-1">Dashboard</Link>}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <Link to="/login" className="text-sm text-center py-2 text-[#E2E8F0] hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm text-center py-2.5 bg-[#00B4D8] hover:bg-[#0096B7] text-white font-semibold rounded-lg transition-colors">Get Started Free</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
