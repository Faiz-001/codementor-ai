const EXTENSION_MAP = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  h: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  php: 'php',
  dart: 'dart',
  kt: 'kotlin',
  swift: 'swift',
};

export const detectLanguageFromExtension = (filename) => {
  if (!filename) return 'javascript';
  const ext = filename.split('.').pop().toLowerCase();
  return EXTENSION_MAP[ext] || 'javascript';
};

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'csharp', name: 'C#' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'php', name: 'PHP' },
  { id: 'dart', name: 'Dart' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'swift', name: 'Swift' },
];