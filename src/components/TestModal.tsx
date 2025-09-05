import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, X, AlertTriangle, Brain, Award, Zap } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty?: string;
  category?: string;
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
      // Generate questions based on job title
      const generatedQuestions = await generateQuestionsForJob(jobTitle);
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(-1));
    } catch (error) {
      console.error('Failed to generate questions:', error);
      // Use fallback questions
      const fallbackQuestions = getFallbackQuestions(jobTitle);
      setQuestions(fallbackQuestions);
      setAnswers(new Array(fallbackQuestions.length).fill(-1));
    } finally {
      setLoading(false);
    }
  };

  const generateQuestionsForJob = async (jobTitle: string): Promise<Question[]> => {
    // Mock API call - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseQuestions = [
      {
        id: 1,
        question: "What is the primary purpose of version control systems like Git?",
        options: [
          "To track changes in source code over time",
          "To compile and run code",
          "To test applications",
          "To deploy applications to production"
        ],
        correctAnswer: 0,
        difficulty: "easy",
        category: "tools"
      },
      {
        id: 2,
        question: "Which HTTP status code indicates a successful request?",
        options: ["404", "500", "200", "301"],
        correctAnswer: 2,
        difficulty: "easy",
        category: "web"
      },
      {
        id: 3,
        question: "What does API stand for?",
        options: [
          "Application Programming Interface",
          "Advanced Programming Integration",
          "Automated Program Interaction",
          "Application Process Integration"
        ],
        correctAnswer: 0,
        difficulty: "easy",
        category: "concepts"
      }
    ];

    // Add job-specific questions
    const jobSpecific = getJobSpecificQuestions(jobTitle);
    return [...baseQuestions, ...jobSpecific].slice(0, 15);
  };

  const getJobSpecificQuestions = (jobTitle: string): Question[] => {
    const titleLower = jobTitle.toLowerCase();
    
    if (titleLower.includes('frontend') || titleLower.includes('react')) {
      return [
        {
          id: 4,
          question: "What is the virtual DOM in React?",
          options: [
            "A lightweight copy of the real DOM kept in memory",
            "A new HTML standard",
            "A CSS framework",
            "A JavaScript testing library"
          ],
          correctAnswer: 0,
          difficulty: "moderate",
          category: "react"
        },
        {
          id: 5,
          question: "Which CSS property is used to create flexible layouts?",
          options: ["display: block", "display: flex", "display: inline", "display: none"],
          correctAnswer: 1,
          difficulty: "easy",
          category: "css"
        },
        {
          id: 6,
          question: "What is JSX in React?",
          options: [
            "A JavaScript extension that allows HTML-like syntax",
            "A CSS preprocessor",
            "A testing framework",
            "A state management library"
          ],
          correctAnswer: 0,
          difficulty: "moderate",
          category: "react"
        },
        {
          id: 7,
          question: "Which hook is used for side effects in React?",
          options: ["useState", "useEffect", "useContext", "useReducer"],
          correctAnswer: 1,
          difficulty: "moderate",
          category: "react"
        }
      ];
    } else if (titleLower.includes('backend') || titleLower.includes('node')) {
      return [
        {
          id: 4,
          question: "What is middleware in Express.js?",
          options: [
            "A database connection pool",
            "Functions that execute during the request-response cycle",
            "A frontend framework",
            "A testing library"
          ],
          correctAnswer: 1,
          difficulty: "moderate",
          category: "backend"
        },
        {
          id: 5,
          question: "What does CRUD stand for in database operations?",
          options: [
            "Create, Read, Update, Delete",
            "Connect, Retrieve, Upload, Download",
            "Copy, Remove, Undo, Deploy",
            "Cache, Render, Update, Display"
          ],
          correctAnswer: 0,
          difficulty: "easy",
          category: "database"
        },
        {
          id: 6,
          question: "What is the purpose of async/await in JavaScript?",
          options: [
            "To handle synchronous operations",
            "To handle asynchronous operations more elegantly",
            "To create loops",
            "To define variables"
          ],
          correctAnswer: 1,
          difficulty: "moderate",
          category: "javascript"
        },
        {
          id: 7,
          question: "Which of the following is a NoSQL database?",
          options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
          correctAnswer: 2,
          difficulty: "easy",
          category: "database"
        }
      ];
    } else {
      return [
        {
          id: 4,
          question: "What is the difference between == and === in JavaScript?",
          options: [
            "No difference",
            "=== checks type and value, == only checks value",
            "== checks type and value, === only checks value",
            "=== is for strings, == is for numbers"
          ],
          correctAnswer: 1,
          difficulty: "moderate",
          category: "javascript"
        },
        {
          id: 5,
          question: "What is a RESTful API?",
          options: [
            "A database design pattern",
            "An architectural style for web services",
            "A frontend framework",
            "A testing methodology"
          ],
          correctAnswer: 1,
          difficulty: "moderate",
          category: "web"
        },
        {
          id: 6,
          question: "What is the purpose of unit testing?",
          options: [
            "To test the entire application",
            "To test individual components or functions",
            "To test user interfaces",
            "To test database connections"
          ],
          correctAnswer: 1,
          difficulty: "easy",
          category: "testing"
        },
        {
          id: 7,
          question: "What does MVC stand for?",
          options: [
            "Model View Controller",
            "Multiple View Components",
            "Modern Visual Components",
            "Managed Version Control"
          ],
          correctAnswer: 0,
          difficulty: "easy",
          category: "architecture"
        }
      ];
    }
  };

  const getFallbackQuestions = (jobTitle: string): Question[] => {
    return [
      {
        id: 1,
        question: "What is the primary purpose of version control systems?",
        options: [
          "To track changes in code",
          "To compile code",
          "To test code",
          "To deploy code"
        ],
        correctAnswer: 0,
        difficulty: "easy",
        category: "general"
      },
      {
        id: 2,
        question: "Which of the following is a programming language?",
        options: ["HTML", "CSS", "JavaScript", "JSON"],
        correctAnswer: 2,
        difficulty: "easy",
        category: "general"
      },
      {
        id: 3,
        question: "What does HTTP stand for?",
        options: [
          "HyperText Transfer Protocol",
          "High Tech Transfer Protocol",
          "HyperText Transport Protocol",
          "High Transfer Text Protocol"
        ],
        correctAnswer: 0,
        difficulty: "easy",
        category: "web"
      }
    ];
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
    const passed = finalScore >= 70; // 70% passing score
    
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

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Technical Assessment" size="xl">
      {!testStarted ? (
        <div className="text-center space-y-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-large">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Technical Assessment</h3>
            <p className="text-gray-600 mb-6 text-lg">Position: <span className="font-semibold text-blue-600">{jobTitle}</span></p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 text-left max-w-2xl mx-auto">
              <h4 className="font-bold text-blue-900 mb-6 text-xl flex items-center space-x-2">
                <Award className="h-6 w-6" />
                <span>Test Instructions</span>
              </h4>
              <div className="grid md:grid-cols-2 gap-6 text-blue-800">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 font-bold text-sm">15</span>
                    </div>
                    <span className="font-medium">Technical questions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-800" />
                    </div>
                    <span className="font-medium">15 minutes time limit</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 font-bold text-sm">70%</span>
                    </div>
                    <span className="font-medium">Minimum score to pass</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-blue-800" />
                    </div>
                    <span className="font-medium">Navigate between questions</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-100 rounded-xl">
                <p className="text-blue-800 font-medium text-center">
                  Questions cover technical concepts, problem-solving, and best practices relevant to {jobTitle}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={startTest} disabled={loading} loading={loading} size="xl">
              {loading ? 'Generating Questions...' : 'Start Assessment'}
            </Button>
            <Button variant="outline" onClick={onClose} size="xl">
              Cancel
            </Button>
          </div>
        </div>
      ) : testCompleted ? (
        <div className="text-center space-y-8">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-large ${
            score >= 70 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'
          }`}>
            {score >= 70 ? (
              <CheckCircle className="h-12 w-12 text-white" />
            ) : (
              <X className="h-12 w-12 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h3>
            <div className="text-6xl font-bold mb-4">
              <span className={score >= 70 ? 'text-green-600' : 'text-red-600'}>{score}%</span>
            </div>
            <p className={`text-xl font-semibold mb-4 ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {score >= 70 ? 'Congratulations! You passed the assessment.' : 'Unfortunately, you did not meet the minimum score requirement.'}
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{answers.filter((a, i) => a === questions[i]?.correctAnswer).length}</div>
                  <div className="text-sm text-gray-600 font-medium">Correct Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                  <div className="text-sm text-gray-600 font-medium">Total Questions</div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-lg">
              {score >= 70 
                ? 'Your application will be forwarded to the recruiter for the next round.'
                : 'You can retake the assessment after 24 hours to improve your score.'
              }
            </p>
          </div>
          <Button onClick={onClose} size="xl">
            Close Assessment
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Test Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <span className="text-lg font-bold text-gray-900">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-64 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className={`flex items-center space-x-3 ${getTimeColor()}`}>
              <Clock className="h-6 w-6" />
              <span className="font-mono text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question */}
          {questions[currentQuestion] && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-gray-900">
                    {questions[currentQuestion].question}
                  </h4>
                  {questions[currentQuestion].difficulty && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(questions[currentQuestion].difficulty)}`}>
                      {questions[currentQuestion].difficulty}
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 font-medium text-lg ${
                        answers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-medium'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-soft'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          answers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion] === index && (
                            <div className="w-3 h-3 bg-white rounded-full" />
                          )}
                        </div>
                        <span>{option}</span>
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
                  size="lg"
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                        index === currentQuestion
                          ? 'bg-blue-600 text-white shadow-medium'
                          : answers[index] !== -1
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
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
                    size="lg"
                    variant="secondary"
                  >
                    Submit Assessment
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion] === -1}
                    size="lg"
                  >
                    Next Question
                  </Button>
                )}
              </div>

              {/* Progress Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">
                    Answered: {answers.filter(a => a !== -1).length} / {questions.length}
                  </span>
                  <span className="font-medium text-gray-700">
                    Remaining: {answers.filter(a => a === -1).length} questions
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}