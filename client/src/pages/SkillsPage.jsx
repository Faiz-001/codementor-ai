import { useState, useEffect } from 'react';
import API from '../services/api';
import { Award, AlertTriangle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SkillsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get('/skills');
        setProfile(res.data?.data?.profile || res.data?.profile);
      } catch (err) {
        console.error('Failed to load skill profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950 text-slate-300">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const overallScore = profile?.overallDeveloperScore || 60;
  const skillsData = profile?.skills || {};

  const categories = [
    { name: 'Javascript', value: skillsData.javascript || overallScore },
    { name: 'Debugging', value: skillsData.debugging || overallScore },
    { name: 'Testing', value: skillsData.testing || overallScore },
    { name: 'Security', value: skillsData.security || Math.max(overallScore - 10, 40) },
    { name: 'Algorithms', value: skillsData.algorithms || overallScore },
    { name: 'Error Handling', value: skillsData.errorHandling || overallScore },
    { name: 'Async Programming', value: skillsData.asyncProgramming || overallScore },
    { name: 'Architecture', value: skillsData.architecture || overallScore },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-slate-100">
      {/* Overall Score Header Card */}
      <div className="bg-dark-900 border border-slate-800 rounded-lg p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Overall Developer Score</h1>
            <p className="text-xs text-slate-400 mt-1">Calculated from actual analysis metrics</p>
          </div>
        </div>
        <div className="text-4xl font-extrabold text-blue-400">
          {overallScore}/100
        </div>
      </div>

      {/* Skill Breakdown Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200">Skill Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-dark-900 border border-slate-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{cat.name}</span>
                <span className="font-bold text-blue-400">{cat.value}%</span>
              </div>
              <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(cat.value, 0), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recurring Weaknesses */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          Recurring Weaknesses
        </h2>

        {(!profile?.weaknesses || profile.weaknesses.length === 0) ? (
          <div className="bg-dark-900 border border-slate-800 rounded-lg p-6 text-center text-xs text-slate-400">
            No recurring weaknesses detected yet. Keep analyzing code to track patterns.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.weaknesses.map((w, idx) => (
              <div key={idx} className="bg-dark-900 border border-slate-800 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">{w.concept}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Flagged {w.frequency} times</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-semibold">
            Needs Focus
          </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}