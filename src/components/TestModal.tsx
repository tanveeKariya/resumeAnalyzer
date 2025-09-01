import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, X, AlertTriangle } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { TestService } from '../services/testService';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: string;
  onTestComplete: (score: number, passed: boolean) => void;
}

export default function TestModal({ isOpen, onClose, jobTitle, jobId, onTestComplete }: TestModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isOpen && !testStarted) {
      generateQuestions();
    }
  }, [isOpen, testStarted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && timeLeft > 0 && !testCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !testCompleted) {
      submitTest();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, testCompleted]);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const generatedQuestions = await TestService.generateQuestions(jobTitle);
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(-1));
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(900); // Reset timer
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = () => {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return answer === questions[index]?.correctAnswer ? count + 1 : count;
    }, 0);
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    const passed = finalScore >= 95;
    
    setScore(finalScore);
    setTestCompleted(true);
    onTestComplete(finalScore, passed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-green-600';
    if (timeLeft > 120) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Technical Assessment" size="lg">
      {!testStarted ? (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Technical Assessment</h3>
            <p className="text-gray-600 mb-4">Position: <span className="font-semibold">{jobTitle}</span></p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
              <h4 className="font-semibold text-blue-900 mb-2">Test Instructions:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 15 questions covering technical concepts</li>
                <li>• 15 minutes time limit</li>
                <li>• Minimum 95% score required to proceed</li>
                <li>• Questions range from easy to moderate difficulty</li>
                <li>• You can navigate between questions</li>
              </ul>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={startTest} disabled={loading} loading={loading}>
              {loading ? 'Generating Questions...' : 'Start Test'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      ) : testCompleted ? (
        <div className="text-center space-y-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
            score >= 95 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {score >= 95 ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <X className="h-10 w-10 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Test Completed!</h3>
            <div className="text-4xl font-bold mb-2">
              <span className={score >= 95 ? 'text-green-600' : 'text-red-600'}>{score}%</span>
            </div>
            <p className={`text-lg font-medium ${score >= 95 ? 'text-green-600' : 'text-red-600'}`}>
              {score >= 95 ? 'Congratulations! You passed the test.' : 'Unfortunately, you did not meet the minimum score requirement.'}
            </p>
            <p className="text-gray-600 mt-2">
              {score >= 95 
                ? 'Your application will be forwarded to the recruiter.'
                : 'You can retake the test after 24 hours.'
              }
            </p>
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Test Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question */}
          {questions[currentQuestion] && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {questions[currentQuestion].question}
                </h4>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        answers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion] === index && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        index === currentQuestion
                          ? 'bg-blue-600 text-white'
                          : answers[index] !== -1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={submitTest}
                    disabled={answers.includes(-1)}
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion] === -1}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}