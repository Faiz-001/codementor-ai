import Editor from '@monaco-editor/react';
import { Copy, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

export default function CodeEditor({ code, onChange, language = 'javascript', readOnly = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (onChange) onChange('');
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-snippet.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden bg-dark-900 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-slate-800 text-xs text-slate-400">
        <span className="font-mono font-medium uppercase text-blue-400">{language}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 transition-colors"
            title="Copy Code"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 transition-colors"
            title="Download Code"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 hover:bg-slate-800 rounded text-red-400 transition-colors"
              title="Clear Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
}