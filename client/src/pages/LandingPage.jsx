import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Code2, Shield, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
          <Terminal className="w-6 h-6 text-blue-500" />
          <span>CodeMentor AI</span>
        </div>
        <div>
          {user ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <Zap className="w-3.5 h-3.5" /> Next-Gen AI Code Review Engine
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Automated Code Inspections & <br />
          <span className="text-blue-500">Skill Growth Analytics</span>
        </h1>

        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Upload or paste your source code for instant multi-layer evaluation: security vulnerabilities, performance optimization bottlenecks, and skill level tracking.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/10"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} CodeMentor AI. Built for developers.
      </footer>
    </div>
  );
}