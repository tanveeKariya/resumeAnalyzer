import React, { useState, useEffect } from 'react';
import { Target, MapPin, DollarSign, Clock, Users, Star, Award, CheckCircle, ExternalLink, Briefcase, TrendingUp, Zap, Brain, ArrowRight, Play, Calendar } from 'lucide-react';
import { ResumeAnalysisService, JobService, TestResult, StorageService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TestModal from '../components/TestModal';
import InterviewSlotModal from '../components/InterviewSlotModal';

interface JobMatch {
  _id: string;
  title: string;
  company: string;
  location: string;
  matchScore?: number;
  skillsMatch?: number;
  experienceMatch?: number;
  educationMatch?: number;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  requirements: {
    skills: string[];
    experience: {
      min: number;
      max: number;
      level: string;
    };
  };
  description: string;
  postedBy: string;
  isActive: boolean;
  createdAt: string;
  availableSlots?: string[];
}

export default function JobMatches() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Map<string, TestResult>>(new Map());
  const [resumeData, setResumeData] = useState<any>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string>('');

  useEffect(() => {
    loadJobMatches();
    loadTestResults();
  }, []);

  const loadJobMatches = async () => {
    try {
      setLoading(true);
      
      const currentAnalysisId = localStorage.getItem('currentAnalysisId');
      
      if (currentAnalysisId) {
        setCurrentResumeId(currentAnalysisId);
        const response = await ResumeAnalysisService.findJobMatches(currentAnalysisId);
        setJobs(response.matches || []);
        setResumeData(response.resumeData);
      } else {
        const response = await JobService.getJobs();
        const jobsWithScores = response.data.jobs.map((job: any) => ({
          ...job,
          matchScore: Math.floor(Math.random() * 20) + 75,
          skillsMatch: Math.floor(Math.random() * 20) + 80,
          experienceMatch: Math.floor(Math.random() * 20) + 75,
          educationMatch: Math.floor(Math.random() * 20) + 85
        }));
        setJobs(jobsWithScores);
      }
    } catch (error) {
      console.error('Failed to load job matches:', error);
      setJobs(getMockJobs());
    } finally {
      setLoading(false);
    }
  };

  const loadTestResults = () => {
    const results = new Map<string, TestResult>();
    jobs.forEach(job => {
      const result = StorageService.getTestResult(job._id);
      if (result) {
        results.set(job._id, result);
      }
    });
    setTestResults(results);
  };

  const getMockJobs = (): JobMatch[] => [
    {
      _id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      matchScore: 92,
      skillsMatch: 95,
      experienceMatch: 90,
      educationMatch: 88,
      salary: { min: 120000, max: 150000, currency: 'USD' },
      type: 'full-time',
      requirements: {
        skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
        experience: { min: 3, max: 7, level: 'senior' }
      },
      description: 'We are looking for a Senior Frontend Developer with expertise in React and modern JavaScript frameworks.',
      postedBy: 'hr-1',
      isActive: true,
      createdAt: new Date().toISOString(),
      availableSlots: JobService.generateDefaultSlots()
    }
  ];

  const startApplication = (job: JobMatch) => {
    const existingResult = testResults.get(job._id);
    
    if (existingResult && existingResult.passed) {
      // Test already passed, proceed to interview scheduling
      setSelectedJob(job);
      setShowSlotModal(true);
    } else {
      // Need to take test first
      setSelectedJob(job);
      setShowTestModal(true);
    }
  };

  const handleTestComplete = (result: TestResult) => {
    setShowTestModal(false);
    
    if (selectedJob) {
      StorageService.saveTestResult(selectedJob._id, result);
      setTestResults(prev => new Map(prev.set(selectedJob._id, result)));
      
      if (result.passed) {
        // Test passed, proceed to interview scheduling
        setTimeout(() => {
          setShowSlotModal(true);
        }, 1000);
      } else {
        alert(`You scored ${result.score}%. Unfortunately, you didn't meet the minimum requirement of 70%. You can retake the test after 24 hours.`);
        setSelectedJob(null);
      }
    }
  };

  const handleSlotRequested = () => {
    if (selectedJob) {
      setAppliedJobs(prev => new Set([...prev, selectedJob._id]));
      alert(`Interview slot requested successfully for ${selectedJob.title} at ${selectedJob.company}! The recruiter will confirm within 24 hours.`);
    }
    setSelectedJob(null);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    if (score >= 80) return 'text-brand-600 bg-brand-100 border-brand-200';
    if (score >= 70) return 'text-amber-600 bg-amber-100 border-amber-200';
    return 'text-rose-600 bg-rose-100 border-rose-200';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
  };

  const getApplicationStatus = (job: JobMatch) => {
    const testResult = testResults.get(job._id);
    
    if (appliedJobs.has(job._id)) {
      return { status: 'applied', label: 'Interview Requested', color: 'bg-brand-100 text-brand-800' };
    } else if (testResult?.passed) {
      return { status: 'test-passed', label: 'Test Passed - Ready to Apply', color: 'bg-emerald-100 text-emerald-800' };
    } else if (testResult && !testResult.passed) {
      return { status: 'test-failed', label: 'Test Failed - Retake Available', color: 'bg-rose-100 text-rose-800' };
    } else {
      return { status: 'not-started', label: 'Assessment Required', color: 'bg-amber-100 text-amber-800' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-soft shadow-large">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Finding Perfect Matches</h3>
          <p className="text-slate-600">AI is analyzing job opportunities for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <TestModal
        isOpen={showTestModal}
        onClose={() => {
          setShowTestModal(false);
          setSelectedJob(null);
        }}
        jobTitle={selectedJob?.title || ''}
        jobId={selectedJob?._id || ''}
        onTestComplete={handleTestComplete}
      />

      <InterviewSlotModal
        isOpen={showSlotModal}
        onClose={() => {
          setShowSlotModal(false);
          setSelectedJob(null);
        }}
        jobId={selectedJob?._id || ''}
        jobTitle={selectedJob?.title || ''}
        company={selectedJob?.company || ''}
        resumeId={currentResumeId}
        onSlotRequested={handleSlotRequested}
      />

      <div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center space-x-4">
          <div className="w-16 h-16 gradient-brand rounded-3xl flex items-center justify-center shadow-large">
            <Target className="h-8 w-8 text-white" />
          </div>
          <span>Job Matches</span>
        </h1>
        <p className="text-slate-600 text-xl font-medium leading-relaxed">
          Discover opportunities perfectly matched to your skills and experience with AI-powered recommendations
        </p>
      </div>

      {resumeData && (
        <Card glass padding="xl" shadow="large" className="border border-white/20">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-brand-600" />
            <span>Your Profile Strength</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                <Zap className="h-8 w-8 text-brand-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{resumeData.skills?.length || 0}</div>
              <div className="text-slate-600 font-semibold">Technical Skills</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                <Briefcase className="h-8 w-8 text-violet-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{resumeData.experience?.length || 0}</div>
              <div className="text-slate-600 font-semibold">Work Experience</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{resumeData.projects?.length || 0}</div>
              <div className="text-slate-600 font-semibold">Projects</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{jobs.length}</div>
              <div className="text-slate-600 font-semibold">Job Matches</div>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-8">
        {jobs.length === 0 ? (
          <Card className="text-center py-16" glass padding="xl" shadow="large">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Target className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Job Matches Found</h3>
            <p className="text-slate-600 text-lg mb-8">
              Upload your resume first to get personalized job recommendations based on your skills and experience.
            </p>
            <Button onClick={() => window.location.href = '/upload'} size="lg">
              Upload Resume
            </Button>
          </Card>
        ) : (
          jobs.map((job) => {
            const applicationStatus = getApplicationStatus(job);
            const testResult = testResults.get(job._id);
            
            return (
              <Card key={job._id} className="group" hover glass padding="xl" shadow="large" className="border border-white/20">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-3xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {job.title}
                      </h3>
                      {job.matchScore && (
                        <span className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-soft border ${getMatchColor(job.matchScore)}`}>
                          {job.matchScore}% Match
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${applicationStatus.color}`}>
                        {applicationStatus.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-slate-600 mb-6">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span className="font-semibold text-lg">{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5" />
                        <span className="font-medium">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium capitalize">{job.type}</span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-6 font-medium">
                      {job.description}
                    </p>
                  </div>
                  <div className="text-right ml-8">
                    <div className="text-2xl font-bold text-slate-900 mb-2">
                      {formatSalary(job.salary)}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">Annual Salary</div>
                  </div>
                </div>

                {job.matchScore && (
                  <div className="grid md:grid-cols-4 gap-6 mb-8 p-6 glass rounded-3xl border border-slate-200/60">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-600 mb-1">{job.matchScore}%</div>
                      <div className="text-sm text-slate-600 font-semibold">Overall Match</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">{job.skillsMatch}%</div>
                      <div className="text-sm text-slate-600 font-semibold">Skills Match</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-600 mb-1">{job.experienceMatch}%</div>
                      <div className="text-sm text-slate-600 font-semibold">Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600 mb-1">{job.educationMatch}%</div>
                      <div className="text-sm text-slate-600 font-semibold">Education</div>
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-brand-600" />
                    <span>Required Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {job.requirements.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-brand-100 to-violet-100 text-brand-800 rounded-2xl text-sm font-bold border border-brand-200 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {testResult && (
                  <div className={`mb-8 p-6 rounded-3xl border ${
                    testResult.passed 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-rose-50 border-rose-200'
                  }`}>
                    <h4 className="font-bold text-slate-900 text-lg mb-3 flex items-center space-x-2">
                      <Award className="h-5 w-5 text-emerald-600" />
                      <span>Assessment Results</span>
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-bold text-lg ${testResult.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          Score: {testResult.score}% ({testResult.correctAnswers}/{testResult.totalQuestions} correct)
                        </p>
                        <p className={`text-sm font-medium ${testResult.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {testResult.passed ? '✅ Assessment Passed' : '❌ Assessment Failed'}
                        </p>
                      </div>
                      {testResult.passed && (
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                  <div className="flex items-center space-x-2">
                    {job.matchScore && (
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getMatchColor(job.matchScore)}`}>
                        {getMatchLabel(job.matchScore)}
                      </span>
                    )}
                    <span className="text-sm text-slate-500 font-medium">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="lg"
                      icon={ExternalLink}
                    >
                      View Details
                    </Button>
                    
                    {appliedJobs.has(job._id) ? (
                      <Button
                        variant="success"
                        size="lg"
                        icon={Calendar}
                        disabled
                      >
                        Interview Requested
                      </Button>
                    ) : (
                      <Button
                        onClick={() => startApplication(job)}
                        size="lg"
                        icon={testResults.get(job._id)?.passed ? Calendar : Play}
                        className="group"
                        variant={testResults.get(job._id)?.passed ? 'secondary' : 'primary'}
                      >
                        <span>
                          {testResults.get(job._id)?.passed 
                            ? 'Schedule Interview' 
                            : 'Take Assessment & Apply'
                          }
                        </span>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {jobs.length > 0 && (
        <Card className="gradient-brand text-white shadow-large border-0 relative overflow-hidden" padding="xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h3>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Complete technical assessments and schedule interviews to land your dream job. 
              Our AI will help you stand out from the competition.
            </p>
            <div className="flex justify-center space-x-6">
              <Button
                variant="secondary"
                size="xl"
                onClick={() => window.location.href = '/upload'}
                className="bg-white text-brand-600 hover:bg-slate-100"
              >
                Update Resume
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white hover:text-brand-600"
                onClick={() => window.location.href = '/candidate-dashboard'}
              >
                View Applications
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}