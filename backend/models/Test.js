const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
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
  questions: [{
    questionId: Number,
    question: String,
    options: [String],
    correctAnswer: Number,
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'advanced'],
      default: 'moderate'
    },
    category: String
  }],
  answers: [Number],
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  passed: {
    type: Boolean,
    default: false
  },
  timeLimit: {
    type: Number,
    default: 900 // 15 minutes in seconds
  },
  passingScore: {
    type: Number,
    default: 95
  },
  status: {
    type: String,
    enum: ['generated', 'in_progress', 'completed', 'expired'],
    default: 'generated'
  },
  startedAt: Date,
  completedAt: Date,
  detailedResults: [{
    questionId: Number,
    selectedAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean,
    difficulty: String,
    category: String
  }]
}, {
  timestamps: true
});

// Indexes
testSchema.index({ candidateId: 1, jobId: 1 });
testSchema.index({ status: 1, createdAt: 1 });

// Auto-expire tests after 24 hours if not completed
testSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Test', testSchema);