import { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Code, Activity, ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState({ usersCount: 0, analysesCount: 0, activeToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/analytics');
        setStats({
          usersCount: 1,
          analysesCount: res.data.totalAnalyses || 0,
          activeToday: 1,
        });
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
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
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-500" /> Admin Console
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Platform usage metrics, active user accounts, and system status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Users</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.usersCount}</p>
          </div>
          <Users className="w-8 h-8 text-blue-500/40" />
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Analyses Processed</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.analysesCount}</p>
          </div>
          <Code className="w-8 h-8 text-green-500/40" />
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Active Users Today</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.activeToday}</p>
          </div>
          <Activity className="w-8 h-8 text-yellow-500/40" />
        </div>
      </div>
    </div>
  );
}