import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Shield, Calendar, Sparkles } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col">
      {/* Background glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span>Antigravity Career Coach</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all text-sm font-medium border border-slate-700/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
          <div className="absolute top-0 right-0 p-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Active Session
            </span>
          </div>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/5">
              <User className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.fullName || 'User'}!
            </h1>
            <p className="text-slate-400 mt-2">
              Your AI-powered career assistant is ready.
            </p>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/80 pt-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <User className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-medium text-slate-200 truncate">{user?.fullName || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <Mail className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-medium text-slate-200 truncate">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <Shield className="w-5 h-5 text-pink-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Account Role</p>
                <p className="text-sm font-medium text-slate-200 truncate">{user?.role || 'USER'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Joined Date</p>
                <p className="text-sm font-medium text-slate-200 truncate">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-850 bg-slate-950/40 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Antigravity. Built with Spring Boot 3 & React 18.
      </footer>
    </div>
  );
};

export default DashboardPage;
