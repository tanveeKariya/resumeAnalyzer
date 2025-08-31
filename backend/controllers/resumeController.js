const Resume = require('../models/Resume');
const nlpService = require('../services/nlpService');
const similarityService = require('../services/similarityService');
const logger = require('../utils/logger');

class ResumeController {
  async uploadResume(req, res) {
    try {
      const { originalText, fileName } = req.body;
      const userId = req.user.id;

      if (!originalText || !fileName) {
        return res.status(400).json({
          success: false,
          message: 'Resume text and filename are required'
        });
      }

      // Extract structured data using AI
      const extractedData = await nlpService.extractResumeData(originalText);

      // Create resume record
      const resume = new Resume({
        userId,
        fileName,
        originalText,
        extractedData
      });

      await resume.save();

      logger.info(`Resume uploaded successfully for user ${userId}`);

      res.status(201).json({
        success: true,
        message: 'Resume uploaded and processed successfully',
        data: {
          resumeId: resume._id,
          extractedData: resume.extractedData
        }
      });

    } catch (error) {
      logger.error('Resume upload failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process resume',
        error: error.message
      });
    }
  }

  async getResumeAnalysis(req, res) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.id;

      const resume = await Resume.findOne({
        _id: resumeId,
        userId,
        isActive: true
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      res.json({
        success: true,
        data: resume
      });

    } catch (error) {
      logger.error('Failed to get resume analysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve resume analysis'
      });
    }
  }

  async getUserResumes(req, res) {
    try {
      const userId = req.user.id;

      const resumes = await Resume.find({
        userId,
        isActive: true
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: resumes
      });

    } catch (error) {
      logger.error('Failed to get user resumes:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve resumes'
      });
    }
  }

  async findJobMatches(req, res) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.id;

      const resume = await Resume.findOne({
        _id: resumeId,
        userId,
        isActive: true
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      // Find matching jobs using similarity service
      const matches = similarityService.findMatchingJobs(resume.extractedData);

      res.json({
        success: true,
        data: {
          matches,
          resumeData: resume.extractedData
        }
      });

    } catch (error) {
      logger.error('Job matching failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to find job matches'
      });
    }
  }

  async deleteResume(req, res) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.id;

      const resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { isActive: false },
        { new: true }
      );

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      res.json({
        success: true,
        message: 'Resume deleted successfully'
      });

    } catch (error) {
      logger.error('Resume deletion failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete resume'
      });
    }
  }
}

module.exports = new ResumeController();