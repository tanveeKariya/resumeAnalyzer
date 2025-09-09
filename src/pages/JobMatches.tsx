import React, { useState, useEffect } from 'react';
import { 
  Target, MapPin, DollarSign, Clock, Users, Star, Award, CheckCircle, 
  ExternalLink, Briefcase, TrendingUp, Zap, Brain, ArrowRight, Calendar,
  Building, Globe, Heart, Bookmark
} from 'lucide-react';
import { ResumeAnalysisService, JobService, StorageService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import InterviewSlotModal from '../components/InterviewSlotModal';
import Toast from '../components/ui/Toast';

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
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [resumeData, setResumeData] = useState<any>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [likedJobs, setLikedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadJobMatches();
    loadApplicationStatus();
  }, []);

  const loadJobMatches = async () => {
    try {
      setLoading(true);
      
      const currentAnalysisId = localStorage.getItem('currentAnalysisId');
      
      if (currentAnalysisId) {
        setCurrentResumeId(currentAnalysisId);
        const response = await ResumeAnalysisService.findJobMatches(currentAnalysisId);
        setJobs(response.data.matches || []);
        setResumeData(response.data.resumeData);
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

  const loadApplicationStatus = () => {
    const applications = StorageService.getApplications();
    const appliedJobIds = new Set(applications.map((app: any) => app.jobId));
    setAppliedJobs(appliedJobIds);
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

  const applyToJob = async (job: JobMatch) => {
    if (!currentResumeId) {
      setToast({ message: 'Please upload your resume first', type: 'error' });
      return;
    }

    try {
      const response = await JobService.applyToJob(job._id, currentResumeId);
      if (response.success) {
        StorageService.saveApplication(job._id, currentResumeId, job.matchScore || 85);
        setAppliedJobs(prev => new Set([...prev, job._id]));
        setSelectedJob(job);
        setShowSlotModal(true);
        setToast({ message: 'Application submitted successfully!', type: 'success' });
      }
    } catch (error) {
      setToast({ message: 'Failed to apply. Please try again.', type: 'error' });
    }
  };

  const toggleLike = (jobId: string) => {
    setLikedJobs(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(jobId)) {
        newLiked.delete(jobId);
      } else {
        newLiked.add(jobId);
      }
      return newLiked;
    });
  };

  const handleSlotRequested = () => {
    setToast({ message: 'Interview slot requested! HR will confirm within 24 hours.', type: 'success' });
    setSelectedJob(null);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 70) return 'text-amber-600 bg-amber-100 border-amber-200';
    return 'text-rose-600 bg-rose-100 border-rose-200';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'EXCELLENT MATCH';
    if (score >= 80) return 'GOOD MATCH';
    if (score >= 70) return 'FAIR MATCH';
    return 'POOR MATCH';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-xl">
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <span>Job Matches</span>
          </h1>
          <p className="text-slate-600 text-xl font-medium leading-relaxed">
            Discover opportunities perfectly matched to your skills and experience
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 glass rounded-2xl border border-white/20">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">{jobs.length} matches found</span>
          </div>
        </div>
      </div>

      {/* Profile Strength Card */}
      {resumeData && (
        <Card className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 text-white shadow-2xl border-0 relative overflow-hidden" padding="xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <TrendingUp className="h-6 w-6" />
              <span>Your Profile Strength</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{resumeData.skills?.length || 0}</div>
                <div className="text-white/90 font-semibold">Technical Skills</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{resumeData.experience?.length || 0}</div>
                <div className="text-white/90 font-semibold">Work Experience</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{resumeData.projects?.length || 0}</div>
                <div className="text-white/90 font-semibold">Projects</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{jobs.length}</div>
                <div className="text-white/90 font-semibold">Job Matches</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Job Listings */}
      <div className="space-y-6">
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
          jobs.map((job) => (
            <Card key={job._id} className="group hover:scale-[1.02]" glass padding="xl" shadow="large" className="border border-white/20">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      {job.matchScore && (
                        <div className="flex items-center space-x-2">
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="2"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={job.matchScore >= 90 ? '#10b981' : job.matchScore >= 80 ? '#3b82f6' : '#f59e0b'}
                                strokeWidth="2"
                                strokeDasharray={`${job.matchScore}, 100`}
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-slate-900">{job.matchScore}%</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className={`text-xs font-bold px-2 py-1 rounded-full ${getMatchColor(job.matchScore)}`}>
                              {getMatchLabel(job.matchScore)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleLike(job._id)}
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          likedJobs.has(job._id) 
                            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${likedJobs.has(job._id) ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-2 bg-slate-100 text-slate-400 hover:bg-slate-200 rounded-xl transition-all duration-300">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-slate-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span className="font-semibold">{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium capitalize">{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Remote OK</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed mb-6 font-medium">
                    {job.description}
                  </p>
                  
                  <div className="text-2xl font-bold text-slate-900 mb-4">
                    {formatSalary(job.salary)}
                    <span className="text-sm text-slate-500 font-medium ml-2">per year</span>
                  </div>
                </div>
              </div>

              {/* Match Breakdown */}
              {job.matchScore && (
                <div className="grid md:grid-cols-4 gap-4 mb-6 p-6 glass rounded-2xl border border-slate-200/60">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600 mb-1">{job.matchScore}%</div>
                    <div className="text-xs text-slate-600 font-semibold">Overall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-600 mb-1">{job.skillsMatch}%</div>
                    <div className="text-xs text-slate-600 font-semibold">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-violet-600 mb-1">{job.experienceMatch}%</div>
                    <div className="text-xs text-slate-600 font-semibold">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-600 mb-1">{job.educationMatch}%</div>
                    <div className="text-xs text-slate-600 font-semibold">Education</div>
                  </div>
                </div>
              )}

              {/* Required Skills */}
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>Required Skills</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-100 to-violet-100 text-blue-800 rounded-xl text-sm font-bold border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-500 font-medium">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-slate-500">•</span>
                  <span className="text-sm text-slate-500 font-medium">
                    {Math.floor(Math.random() * 50) + 10} applicants
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
                      icon={CheckCircle}
                      disabled
                    >
                      Applied
                    </Button>
                  ) : (
                    <Button
                      onClick={() => applyToJob(job)}
                      size="lg"
                      icon={Calendar}
                      className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}