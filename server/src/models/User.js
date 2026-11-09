import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Unset'],
      default: 'Unset',
    },
    preferredLanguages: [
      {
        type: String,
      },
    ],
    learningGoals: [
      {
        type: String,
      },
    ],
    theme: {
      type: String,
      enum: ['dark', 'light', 'system'],
      default: 'dark',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    streak: {
      count: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Exclude passwordHash from JSON transformations
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.model('User', userSchema);