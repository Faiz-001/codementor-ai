import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    language: {
      type: String,
      required: true,
    },
    starterCode: {
      type: String,
      required: true,
    },
    expectedConcept: {
      type: String,
      required: true,
    },
    hints: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Challenge', challengeSchema);