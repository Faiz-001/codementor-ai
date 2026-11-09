import mongoose from 'mongoose';

const skillProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    overallDeveloperScore: { type: Number, default: 60 },
    skills: {
      javascript: { type: Number, default: 60 },
      debugging: { type: Number, default: 60 },
      testing: { type: Number, default: 50 },
      security: { type: Number, default: 55 },
      algorithms: { type: Number, default: 60 },
      errorHandling: { type: Number, default: 55 },
      asyncProgramming: { type: Number, default: 65 },
      architecture: { type: Number, default: 60 },
    },
    weaknesses: [
      {
        concept: { type: String, required: true },
        frequency: { type: Number, default: 1 },
        lastDetected: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('SkillProfile', skillProfileSchema);