const express = require('express');
const testController = require('../controllers/testController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Test routes
router.post('/jobs/:jobId/generate', roleAuth(['candidate']), testController.generateTest);
router.post('/:testId/submit', roleAuth(['candidate']), testController.submitTest);
router.get('/:testId/results', testController.getTestResults);
router.get('/my-tests', roleAuth(['candidate']), testController.getCandidateTests);

module.exports = router;