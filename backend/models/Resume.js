const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  extractedData: {
    name: String,
    email: String,
    phone: String,
    linkedin: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      school: String,
      year: String,
      cgpa: String,
      stream: String
    }],
    certifications: [String],
    projects: [{
      name: String,
      description: String,
      technologies: [String]
    }]
  },
  processedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
resumeSchema.index({ userId: 1, isActive: 1 });
resumeSchema.index({ 'extractedData.skills': 1 });

module.exports = mongoose.model('Resume', resumeSchema);