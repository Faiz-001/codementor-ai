import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Play, Award, Code2, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [skillRes, historyRes] = await Promise.all([
          API.get('/skills'),
          API.get('/analyses'),
        ]);
        setProfile(skillRes.data.profile);
        setRecentAnalyses(historyRes.data.analyses.slice(0, 5));
        setTotalAnalyses(historyRes.data.analyses.length);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950 text-slate-300">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Level: <span className="text-blue-400 font-medium">{user?.experienceLevel || 'Developer'}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            Analyze Code
          </button>
          <button
            onClick={logout}
            className="bg-dark-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs px-3 py-2 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Developer Score</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{profile?.overallDeveloperScore || 0}/100</p>
          </div>
          <Award className="w-8 h-8 text-blue-500/40" />
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Analyses</p>
            <p className="text-2xl font-bold text-white mt-1">{totalAnalyses}</p>
          </div>
          <Code2 className="w-8 h-8 text-slate-600" />
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Active Weaknesses</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {profile?.weaknesses?.length || 0}
            </p>
          </div>
          <AlertCircle className="w-8 h-8 text-yellow-500/40" />
        </div>
      </div>

      {/* Recent Analyses List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-200">Recent Analyses</h3>
          <button onClick={() => navigate('/skills')} className="text-xs text-blue-400 hover:underline">
            View Skills Profile →
          </button>
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="bg-dark-900 border border-slate-800 rounded-lg p-8 text-center space-y-3">
            <p className="text-sm text-slate-400">You haven't run any code analyses yet.</p>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded font-medium"
            >
              Start First Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAnalyses.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/analysis/${item._id}`)}
                className="bg-dark-900 border border-slate-800 hover:border-slate-700 p-4 rounded-lg flex justify-between items-center cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {item.language.toUpperCase()} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm font-bold ${item.overallScore >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {item.overallScore}/100
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}