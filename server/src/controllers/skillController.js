import SkillProfile from '../models/SkillProfile.js';
import User from '../models/User.js';

// Helper to determine rank from developer score
export const calculateLevel = (score) => {
  if (score >= 90) return 'Staff Engineer';
  if (score >= 80) return 'Senior Dev';
  if (score >= 60) return 'Mid-Level Dev';
  return 'Junior Dev';
};

export const getSkillProfile = async (req, res) => {
  try {
    let profile = await SkillProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = await SkillProfile.create({
        userId: req.user._id,
        overallDeveloperScore: 60,
        skills: {
          javascript: 60,
          debugging: 60,
          testing: 50,
          security: 55,
          algorithms: 60,
          errorHandling: 55,
          asyncProgramming: 65,
          architecture: 60,
        },
      });
    }

    const currentScore = profile.overallDeveloperScore || 60;
    const computedLevel = calculateLevel(currentScore);

    if (req.user.experienceLevel !== computedLevel) {
      await User.findByIdAndUpdate(req.user._id, { experienceLevel: computedLevel });
      req.user.experienceLevel = computedLevel;
    }

    res.status(200).json({
      success: true,
      data: {
        profile,
        user: {
          ...req.user.toObject(),
          experienceLevel: computedLevel,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWeaknesses = async (req, res) => {
  try {
    const profile = await SkillProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(200).json({ success: true, weaknesses: [] });
    }

    // Filter concepts flagged at least once
    const weaknesses = profile.weaknesses.filter((w) => w.frequency >= 1);

    res.status(200).json({
      success: true,
      weaknesses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};