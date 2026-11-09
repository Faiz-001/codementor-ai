import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import CodeEditor from '../components/CodeEditor';
import FileUpload from '../components/FileUpload';
import { SUPPORTED_LANGUAGES } from '../utils/languageDetector';
import { Code2, Upload, Play, FileCode, AlertCircle, Sparkles } from 'lucide-react';

const MAX_LINES = 300;

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('paste');
  const [code, setCode] = useState('// Write or paste your source code here\n\nfunction processOrder(order) {\n  if (!order) return null;\n  return { ...order, processed: true };\n}\n');
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const lineCount = code ? code.split('\n').length : 0;

  const handleFileSelect = ({ fileName, code, language }) => {
    setFileName(fileName);
    setCode(code);
    if (language) setLanguage(language);
    setActiveTab('paste');
  };

  const handleStartAnalysis = async () => {
    setError('');

    if (!code.trim()) {
      setError('Please provide source code to analyze.');
      return;
    }

    if (lineCount > MAX_LINES) {
      setError(`Code exceeds the maximum limit of ${MAX_LINES} lines (current: ${lineCount} lines). Please shorten your snippet.`);
      return;
    }

    setAnalyzing(true);

    try {
      const res = await API.post('/analyses', {
        code,
        language,
        sourceType: fileName ? 'uploaded' : 'pasted',
        fileName: fileName.trim() || undefined,
      });

      // Safely unpack analysis ID from response payloads
      const analysisId = res.data?.analysis?._id || res.data?.data?._id || res.data?._id;

      if (analysisId) {
        navigate(`/analysis/${analysisId}`);
      } else {
        throw new Error('Analysis finished, but failed to retrieve saved report ID.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.message || err.message || 'Failed to complete code analysis. Check API Key or server logs.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-6 h-6 text-blue-500" /> Code Analysis Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Paste code or upload source files for comprehensive AI inspection and skill assessment.
          </p>
        </div>

        {/* Controls Header */}
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-dark-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleStartAnalysis}
            disabled={!code.trim() || analyzing || lineCount > MAX_LINES}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
          >
            {analyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Analyzing Code...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Analyze Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Source Input Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Paste Code
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>

        {/* Live Line Counter */}
        {activeTab === 'paste' && (
          <span className={`text-xs ${lineCount > MAX_LINES ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
            {lineCount} / {MAX_LINES} lines
          </span>
        )}
      </div>

      {/* Active File Loaded Tag */}
      {fileName && activeTab === 'paste' && (
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-dark-900 px-3 py-1.5 rounded border border-slate-800 w-fit">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span>Loaded file: <strong className="text-slate-200">{fileName}</strong></span>
        </div>
      )}

      {/* Workspace Area */}
      {activeTab === 'paste' ? (
        <CodeEditor
          code={code}
          onChange={(val) => setCode(val || '')}
          language={language}
        />
      ) : (
        <FileUpload onFileSelect={handleFileSelect} />
      )}
    </div>
  );
}