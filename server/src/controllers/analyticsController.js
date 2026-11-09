import Analysis from '../models/Analysis.js';
import SkillProfile from '../models/SkillProfile.js';

// @desc    Get analytical stats for charts
// @route   GET /api/analytics
// @access  Private
export const getAnalytics = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: 1 });
    const profile = await SkillProfile.findOne({ userId: req.user._id });

    // Chart Data 1: Score Progression Over Time
    const scoreHistory = analyses.map((a) => ({
      date: new Date(a.createdAt).toLocaleDateString(),
      overallScore: a.overallScore,
      bugsCount: a.issues?.length || 0,
    }));

    // Chart Data 2: Analyses by Programming Language
    const languageMap = {};
    analyses.forEach((a) => {
      languageMap[a.language] = (languageMap[a.language] || 0) + 1;
    });

    const languageDistribution = Object.keys(languageMap).map((lang) => ({
      name: lang.toUpperCase(),
      count: languageMap[lang],
    }));

    res.status(200).json({
      success: true,
      data: {
        scoreHistory,
        languageDistribution,
        skills: profile?.skills || {},
        totalAnalyses: analyses.length,
      },
    });
  } catch (error) {
    next(error);
  }
};