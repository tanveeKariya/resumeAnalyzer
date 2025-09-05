const Test = require('../models/Test');
const Job = require('../models/Job');
const enhancedNlpService = require('../services/enhancedNlpService');
const logger = require('../utils/logger');

class TestController {
  async generateTest(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      // Verify job exists
      const job = await Job.findOne({ _id: jobId, isActive: true });
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Check if user already took test for this job
      const existingTest = await Test.findOne({
        jobId,
        candidateId: userId,
        status: { $in: ['completed', 'in_progress'] }
      });

      if (existingTest) {
        return res.status(400).json({
          success: false,
          message: 'You have already taken the test for this position'
        });
      }

      // Generate questions using AI
      const questions = await enhancedNlpService.generateQuestions(job.title);

      // Create test record
      const test = new Test({
        jobId,
        candidateId: userId,
        questions: questions.map(q => ({
          questionId: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty || 'moderate',
          category: q.category || 'technical'
        })),
        timeLimit: 900, // 15 minutes
        passingScore: 95
      });

      await test.save();

      // Return questions without correct answers
      const questionsForCandidate = questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty,
        category: q.category
      }));

      logger.info(`Test generated for job ${jobId} by candidate ${userId}`);

      res.json({
        success: true,
        data: {
          testId: test._id,
          questions: questionsForCandidate,
          timeLimit: test.timeLimit,
          passingScore: test.passingScore
        }
      });

    } catch (error) {
      logger.error('Test generation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate test'
      });
    }
  }

  async submitTest(req, res) {
    try {
      const { testId } = req.params;
      const { answers } = req.body;
      const userId = req.user.id;

      const test = await Test.findOne({
        _id: testId,
        candidateId: userId,
        status: 'in_progress'
      });

      if (!test) {
        return res.status(404).json({
          success: false,
          message: 'Test not found or already completed'
        });
      }

      // Calculate score
      let correctAnswers = 0;
      const detailedResults = test.questions.map((question, index) => {
        const isCorrect = answers[index] === question.correctAnswer;
        if (isCorrect) correctAnswers++;
        
        return {
          questionId: question.questionId,
          selectedAnswer: answers[index],
          correctAnswer: question.correctAnswer,
          isCorrect,
          difficulty: question.difficulty,
          category: question.category
        };
      });

      const score = Math.round((correctAnswers / test.questions.length) * 100);
      const passed = score >= test.passingScore;

      // Update test record
      test.answers = answers;
      test.score = score;
      test.passed = passed;
      test.status = 'completed';
      test.completedAt = new Date();
      test.detailedResults = detailedResults;

      await test.save();

      logger.info(`Test completed: ${testId}, Score: ${score}%, Passed: ${passed}`);

      res.json({
        success: true,
        data: {
          score,
          passed,
          correctAnswers,
          totalQuestions: test.questions.length,
          passingScore: test.passingScore
        }
      });

    } catch (error) {
      logger.error('Test submission failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit test'
      });
    }
  }

  async getTestResults(req, res) {
    try {
      const { testId } = req.params;
      const userId = req.user.id;

      const test = await Test.findOne({
        _id: testId,
        candidateId: userId,
        status: 'completed'
      }).populate('jobId', 'title company');

      if (!test) {
        return res.status(404).json({
          success: false,
          message: 'Test results not found'
        });
      }

      res.json({
        success: true,
        data: {
          score: test.score,
          passed: test.passed,
          completedAt: test.completedAt,
          job: test.jobId,
          detailedResults: test.detailedResults
        }
      });

    } catch (error) {
      logger.error('Failed to get test results:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve test results'
      });
    }
  }

  async getCandidateTests(req, res) {
    try {
      const userId = req.user.id;

      const tests = await Test.find({
        candidateId: userId
      })
      .populate('jobId', 'title company location')
      .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: tests
      });

    } catch (error) {
      logger.error('Failed to get candidate tests:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tests'
      });
    }
  }
}

module.exports = new TestController();