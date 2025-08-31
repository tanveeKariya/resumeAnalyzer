const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  scheduledDateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 60, // minutes
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'hr', 'behavioral', 'final'],
    default: 'technical'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  meetingLink: String,
  notes: String,
  candidateBrief: String, // AI-generated brief about candidate
  slotExpiresAt: {
    type: Date,
    required: true
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    strengths: [String],
    weaknesses: [String],
    recommendation: {
      type: String,
      enum: ['hire', 'reject', 'next-round', 'hold']
    },
    submittedAt: Date,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Indexes
interviewSchema.index({ candidateId: 1, status: 1 });
interviewSchema.index({ recruiterId: 1, scheduledDateTime: 1 });
interviewSchema.index({ slotExpiresAt: 1 });

// Auto-expire pending slots after 24 hours
interviewSchema.index({ slotExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Interview', interviewSchema);