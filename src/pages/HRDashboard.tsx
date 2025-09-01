import React, { useState } from 'react';
import { Calendar, Users, Clock, CheckCircle, Plus, Filter, Eye, MessageSquare, Video, Award, Brain, Zap } from 'lucide-react';
import { JobService, InterviewService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FeedbackModal from '../components/FeedbackModal';
import { GoogleMeetService } from '../services/googleMeetService';

interface JobWithApplicants {
  _id: string;
  title: string;
  company: string;
  location: string;
  applicants: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
      profile?: any;
    };
    resumeId: {
      _id: string;
      fileName: string;
      extractedData: any;
    };
    matchScore: number;
    appliedAt: string;
    status: string;
    candidateBrief?: string;
  }>;
}

export default function HRDashboard() {
  const { user } = useAuth();
  const [view, setView] = useState<'jobs' | 'applicants' | 'interviews'>('jobs');
  const [jobs, setJobs] = useState<JobWithApplicants[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [candidateFeedbackHistory, setCandidateFeedbackHistory] = useState<any[]>([]);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'full-time',
    skills: '',
    experienceMin: 0,
    experienceMax: 5,
    experienceLevel: 'mid',
    salaryMin: 50000,
    salaryMax: 100000,
    degree: '',
    stream: ''
  });

  const [newInterview, setNewInterview] = useState({
    scheduledDateTime: '',
    duration: 60,
    type: 'technical',
    meetingLink: '',
    notes: ''
  });

  React.useEffect(() => {
    if (user?.role === 'hr') {
      loadJobs();
      loadInterviews();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await JobService.getJobs();
      if (response.success) {
        setJobs(
          response.data.jobs.map((job: any) => ({
            ...job,
            applicants: (job.applicants || []).map((applicant: any) => ({
              ...applicant,
              userId: typeof applicant.userId === 'object' ? applicant.userId : { _id: applicant.userId, name: '', email: '' },
              resumeId: typeof applicant.resumeId === 'object' ? applicant.resumeId : { _id: applicant.resumeId, fileName: '', extractedData: {} }
            }))
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJobApplicants = async (jobId: string) => {
    try {
      const response = await JobService.getJobApplicants(jobId);
      if (response.success) {
        const updatedJobs = jobs.map(job => 
          job._id === jobId 
            ? { ...job, applicants: response.data.applicants }
            : job
        );
        setJobs(updatedJobs);
      }
    } catch (error) {
      console.error('Failed to load applicants:', error);
    }
  };

  const loadInterviews = async () => {
    try {
      const response = await InterviewService.getUserInterviews();
      if (response.success) {
        setInterviews(response.data);
      }
    } catch (error) {
      console.error('Failed to load interviews:', error);
    }
  };

  const createJob = async () => {
    try {
      setLoading(true);
      const jobData = {
        title: newJob.title,
        company: newJob.company,
        description: newJob.description,
        location: newJob.location,
        type: newJob.type,
        requirements: {
          skills: newJob.skills.split(',').map(s => s.trim()),
          experience: {
            min: newJob.experienceMin,
            max: newJob.experienceMax,
            level: newJob.experienceLevel
          },
          education: {
            degree: newJob.degree,
            stream: newJob.stream.split(',').map(s => s.trim())
          }
        },
        salary: {
          min: newJob.salaryMin,
          max: newJob.salaryMax,
          currency: 'USD'
        }
      };

      const response = await JobService.createJob(jobData);
      if (response.success) {
        setJobs([{ ...response.data, applicants: [] }, ...jobs]);
        setShowCreateJob(false);
        setNewJob({
          title: '',
          company: '',
          description: '',
          location: '',
          type: 'full-time',
          skills: '',
          experienceMin: 0,
          experienceMax: 5,
          experienceLevel: 'mid',
          salaryMin: 50000,
          salaryMax: 100000,
          degree: '',
          stream: ''
        });
        alert('Job posted successfully!');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const scheduleInterview = async () => {
    if (!selectedCandidate || !selectedJob) return;

    try {
      setLoading(true);
      
      // Create Google Meet link
      const meetingLink = await GoogleMeetService.createMeetingLink(
        `Interview: ${jobs.find(j => j._id === selectedJob)?.title} - ${selectedCandidate.userId.name}`,
        newInterview.scheduledDateTime,
        newInterview.duration,
        [selectedCandidate.userId.email, user?.email || '']
      );
      
      const interviewData = {
        jobId: selectedJob,
        candidateId: selectedCandidate.userId._id,
        resumeId: selectedCandidate.resumeId._id,
        scheduledDateTime: newInterview.scheduledDateTime,
        duration: newInterview.duration,
        type: newInterview.type,
        meetingLink,
        notes: newInterview.notes
      };

      const response = await InterviewService.scheduleInterview(interviewData);
      if (response.success) {
        setInterviews([response.data, ...interviews]);
        setShowScheduleModal(false);
        setSelectedCandidate(null);
        setNewInterview({
          scheduledDateTime: '',
          duration: 60,
          type: 'technical',
          meetingLink: '',
          notes: ''
        });
        alert('Interview scheduled successfully!');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const endMeeting = async (interviewId: string) => {
    try {
      const response = await InterviewService.endMeeting(interviewId);
      if (response.success) {
        const interview = interviews.find(i => i._id === interviewId);
        setSelectedInterview(interview);
        setShowFeedbackModal(true);
        await loadInterviews();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to end meeting');
    }
  };

  const submitFeedback = async (feedbackData: any) => {
    if (!selectedInterview) return;
    
    try {
      const response = await InterviewService.submitFeedback(selectedInterview._id, feedbackData);
      if (response.success) {
        await loadInterviews();
        alert('Feedback submitted successfully!');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const loadCandidateFeedbackHistory = async (candidateId: string) => {
    try {
      const response = await InterviewService.getCandidateFeedbackHistory(candidateId);
      if (response.success) {
        setCandidateFeedbackHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to load feedback history:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'completed': return 'bg-primary-100 text-primary-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSelectedInterview(null);
        }}
        candidateName={selectedInterview?.candidateId?.name || ''}
        jobTitle={selectedInterview?.jobId?.title || ''}
        onSubmit={submitFeedback}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span>HR Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg">Manage job postings, candidates, and interviews with AI assistance</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowCreateJob(true)}
            icon={Plus}
          >
            Post Job
          </Button>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateJob && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Plus className="h-6 w-6 text-blue-600" />
              <span>Post New Job</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Job Title *"
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              
              <input
                type="text"
                placeholder="Company *"
                value={newJob.company}
                onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <input
                type="text"
                placeholder="Location *"
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              
              <input
                type="text"
                placeholder="Required Skills (comma separated) *"
                value={newJob.skills}
                onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                className="md:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Experience (years)"
                  value={newJob.experienceMin}
                  onChange={(e) => setNewJob({...newJob, experienceMin: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max Experience (years)"
                  value={newJob.experienceMax}
                  onChange={(e) => setNewJob({...newJob, experienceMax: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Salary"
                  value={newJob.salaryMin}
                  onChange={(e) => setNewJob({...newJob, salaryMin: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max Salary"
                  value={newJob.salaryMax}
                  onChange={(e) => setNewJob({...newJob, salaryMax: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <textarea
                placeholder="Job Description *"
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-4 mt-8">
              <Button
                onClick={createJob}
                disabled={loading}
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Post Job'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateJob(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Schedule Interview</span>
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 font-semibold">Candidate: {selectedCandidate.userId.name}</p>
              <p className="text-blue-700 text-sm">Google Meet link will be generated automatically</p>
            </div>
            
            <div className="space-y-6">
              <input
                type="datetime-local"
                value={newInterview.scheduledDateTime}
                onChange={(e) => setNewInterview({...newInterview, scheduledDateTime: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              
              <select
                value={newInterview.type}
                onChange={(e) => setNewInterview({...newInterview, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="technical">Technical Interview</option>
                <option value="hr">HR Interview</option>
                <option value="behavioral">Behavioral Interview</option>
                <option value="final">Final Interview</option>
              </select>
              
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={newInterview.duration}
                onChange={(e) => setNewInterview({...newInterview, duration: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              
              <textarea
                placeholder="Notes"
                value={newInterview.notes}
                onChange={(e) => setNewInterview({...newInterview, notes: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-4 mt-8">
              <Button
                onClick={scheduleInterview}
                disabled={loading}
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Scheduling...' : 'Schedule'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedCandidate(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* View Toggle */}
      <Card className="p-8" gradient>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span>Management Dashboard</span>
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setView('jobs')}
              className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                view === 'jobs' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              My Jobs
            </button>
            <button
              onClick={() => setView('applicants')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'applicants' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Applicants
            </button>
            <button
              onClick={() => setView('interviews')}
              className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                view === 'interviews' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              Interviews
            </button>
          </div>
        </div>

        {view === 'jobs' && (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-xl">{job.title}</h3>
                    <p className="text-gray-700 font-medium text-lg">{job.company} • {job.location}</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">
                      {job.applicants?.length || 0} applicants
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(job._id);
                        setView('applicants');
                        loadJobApplicants(job._id);
                      }}
                      icon={Eye}
                    >
                      View Applicants
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'applicants' && (
          <div className="space-y-4">
            {selectedJob ? (
              <>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => setView('jobs')}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    ← Back to Jobs
                  </button>
                  <h3 className="font-semibold text-gray-900">
                    Applicants for {jobs.find(j => j._id === selectedJob)?.title}
                  </h3>
                </div>
                
                {jobs.find(j => j._id === selectedJob)?.applicants?.map((applicant) => (
                  <div key={applicant.userId._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{applicant.userId.name}</h4>
                        <p className="text-gray-600">{applicant.userId.email}</p>
                        <p className="text-sm text-primary-600 font-medium">
                          Match Score: {applicant.matchScore}%
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                        </p>
                        {applicant.candidateBrief && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">{applicant.candidateBrief}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedCandidate(applicant);
                            setShowScheduleModal(true);
                          }}
                          className="px-3 py-1 text-sm bg-secondary-600 text-white rounded hover:bg-secondary-700 transition-colors flex items-center space-x-1"
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Schedule</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a job to view applicants</p>
            )}
          </div>
        )}

        {view === 'interviews' && (
          <div className="space-y-6">
            {interviews.map((interview) => (
              <div key={interview._id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {interview.candidateId?.name} - {interview.jobId?.title}
                    </h4>
                    <p className="text-gray-700 font-medium">{interview.jobId?.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-700 mt-2">
                      <span className="font-medium">{new Date(interview.scheduledDateTime).toLocaleDateString()}</span>
                      <span className="font-medium">{new Date(interview.scheduledDateTime).toLocaleTimeString()}</span>
                      <span className="font-medium">{interview.duration} min</span>
                    </div>
                    {interview.candidateBrief && (
                      <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm text-blue-800 font-medium">{interview.candidateBrief}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-lg ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                    {interview.meetingLink && (
                      <div className="flex flex-col space-y-2">
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-1"
                        >
                          <Video className="h-4 w-4" />
                          <span>Join Meeting</span>
                        </a>
                        {interview.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => endMeeting(interview._id)}
                            icon={CheckCircle}
                          >
                            End Meeting
                          </Button>
                        )}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => loadCandidateFeedbackHistory(interview.candidateId._id)}
                      >
                      View History
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}