import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, X, AlertTriangle, Brain, Award, Zap, Play, ArrowRight } from 'lucide-react';
import { TestService, TestQuestion, TestResult } from '../services/api';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: string;
  onTestComplete: (result: TestResult) => void;
}

export default function TestModal({ isOpen, onClose, jobTitle, jobId, onTestComplete }: TestModalProps) {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

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
      const fallbackQuestions = TestService.getFallbackQuestions(jobTitle);
      setQuestions(fallbackQuestions);
      setAnswers(new Array(fallbackQuestions.length).fill(-1));
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(600);
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

  const submitTest = async () => {
    try {
      const testResult = await TestService.submitTest(questions, answers);
      setResult(testResult);
      setTestCompleted(true);
      onTestComplete(testResult);
    } catch (error) {
      console.error('Test submission failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-emerald-600';
    if (timeLeft > 120) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'moderate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Technical Assessment" size="xl">
      {!testStarted ? (
        <div className="text-center space-y-8">
          <div className="w-24 h-24 gradient-brand rounded-3xl flex items-center justify-center mx-auto shadow-large">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Technical Assessment Required</h3>
            <p className="text-slate-600 mb-6 text-lg">Position: <span className="font-semibold text-brand-600">{jobTitle}</span></p>
            <div className="glass rounded-3xl p-8 text-left max-w-2xl mx-auto border border-white/20 shadow-medium">
              <h4 className="font-bold text-slate-900 mb-6 text-xl flex items-center space-x-2">
                <Award className="h-6 w-6 text-brand-600" />
                <span>Assessment Guidelines</span>
              </h4>
              <div className="grid md:grid-cols-2 gap-6 text-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                      <span className="text-brand-800 font-bold text-sm">{questions.length || 10}</span>
                    </div>
                    <span className="font-medium">Technical questions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-brand-800" />
                    </div>
                    <span className="font-medium">10 minutes time limit</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                      <span className="text-brand-800 font-bold text-sm">70%</span>
                    </div>
                    <span className="font-medium">Minimum score to pass</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-brand-800" />
                    </div>
                    <span className="font-medium">Navigate between questions</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-200">
                <p className="text-brand-800 font-medium text-center">
                  ⚠️ You must pass this assessment to proceed with your application
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={startTest} disabled={loading} loading={loading} size="xl" icon={Play}>
              {loading ? 'Generating Questions...' : 'Start Assessment'}
            </Button>
            <Button variant="outline" onClick={onClose} size="xl">
              Cancel
            </Button>
          </div>
        </div>
      ) : testCompleted && result ? (
        <div className="text-center space-y-8">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-large ${
            result.passed ? 'gradient-brand' : 'bg-gradient-to-br from-rose-500 to-rose-600'
          }`}>
            {result.passed ? (
              <CheckCircle className="h-12 w-12 text-white" />
            ) : (
              <X className="h-12 w-12 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Assessment Complete!</h3>
            <div className="text-6xl font-bold mb-4">
              <span className={result.passed ? 'text-emerald-600' : 'text-rose-600'}>{result.score}%</span>
            </div>
            <p className={`text-xl font-semibold mb-4 ${result.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {result.passed ? '🎉 Congratulations! You passed the assessment.' : '❌ Unfortunately, you did not meet the minimum score requirement.'}
            </p>
            <div className="glass rounded-2xl p-6 max-w-md mx-auto border border-white/20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{result.correctAnswers}</div>
                  <div className="text-sm text-slate-600 font-medium">Correct Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{result.totalQuestions}</div>
                  <div className="text-sm text-slate-600 font-medium">Total Questions</div>
                </div>
              </div>
            </div>
            <p className="text-slate-600 mt-6 text-lg">
              {result.passed 
                ? 'You can now proceed with your job application and schedule an interview.'
                : 'You can retake the assessment after 24 hours to improve your score.'
              }
            </p>
          </div>
          <Button onClick={onClose} size="xl" variant={result.passed ? 'secondary' : 'primary'}>
            {result.passed ? 'Continue Application' : 'Close Assessment'}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <span className="text-lg font-bold text-slate-900">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-64 bg-slate-200 rounded-full h-3">
                <div 
                  className="gradient-brand h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className={`flex items-center space-x-3 ${getTimeColor()}`}>
              <Clock className="h-6 w-6" />
              <span className="font-mono text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {questions[currentQuestion] && (
            <div className="space-y-8">
              <div className="glass rounded-3xl p-8 border border-white/20 shadow-medium">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-slate-900">
                    {questions[currentQuestion].question}
                  </h4>
                  {questions[currentQuestion].difficulty && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getDifficultyColor(questions[currentQuestion].difficulty)}`}>
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
                          ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-medium'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-soft'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          answers[currentQuestion] === index
                            ? 'border-brand-500 bg-brand-500'
                            : 'border-slate-300'
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
                          ? 'bg-brand-600 text-white shadow-medium'
                          : answers[index] !== -1
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                    icon={CheckCircle}
                  >
                    Submit Assessment
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion] === -1}
                    size="lg"
                    icon={ArrowRight}
                  >
                    Next Question
                  </Button>
                )}
              </div>

              <div className="glass rounded-2xl p-6 border border-slate-200/60">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">
                    Answered: {answers.filter(a => a !== -1).length} / {questions.length}
                  </span>
                  <span className="font-medium text-slate-700">
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