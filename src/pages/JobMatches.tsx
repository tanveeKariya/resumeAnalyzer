import React, { useState } from 'react';
import { Target, Calendar, TrendingUp, RefreshCw, Download, CheckCircle, MapPin, DollarSign, Clock, Award, Zap } from 'lucide-react';
import { JobService, ResumeAnalysisService, JobMatchingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TestModal from '../components/TestModal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface JobMatch {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: {
    skills: string[];
    experience: {
      min: number;
      max: number;
      level: string;
    };
    education: {
      degree: string;
      stream: string[];
      cgpa?: number;
    };
  };
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  matchScore?: number;
  skillsMatch?: number;
  experienceMatch?: number;
  educationMatch?: number;
  matchingSkills?: string[];
  missingSkills?: string[];
}

export default function JobMatches() {
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedJobForTest, setSelectedJobForTest] = useState<JobMatch | null>(null);

  React.useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await JobService.getJobs();
      if (response.success) {
        setJobMatches(response.data.jobs);
        setAnalyzed(true);
      }
    } catch (error: any) {
      console.error('Failed to load jobs:', error);
      setError('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToJob = async (job: JobMatch) => {
    try {
      setLoading(true);
      // Show test modal instead of direct application
      setSelectedJobForTest(job);
      setShowTestModal(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to initiate application');
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = async (score: number, passed: boolean) => {
    if (passed && selectedJobForTest) {
      try {
        const resumeAnalyses = await ResumeAnalysisService.getUserResumes();
        
        if (!resumeAnalyses.success || resumeAnalyses.data.length === 0) {
          setError('Please upload and analyze a resume first');
          return;
        }

        const latestResume = resumeAnalyses.data[resumeAnalyses.data.length - 1];
        const response = await JobMatchingService.applyToJob(selectedJobForTest._id, latestResume._id);
        
        if (response.success) {
          setError('');
          // Show success message in a better way
          setTimeout(() => {
            alert(`Congratulations! You passed the test with ${score}% and your application has been forwarded to the recruiter.`);
          }, 500);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to submit application');
      }
    } else {
      setError(`Test score: ${score}%. Minimum 95% required to proceed with application.`);
    }
    setShowTestModal(false);
    setSelectedJobForTest(null);
  };
  const handleScheduleInterview = (job: JobMatch) => {
    alert(`Interview scheduling for ${job.title} at ${job.company} - Feature will open scheduling modal`);
  };

  const handleDownloadMatches = () => {
    if (jobMatches.length > 0) {
      const dataStr = JSON.stringify(jobMatches, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-matches-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getMatchColor = (score: number = 75) => {
    if (score >= 90) return 'text-success-600 bg-success-50';
    if (score >= 80) return 'text-primary-600 bg-primary-50';
    if (score >= 70) return 'text-accent-600 bg-accent-50';
    return 'text-warning-600 bg-warning-50';
  };

  const formatSalary = (salary: any) => {
    if (salary?.min && salary?.max) {
      return `${salary.currency || '$'}${salary.min.toLocaleString()} - ${salary.currency || '$'}${salary.max.toLocaleString()}`;
    }
    return 'Salary not specified';
  };

  return (
    <div className="space-y-6">
      <TestModal
        isOpen={showTestModal}
        onClose={() => {
          setShowTestModal(false);
          setSelectedJobForTest(null);
        }}
        jobTitle={selectedJobForTest?.title || ''}
        jobId={selectedJobForTest?._id || ''}
        onTestComplete={handleTestComplete}
      />

      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <span>Job Opportunities</span>
        </h1>
        <p className="text-gray-600 text-lg">Discover positions that match your profile and take the assessment to apply</p>
      </div>

      {/* Match Summary */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl border-0">
        <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Available Positions</h2>
            </div>
            <p className="opacity-90 text-lg">
              {analyzed 
                ? `We found ${jobMatches.length} positions that match your profile`
                : 'Loading available job positions...'
              }
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-500 bg-opacity-20 rounded-xl border border-red-300">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
          <div className="text-right">
            {analyzed && jobMatches.length > 0 && (
              <>
                <div className="text-4xl font-bold mb-1">{jobMatches.length}</div>
                <div className="text-sm opacity-90 mb-4">Open Positions</div>
                <Button
                  variant="outline"
                  onClick={handleDownloadMatches}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  icon={Download}
                >
                  Export
                </Button>
              </>
            )}
            {!analyzed && (
              <Button
                onClick={loadJobs}
                disabled={loading}
                loading={loading}
                className="bg-white text-blue-600 hover:bg-gray-50"
                icon={loading ? RefreshCw : Target}
              >
                {loading ? 'Loading...' : 'Load Jobs'}
              </Button>
            )}
          </div>
        </div>
        </div>
      </Card>

      {/* Job Cards */}
      {analyzed && jobMatches.length > 0 ? (
        <div className="grid gap-8">
          {jobMatches.map((job) => (
            <Card
              key={job._id}
              className={`transition-all cursor-pointer transform hover:-translate-y-1 ${
                selectedJob === job._id ? 'border-blue-300 shadow-xl ring-2 ring-blue-100' : 'hover:shadow-xl'
              }`}
              hover
              onClick={() => setSelectedJob(selectedJob === job._id ? null : job._id)}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getMatchColor(job.matchScore || 75)}`}>
                        {job.matchScore || 75}% Match
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <span className="font-semibold text-lg">{job.company}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <span>•</span>
                      <span className="capitalize">{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600 font-bold text-lg">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      (job.matchScore || 75) >= 90 ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <TrendingUp className={`h-8 w-8 ${(job.matchScore || 75) >= 90 ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed line-clamp-3">{job.description}</p>
                </div>

                {/* Required Skills */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span>Required Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Requirements */}
                <div className="mb-6 flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">Experience:</span> 
                  <span>{job.requirements.experience.min}-{job.requirements.experience.max} years ({job.requirements.experience.level} level)</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyToJob(job);
                    }}
                    disabled={loading}
                    variant="secondary"
                    className="flex-1"
                    icon={CheckCircle}
                  >
                    Take Test & Apply
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScheduleInterview(job);
                    }}
                    variant="outline"
                    icon={Calendar}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : analyzed && jobMatches.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Opportunities Found</h3>
          <p className="text-gray-500">No job opportunities found. Please check back later or update your profile.</p>
        </Card>
      ) : null}
    </div>
  );
}

        </div>
      ) : null}
    </div>
  );
}