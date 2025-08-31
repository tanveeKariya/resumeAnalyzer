const express = require('express');
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Resume routes
router.post('/upload', resumeController.uploadResume);
router.get('/', resumeController.getUserResumes);
router.get('/:resumeId', resumeController.getResumeAnalysis);
router.get('/:resumeId/matches', resumeController.findJobMatches);
router.delete('/:resumeId', resumeController.deleteResume);

module.exports = router;