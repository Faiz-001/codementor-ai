import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import SkillProfile from '../models/SkillProfile.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { registerSchema, loginSchema, onboardingSchema } from '../validators/authValidator.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
        code: 'VALIDATION_ERROR',
      });
    }

    const { name, username, email, password } = validation.data;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
        code: 'EMAIL_EXISTS',
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken',
        code: 'USERNAME_EXISTS',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      passwordHash,
    });

    // Initialize blank skill profile for the new user
    await SkillProfile.create({
      userId: user._id,
      skills: {
        javascript: 0,
        debugging: 0,
        testing: 0,
        security: 0,
        algorithms: 0,
        errorHandling: 0,
        asyncProgramming: 0,
        architecture: 0,
      },
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
        code: 'VALIDATION_ERROR',
      });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete onboarding process
// @route   POST /api/auth/onboarding
// @access  Private
export const submitOnboarding = async (req, res, next) => {
  try {
    const validation = onboardingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
        code: 'VALIDATION_ERROR',
      });
    }

    const { experienceLevel, preferredLanguages, learningGoals } = validation.data;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        experienceLevel,
        preferredLanguages,
        learningGoals,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};