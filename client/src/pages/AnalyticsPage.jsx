import { useState, useEffect } from 'react';
import API from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart2, TrendingUp, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics');
        // Unpack payload safely
        const payload = res.data?.data || res.data;
        setData(payload);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError(err.message || 'Failed to fetch analytics metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-slate-300">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-4 mt-12">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded">
          {error || 'No analytics data available right now.'}
        </div>
      </div>
    );
  }

  // Safe fallbacks for chart datasets
  const languageStats = data.languageBreakdown || [
    { name: 'JavaScript', value: 1 },
  ];

  const scoreTrends = data.scoreTrends || [
    { name: 'Avg Quality', score: data.averageScore || 70 },
  ];

  const issueCategories = data.issueCategories || [
    { name: 'Bugs', count: 0 },
    { name: 'Performance', count: 0 },
    { name: 'Security', count: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-500" /> Analytics Overview
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Comprehensive metrics on inspect operations, code quality trends, and issues.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Inspections</span>
            <Code2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{data.totalAnalyses || 0}</p>
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Quality Score</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {data.averageScore ? Math.round(data.averageScore) : 0}/100
          </p>
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Issues Detected</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{data.totalIssues || 0}</p>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues Breakdown Bar Chart */}
        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">Issues by Category</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueCategories}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Breakdown Pie Chart */}
        <div className="bg-dark-900 border border-slate-800 p-5 rounded-lg space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">Languages Inspected</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {languageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}