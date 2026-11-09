import { useState, useRef } from 'react';
import { Upload, FileCode, AlertCircle } from 'lucide-react';
import { detectLanguageFromExtension } from '../utils/languageDetector';

export default function FileUpload({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    setError('');
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    const detectedLang = detectLanguageFromExtension(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      onFileSelect({
        fileName: file.name,
        code: content,
        language: detectedLang,
      });
    };

    reader.onerror = () => {
      setError('Failed to read file contents.');
    };

    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-800 hover:border-slate-700 bg-dark-900'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => processFile(e.target.files[0])}
          className="hidden"
          accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.h,.hpp,.cs,.go,.rs,.php,.dart,.kt,.swift"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-dark-800 rounded-full text-blue-400">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports .js, .ts, .py, .java, .cpp, .go, .rs, .php, .dart, .kt, .swift (Max 5MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2.5 rounded border border-red-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}