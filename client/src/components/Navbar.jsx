import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Terminal,
  LayoutDashboard,
  Code2,
  Award,
  Target,
  BarChart2,
  ShieldAlert,
  LogOut,
  ArrowLeft,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze Code', path: '/analyze', icon: Code2 },
    { label: 'Skills Profile', path: '/skills', icon: Award },
 /*    { label: 'Analytics', path: '/analytics', icon: BarChart2 }, */
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin', path: '/admin', icon: ShieldAlert });
  }

  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

  return (
    <header className="bg-dark-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Logo & Quick Back Navigation */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 text-slate-400 hover:text-white bg-dark-950 border border-slate-800 hover:border-slate-700 rounded transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-white tracking-tight">
            <Terminal className="w-5 h-5 text-blue-500" />
            <span className="hidden sm:inline text-sm">CodeMentor AI</span>
          </Link>
        </div>

        {/* Center: Main App Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-950'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: User Profile & Sign Out */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:block text-right text-xs">
            <p className="text-slate-200 font-semibold">{user.name}</p>
            <p className="text-slate-500 text-[10px] uppercase">{user.experienceLevel || 'Developer'}</p>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-400 bg-dark-950 border border-slate-800 hover:border-red-500/20 rounded transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}