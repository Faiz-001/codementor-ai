import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'bug',
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  title: { type: String, required: true },
  line: { type: Number },
  description: { type: String, required: true },
  whyItMatters: { type: String },
  suggestedFix: { type: String },
  concept: { type: String },
});

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    language: { type: String, required: true },
    sourceType: { type: String, enum: ['pasted', 'uploaded'], default: 'pasted' },
    fileName: { type: String },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    summary: { type: String, required: true },
    strengths: [{ type: String }],
    issues: [issueSchema],
    securityFindings: [
      {
        severity: { type: String },
        title: { type: String },
        description: { type: String },
        recommendation: { type: String },
      },
    ],
    performanceFindings: [
      {
        title: { type: String },
        description: { type: String },
        impact: { type: String },
        suggestion: { type: String },
      },
    ],
    qualityFindings: {
      readability: { type: Number, default: 70 },
      maintainability: { type: Number, default: 70 },
      architecture: { type: Number, default: 70 },
    },
    recommendations: [
      {
        topic: { type: String },
        reason: { type: String },
      },
    ],
    generatedTests: {
      framework: { type: String },
      code: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Analysis', analysisSchema);