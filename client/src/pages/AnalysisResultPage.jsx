import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import CodeEditor from '../components/CodeEditor';
import { Shield, Zap, Bug, CheckCircle, Lightbulb, Code, ArrowLeft } from 'lucide-react';

export default function AnalysisResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await API.get(`/analyses/${id}`);
        setAnalysis(res.data.analysis);
      } catch (err) {
        console.error('Failed to load analysis:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950 text-slate-300">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-400">Analysis report not found.</p>
        <button onClick={() => navigate('/analyze')} className="mt-4 text-sm text-blue-400 hover:underline">
          Return to Analyzer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate('/analyze')}
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Analyzer
      </button>

      {/* Top Banner */}
      <div className="bg-dark-900 border border-slate-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">{analysis.title}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Language: <span className="uppercase text-blue-400">{analysis.language}</span> • Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-dark-950 px-4 py-2 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Overall Score:</span>
          <span className={`text-2xl font-bold ${analysis.overallScore >= 75 ? 'text-green-400' : analysis.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {analysis.overallScore}/100
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        {['overview', 'bugs', 'security', 'performance', 'tests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-dark-900 border border-slate-800 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Executive Summary</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{analysis.summary}</p>
            </div>
            {analysis.strengths?.length > 0 && (
              <div className="bg-dark-900 border border-slate-800 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Code Strengths
                </h3>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {analysis.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bugs' && (
          <div className="space-y-3">
            {analysis.issues?.length === 0 ? (
              <p className="text-xs text-slate-400">No bugs or critical logic errors detected.</p>
            ) : (
              analysis.issues.map((issue, idx) => (
                <div key={idx} className="bg-dark-900 border border-slate-800 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                      <Bug className="w-4 h-4" /> {issue.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{issue.description}</p>
                  <div className="bg-dark-950 p-3 rounded text-xs border border-slate-800 space-y-1">
                    <p className="text-slate-400"><strong className="text-slate-200">Why it matters:</strong> {issue.whyItMatters}</p>
                    <p className="text-slate-400"><strong className="text-slate-200">Suggested Fix:</strong> {issue.suggestedFix}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            {analysis.securityFindings?.length === 0 ? (
              <p className="text-xs text-slate-400">No security vulnerabilities detected.</p>
            ) : (
              analysis.securityFindings.map((sec, idx) => (
                <div key={idx} className="bg-dark-900 border border-slate-800 p-4 rounded-lg space-y-2">
                  <h4 className="text-xs font-semibold text-yellow-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> {sec.title}
                  </h4>
                  <p className="text-xs text-slate-300">{sec.description}</p>
                  <p className="text-xs text-slate-400 bg-dark-950 p-2.5 rounded border border-slate-800">
                    <strong>Mitigation:</strong> {sec.recommendation}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-3">
            {analysis.performanceFindings?.length === 0 ? (
              <p className="text-xs text-slate-400">No performance bottlenecks detected.</p>
            ) : (
              analysis.performanceFindings.map((perf, idx) => (
                <div key={idx} className="bg-dark-900 border border-slate-800 p-4 rounded-lg space-y-2">
                  <h4 className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> {perf.title}
                  </h4>
                  <p className="text-xs text-slate-300">{perf.description}</p>
                  {perf.impact && <p className="text-xs text-slate-400">Impact: {perf.impact}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Generated Tests ({analysis.generatedTests?.framework})</h3>
            <CodeEditor
              code={analysis.generatedTests?.code || '// No tests generated'}
              language={analysis.language}
              readOnly={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}