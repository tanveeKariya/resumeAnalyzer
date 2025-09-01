const Interview = require('../models/Interview');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const User = require('../models/User');
const enhancedNlpService = require('../services/enhancedNlpService');
const googleMeetService = require('../services/googleMeetService');
const logger = require('../utils/logger');

class InterviewController {
  async scheduleInterview(req, res) {
    try {
      const {
        jobId,
        candidateId,
        resumeId,
        scheduledDateTime,
        duration,
        type,
        meetingLink,
        notes
      } = req.body;

      const recruiterId = req.user.id;

      // Verify job belongs to recruiter
      const job = await Job.findOne({
        _id: jobId,
        postedBy: recruiterId,
        isActive: true
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found or unauthorized'
        });
      }

      // Verify candidate and resume
      const candidate = await User.findById(candidateId);
      const resume = await Resume.findOne({
        _id: resumeId,
        userId: candidateId,
        isActive: true
      });

      if (!candidate || !resume) {
        return res.status(404).json({
          success: false,
          message: 'Candidate or resume not found'
        });
      }

      // Generate candidate brief
      const candidateBrief = await enhancedNlpService.generateCandidateBrief(resume.extractedData);

      // Generate Google Meet link
      const meetingResult = await googleMeetService.createMeetingLink(
        `Interview: ${job.title} - ${candidate.name}`,
        scheduledDateTime,
        duration || 60,
        [candidate.email, req.user.email]
      );

      // Set slot expiration (24 hours from now)
      const slotExpiresAt = new Date();
      slotExpiresAt.setHours(slotExpiresAt.getHours() + 24);

      const interview = new Interview({
        jobId,
        candidateId,
        recruiterId,
        resumeId,
        scheduledDateTime: new Date(scheduledDateTime),
        duration: duration || 60,
        type: type || 'technical',
        meetingLink: meetingResult.meetLink,
        googleMeetId: meetingResult.eventId,
        notes,
        candidateBrief,
        slotExpiresAt
      });

      await interview.save();

      // Populate the interview with related data
      await interview.populate([
        { path: 'candidateId', select: 'name email profile' },
        { path: 'jobId', select: 'title company' },
        { path: 'recruiterId', select: 'name email' }
      ]);

      logger.info(`Interview scheduled: ${interview._id}`);

      res.status(201).json({
        success: true,
        message: 'Interview scheduled successfully',
        data: interview
      });

    } catch (error) {
      logger.error('Interview scheduling failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to schedule interview',
        error: error.message
      });
    }
  }

  async respondToInterview(req, res) {
    try {
      const { interviewId } = req.params;
      const { response } = req.body; // 'accept' or 'decline'
      const userId = req.user.id;

      const interview = await Interview.findOne({
        _id: interviewId,
        candidateId: userId,
        status: 'pending'
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found or already responded'
        });
      }

      // Check if slot has expired
      if (new Date() > interview.slotExpiresAt) {
        interview.status = 'cancelled';
        await interview.save();
        
        return res.status(400).json({
          success: false,
          message: 'Interview slot has expired'
        });
      }

      if (response === 'accept') {
        interview.status = 'confirmed';
      } else if (response === 'decline') {
        interview.status = 'cancelled';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid response. Use "accept" or "decline"'
        });
      }

      await interview.save();

      logger.info(`Interview ${interviewId} ${response}ed by candidate ${userId}`);

      res.json({
        success: true,
        message: `Interview ${response}ed successfully`,
        data: interview
      });

    } catch (error) {
      logger.error('Interview response failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to respond to interview'
      });
    }
  }

  async getUserInterviews(req, res) {
    try {
      const userId = req.user.id;
      const { status, upcoming } = req.query;

      let query = {};
      
      if (req.user.role === 'candidate') {
        query.candidateId = userId;
      } else if (req.user.role === 'hr') {
        query.recruiterId = userId;
      }

      if (status) {
        query.status = status;
      }

      if (upcoming === 'true') {
        query.scheduledDateTime = { $gte: new Date() };
      }

      const interviews = await Interview.find(query)
        .populate('candidateId', 'name email profile')
        .populate('recruiterId', 'name email')
        .populate('jobId', 'title company location')
        .populate('resumeId', 'fileName extractedData')
        .sort({ scheduledDateTime: 1 });

      res.json({
        success: true,
        data: interviews
      });

    } catch (error) {
      logger.error('Failed to get interviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve interviews'
      });
    }
  }

  async updateInterviewStatus(req, res) {
    try {
      const { interviewId } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({
        _id: interviewId,
        $or: [
          { candidateId: userId },
          { recruiterId: userId }
        ]
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found or unauthorized'
        });
      }

      interview.status = status;
      await interview.save();

      res.json({
        success: true,
        message: 'Interview status updated successfully',
        data: interview
      });

    } catch (error) {
      logger.error('Interview status update failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update interview status'
      });
    }
  }

  async endMeeting(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({
        _id: interviewId,
        recruiterId: userId
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found or unauthorized'
        });
      }

      // End Google Meet
      if (interview.googleMeetId) {
        await googleMeetService.endMeeting(interview.googleMeetId);
      }

      // Update interview status
      interview.status = 'completed';
      interview.meetingEndedAt = new Date();
      await interview.save();

      logger.info(`Meeting ended for interview ${interviewId}`);

      res.json({
        success: true,
        message: 'Meeting ended successfully',
        data: { requiresFeedback: true }
      });

    } catch (error) {
      logger.error('Failed to end meeting:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to end meeting'
      });
    }
  }

  async submitFeedback(req, res) {
    try {
      const { interviewId } = req.params;
      const { rating, comments, strengths, weaknesses, recommendation } = req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({
        _id: interviewId,
        recruiterId: userId,
        status: 'completed'
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found or unauthorized'
        });
      }

      interview.feedback = {
        rating,
        comments,
        strengths,
        weaknesses,
        recommendation,
        submittedAt: new Date(),
        submittedBy: userId
      };

      // Store feedback for future reference
      interview.feedbackVisible = false; // Hidden from candidate
      await interview.save();

      logger.info(`Feedback submitted for interview ${interviewId}`);

      res.json({
        success: true,
        message: 'Feedback submitted successfully',
        data: interview.feedback
      });

    } catch (error) {
      logger.error('Feedback submission failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit feedback'
      });
    }
  }

  async getCandidateFeedbackHistory(req, res) {
    try {
      const { candidateId } = req.params;
      const userId = req.user.id;

      // Only HR can view candidate feedback history
      if (req.user.role !== 'hr') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const feedbackHistory = await Interview.find({
        candidateId,
        status: 'completed',
        'feedback.submittedAt': { $exists: true }
      })
      .populate('jobId', 'title company')
      .populate('recruiterId', 'name email')
      .select('jobId recruiterId feedback createdAt')
      .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: feedbackHistory
      });

    } catch (error) {
      logger.error('Failed to get candidate feedback history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve feedback history'
      });
    }
  }

  async getInterviewDetails(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({
        _id: interviewId,
        $or: [
          { candidateId: userId },
          { recruiterId: userId }
        ]
      })
      .populate('candidateId', 'name email profile')
      .populate('recruiterId', 'name email')
      .populate('jobId', 'title company location requirements')
      .populate('resumeId', 'fileName extractedData');

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found or unauthorized'
        });
      }

      res.json({
        success: true,
        data: interview
      });

    } catch (error) {
      logger.error('Failed to get interview details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve interview details'
      });
    }
  }

  async getAvailableSlots(req, res) {
    try {
      const { jobId } = req.params;
      const { date } = req.query;
      const userId = req.user.id;

      // Verify job exists and user has applied
      const job = await Job.findOne({
        _id: jobId,
        'applicants.userId': userId
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found or you have not applied'
        });
      }

      // Generate available slots for the next 7 days
      const slots = this.generateTimeSlots(date);

      // Filter out already booked slots
      const bookedSlots = await Interview.find({
        recruiterId: job.postedBy,
        status: { $in: ['pending', 'confirmed'] },
        scheduledDateTime: {
          $gte: new Date(date || new Date()),
          $lt: new Date(new Date(date || new Date()).getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      }).select('scheduledDateTime');

      const bookedTimes = bookedSlots.map(slot => slot.scheduledDateTime.getTime());
      const availableSlots = slots.filter(slot => !bookedTimes.includes(slot.getTime()));

      res.json({
        success: true,
        data: availableSlots
      });

    } catch (error) {
      logger.error('Failed to get available slots:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve available slots'
      });
    }
  }

  generateTimeSlots(startDate) {
    const slots = [];
    const start = new Date(startDate || new Date());
    start.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + day);

      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

      // Morning slots (9 AM - 12 PM)
      for (let hour = 9; hour < 12; hour++) {
        const slot = new Date(currentDate);
        slot.setHours(hour, 0, 0, 0);
        slots.push(slot);
      }

      // Afternoon slots (2 PM - 5 PM)
      for (let hour = 14; hour < 17; hour++) {
        const slot = new Date(currentDate);
        slot.setHours(hour, 0, 0, 0);
        slots.push(slot);
      }
    }

    return slots;
  }
}

module.exports = new InterviewController();