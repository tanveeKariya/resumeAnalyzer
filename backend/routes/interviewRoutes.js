const express = require('express');
const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Interview routes
router.post('/schedule', roleAuth(['hr']), interviewController.scheduleInterview);
router.get('/', interviewController.getUserInterviews);
router.get('/:interviewId', interviewController.getInterviewDetails);
router.patch('/:interviewId/respond', roleAuth(['candidate']), interviewController.respondToInterview);
router.patch('/:interviewId/status', interviewController.updateInterviewStatus);
router.post('/:interviewId/feedback', roleAuth(['hr']), interviewController.submitFeedback);
router.get('/jobs/:jobId/slots', interviewController.getAvailableSlots);

module.exports = router;