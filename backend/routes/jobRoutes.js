const express = require('express');
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// Public routes
router.get('/', jobController.getJobs);
router.get('/:jobId', jobController.getJobById);

// Protected routes
router.use(auth);

// Candidate routes
router.post('/:jobId/apply', roleAuth(['candidate']), jobController.applyToJob);

// HR routes
router.post('/', roleAuth(['hr']), jobController.createJob);
router.get('/:jobId/applicants', roleAuth(['hr']), jobController.getJobApplicants);
router.patch('/:jobId/status', roleAuth(['hr']), jobController.updateJobStatus);

module.exports = router;