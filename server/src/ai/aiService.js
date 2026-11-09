import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Removes single-line (//) and multi-line (/* ... *\/) comments
 * and cleans up blank lines to reduce token payload size.
 */
export const stripComments = (code) => {
  if (!code) return '';
  return code
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Strip comments
    .replace(/^\s*[\r\n]/gm, '')                         // Strip blank lines
    .trim();
};

/**
 * Escapes raw control characters (newlines, tabs, etc.) ONLY when they
 * appear inside JSON string values. Whitespace between keys is left alone,
 * so pretty-printed JSON stays valid.
 */
const escapeControlCharsInStrings = (json) => {
  let out = '';
  let inString = false;
  let escaped = false;

  for (const ch of json) {
    if (!inString) {
      if (ch === '"') inString = true;
      out += ch;
      continue;
    }
    if (escaped) { out += ch; escaped = false; continue; }
    if (ch === '\\') { out += ch; escaped = true; continue; }
    if (ch === '"') { inString = false; out += ch; continue; }
    if (ch === '\n') { out += '\\n'; continue; }
    if (ch === '\r') { out += '\\r'; continue; }
    if (ch === '\t') { out += '\\t'; continue; }
    if (ch.charCodeAt(0) < 0x20) continue; // drop other control chars
    out += ch;
  }
  return out;
};

/**
 * Resilient JSON extractor & parser.
 * 1) Tries a direct parse (responseMimeType usually gives valid JSON).
 * 2) Falls back to stripping fences/prose and escaping control chars inside strings.
 */
const cleanAndParseJSON = (text) => {
  if (!text) throw new Error('Received empty response text from AI');

  // 1. Happy path
  try {
    return JSON.parse(text);
  } catch {
    // fall through to cleanup
  }

  // 2. Fallback cleanup
  let cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) cleaned = match[0];

  cleaned = escapeControlCharsInStrings(cleaned);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse AI JSON output:', err.message);
    console.error('Raw response length:', text.length);
    console.error('Start of response:', text.slice(0, 200));
    console.error('Tail of response:', text.slice(-300)); // truncation shows up here
    throw new Error('Invalid JSON format received from AI model');
  }
};

export class AIService {
  static async analyzeCode({ code, language = 'javascript' }) {
    if (!code || !code.trim()) {
      throw new Error('No source code provided for analysis.');
    }

    // 1. Enforce 300-line limit
    const lineCount = code.split('\n').length;
    if (lineCount > 300) {
      throw new Error(`Code exceeds the maximum limit of 300 lines (submitted: ${lineCount} lines).`);
    }

    // 2. Strip comments & blank lines to minimize token payload
    const cleanedCode = stripComments(code);

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      throw new Error('AI_API_KEY is missing from your server/.env file');
    }

    const systemPrompt = `You are CodeMentor AI, a world-class code reviewer and CS educator.
Analyze the provided ${language} source code and produce strict JSON structured evaluation.
CRITICAL CONSTRAINT: Respond ONLY with a valid, raw JSON object. Do NOT wrap output in markdown, codeblocks, or extra prose.
Keep explanations concise (under 2 sentences per issue) and limit total reported issues to a maximum of 3.
Keep generatedTests.code under 40 lines.

IMPORTANT!: Your response MUST match this exact JSON schema:
{
  "overallScore": 80,
  "summary": "Short 1-2 sentence overview of code quality and purpose",
  "strengths": ["Clear structure"],
  "issues": [
    {
      "type": "bug",
      "severity": "high",
      "title": "Short title",
      "line": 10,
      "description": "Short explanation",
      "whyItMatters": "Educational reason why this pattern is problematic",
      "suggestedFix": "Code snippet or exact fix",
      "concept": "Underlying computer science concept"
    }
  ],
  "securityFindings": [
    {
      "severity": "high",
      "title": "Vulnerability title",
      "description": "Explanation",
      "recommendation": "How to mitigate"
    }
  ],
  "performanceFindings": [
    {
      "title": "Performance title",
      "description": "Explanation",
      "impact": "Complexity impact",
      "suggestion": "Optimization idea"
    }
  ],
  "qualityFindings": {
    "readability": 80,
    "maintainability": 75,
    "architecture": 70
  },
  "recommendations": [
    {
      "topic": "Concept topic",
      "reason": "Why the user should practice this"
    }
  ],
  "generatedTests": {
    "framework": "Jest",
    "code": "Complete unit test file contents"
  }
}`;

    const userPrompt = `Analyze this ${language} code:\n\n${cleanedCode}`;

    // 3. 60-second AbortController timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 8192,
              responseMimeType: 'application/json',
              // Stop "thinking" tokens from eating the output budget
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API Error (${response.status}): ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];

      // Detect truncated / blocked output before trying to parse
      const finishReason = candidate?.finishReason;
      if (finishReason && finishReason !== 'STOP') {
        console.warn('Gemini finishReason:', finishReason);
      }
      if (finishReason === 'MAX_TOKENS') {
        throw new Error('AI response was cut off (token limit reached). Try a smaller code snippet.');
      }

      // Join all non-thought text parts (parts[0] isn't always the answer)
      const candidateText = candidate?.content?.parts
        ?.filter((p) => p.text && !p.thought)
        .map((p) => p.text)
        .join('');

      if (!candidateText) {
        throw new Error(
          `AI returned an empty response${finishReason ? ` (finishReason: ${finishReason})` : ''}`
        );
      }

      return cleanAndParseJSON(candidateText);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('AI request timed out after 60 seconds. Please try again with a smaller code snippet.');
      }
      throw err;
    }
  }
}