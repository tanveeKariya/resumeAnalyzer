const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requirements: {
    skills: [String],
    experience: {
      min: Number,
      max: Number,
      level: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'lead']
      }
    },
    education: {
      degree: String,
      stream: [String],
      cgpa: Number
    }
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    matchScore: Number,
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interviewed', 'hired', 'rejected'],
      default: 'applied'
    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
jobSchema.index({ 'requirements.skills': 1 });
jobSchema.index({ postedBy: 1, isActive: 1 });
jobSchema.index({ location: 1, type: 1 });

module.exports = mongoose.model('Job', jobSchema);