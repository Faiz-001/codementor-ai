import Analysis from '../models/Analysis.js';
import SkillProfile from '../models/SkillProfile.js';
import { AIService } from '../ai/aiService.js';

// @desc    Analyze provided code snippet or uploaded file
// @route   POST /api/analyses
// @access  Private
export const createAnalysis = async (req, res, next) => {
  try {
    const { code, language = 'javascript', sourceType = 'pasted', fileName = '' } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Source code content is required for analysis',
        code: 'MISSING_CODE',
      });
    }

    // Call AI Abstraction Layer
    const aiResult = await AIService.analyzeCode({ code, language });

    // Save persistent Analysis record to MongoDB
    const analysis = await Analysis.create({
      userId: req.user._id,
      title: fileName || `${language.toUpperCase()} Analysis`,
      language,
      sourceType,
      fileName,
      overallScore: aiResult.overallScore,
      summary: aiResult.summary,
      strengths: aiResult.strengths || [],
      issues: aiResult.issues || [],
      securityFindings: aiResult.securityFindings || [],
      performanceFindings: aiResult.performanceFindings || [],
      qualityFindings: aiResult.qualityFindings || { readability: 70, maintainability: 70, architecture: 70 },
      recommendations: aiResult.recommendations || [],
      generatedTests: aiResult.generatedTests || { framework: 'Jest', code: '' },
    });

    // Dynamically update user's SkillProfile based on detected concepts
    const skillProfile = await SkillProfile.findOne({ userId: req.user._id });
    if (skillProfile) {
      // Record weaknesses for detected issues
      aiResult.issues?.forEach((issue) => {
        if (issue.concept) {
          const existing = skillProfile.weaknesses.find(
            (w) => w.concept.toLowerCase() === issue.concept.toLowerCase()
          );
          if (existing) {
            existing.frequency += 1;
            existing.lastDetected = new Date();
          } else {
            skillProfile.weaknesses.push({ concept: issue.concept, frequency: 1 });
          }
        }
      });

      // Recalculate score
      skillProfile.overallDeveloperScore = Math.round(
        (skillProfile.overallDeveloperScore + aiResult.overallScore) / 2
      );
      await skillProfile.save();
    }

    res.status(201).json({
      success: true,
      data: { analysis },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analysis by ID
// @route   GET /api/analyses/:id
// @access  Private
export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found',
        code: 'NOT_FOUND',
      });
    }

    res.status(200).json({
      success: true,
      data: { analysis },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's analysis history
// @route   GET /api/analyses
// @access  Private
export const getAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('title language sourceType fileName overallScore createdAt issues');

    res.status(200).json({
      success: true,
      data: { analyses },
    });
  } catch (error) {
    next(error);
  }
};

// Helper to determine rank from developer score
export const calculateLevel = (score) => {
  if (score >= 90) return 'Staff Engineer';
  if (score >= 80) return 'Senior Dev';
  if (score >= 60) return 'Mid-Level Dev';
  return 'Junior Dev';
};