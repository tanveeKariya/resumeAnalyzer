import React, { useState } from 'react';
import { Calendar, Users, Clock, CheckCircle, Plus, Eye, Video, Award, Brain, Zap, Target, MapPin, DollarSign } from 'lucide-react';
import { JobService, InterviewService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface JobWithApplicants {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
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
    testScore?: number;
    testPassed?: boolean;
  }>;
  availableSlots?: string[];
}

export default function HRDashboard() {
  const { user } = useAuth();
  const [view, setView] = useState<'jobs' | 'applicants' | 'interviews' | 'slots'>('jobs');
  const [jobs, setJobs] = useState<JobWithApplicants[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

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
    degree: 'Bachelor',
    stream: ''
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
          degree: 'Bachelor',
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

  const manageSlots = (jobId: string) => {
    const job = jobs.find(j => j._id === jobId);
    if (job) {
      setSelectedJob(jobId);
      setAvailableSlots(job.availableSlots || []);
      setShowSlotsModal(true);
    }
  };

  const addTimeSlot = () => {
    const newSlot = new Date();
    newSlot.setDate(newSlot.getDate() + 1);
    newSlot.setHours(10, 0, 0, 0);
    setAvailableSlots([...availableSlots, newSlot.toISOString()]);
  };

  const removeTimeSlot = (index: number) => {
    setAvailableSlots(availableSlots.filter((_, i) => i !== index));
  };

  const saveSlots = () => {
    if (selectedJob) {
      const updatedJobs = jobs.map(job => 
        job._id === selectedJob 
          ? { ...job, availableSlots }
          : job
      );
      setJobs(updatedJobs);
      
      // Save to localStorage
      const stored = localStorage.getItem('career_ai_jobs') || '[]';
      const allJobs = JSON.parse(stored);
      const jobIndex = allJobs.findIndex((j: any) => j._id === selectedJob);
      if (jobIndex !== -1) {
        allJobs[jobIndex].availableSlots = availableSlots;
        localStorage.setItem('career_ai_jobs', JSON.stringify(allJobs));
      }
      
      setShowSlotsModal(false);
      alert('Interview slots updated successfully!');
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed': return 'bg-brand-100 text-brand-800 border-brand-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Job Modal */}
      {showCreateJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" glass padding="xl" shadow="large">
            <h3 className="text-3xl font-bold text-slate-900 mb-8 flex items-center space-x-3">
              <Plus className="h-8 w-8 text-brand-600" />
              <span>Post New Job</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Job Title"
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                placeholder="e.g. Senior Frontend Developer"
                required
                size="lg"
              />
              
              <Input
                label="Company"
                value={newJob.company}
                onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                placeholder="e.g. TechCorp Inc."
                required
                size="lg"
              />
              
              <Input
                label="Location"
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                placeholder="e.g. San Francisco, CA or Remote"
                required
                size="lg"
              />
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
                <select
                  value={newJob.type}
                  onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                  className="input-field text-lg"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <Input
                  label="Required Skills"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                  placeholder="React, JavaScript, TypeScript, Node.js (comma separated)"
                  required
                  size="lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Min Experience (years)"
                  value={newJob.experienceMin.toString()}
                  onChange={(e) => setNewJob({...newJob, experienceMin: parseInt(e.target.value) || 0})}
                  size="lg"
                />
                <Input
                  type="number"
                  label="Max Experience (years)"
                  value={newJob.experienceMax.toString()}
                  onChange={(e) => setNewJob({...newJob, experienceMax: parseInt(e.target.value) || 5})}
                  size="lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Min Salary ($)"
                  value={newJob.salaryMin.toString()}
                  onChange={(e) => setNewJob({...newJob, salaryMin: parseInt(e.target.value) || 50000})}
                  size="lg"
                />
                <Input
                  type="number"
                  label="Max Salary ($)"
                  value={newJob.salaryMax.toString()}
                  onChange={(e) => setNewJob({...newJob, salaryMax: parseInt(e.target.value) || 100000})}
                  size="lg"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  className="input-field text-lg"
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <Button
                onClick={createJob}
                disabled={loading}
                loading={loading}
                className="flex-1"
                size="xl"
              >
                {loading ? 'Creating Job...' : 'Post Job'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateJob(false)}
                className="flex-1"
                size="xl"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Slots Management Modal */}
      {showSlotsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" glass padding="xl" shadow="large">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-brand-600" />
              <span>Manage Interview Slots</span>
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-slate-900">Available Time Slots</h4>
                <Button size="sm" onClick={addTimeSlot} icon={Plus}>
                  Add Slot
                </Button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {availableSlots.map((slot, index) => {
                  const { date, time } = formatDateTime(slot);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 glass rounded-xl border border-slate-200/60">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-brand-600" />
                        <span className="font-medium text-slate-900">{date} at {time}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => removeTimeSlot(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={saveSlots} className="flex-1" size="lg">
                Save Slots
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSlotsModal(false)}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center space-x-4">
            <div className="w-16 h-16 gradient-brand rounded-3xl flex items-center justify-center shadow-large">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <span>HR Dashboard</span>
          </h1>
          <p className="text-slate-600 text-xl font-medium">Manage job postings, candidates, and interviews with AI assistance</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowCreateJob(true)}
            icon={Plus}
            size="lg"
          >
            Post Job
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <Card glass padding="lg" shadow="large" className="border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-brand-600" />
            <span>Management Dashboard</span>
          </h2>
          <div className="flex space-x-2">
            {[
              { key: 'jobs', label: 'My Jobs', icon: Briefcase },
              { key: 'applicants', label: 'Applicants', icon: Users },
              { key: 'interviews', label: 'Interviews', icon: Calendar },
              { key: 'slots', label: 'Time Slots', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key as any)}
                className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center space-x-2 ${
                  view === key 
                    ? 'gradient-brand text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {view === 'jobs' && (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="glass rounded-2xl p-8 shadow-medium border border-white/20 hover:shadow-large transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-2xl mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-6 text-slate-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">
                          ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium">
                      {job.applicants?.length || 0} applicants • {job.availableSlots?.length || 0} interview slots
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => manageSlots(job._id)}
                      icon={Clock}
                    >
                      Manage Slots
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(job._id);
                        setView('applicants');
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

        {view === 'applicants' && selectedJob && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setView('jobs')}
                size="sm"
              >
                ← Back to Jobs
              </Button>
              <h3 className="font-bold text-slate-900 text-xl">
                Applicants for {jobs.find(j => j._id === selectedJob)?.title}
              </h3>
            </div>
            
            {jobs.find(j => j._id === selectedJob)?.applicants?.map((applicant) => (
              <div key={applicant.userId._id} className="glass rounded-2xl p-8 shadow-medium border border-white/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h4 className="font-bold text-slate-900 text-xl">{applicant.userId.name}</h4>
                      <span className="px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm font-bold">
                        {applicant.matchScore}% Match
                      </span>
                      {applicant.testPassed && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">
                          Test Score: {applicant.testScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium mb-2">{applicant.userId.email}</p>
                    <p className="text-sm text-slate-500 mb-4">
                      Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                    </p>
                    {applicant.candidateBrief && (
                      <div className="p-4 bg-brand-50 rounded-xl border border-brand-200 mb-4">
                        <p className="text-brand-800 font-medium">{applicant.candidateBrief}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-3">
                    {applicant.testPassed ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Calendar}
                        onClick={() => {
                          // Schedule interview logic
                          alert('Interview scheduling feature will be implemented');
                        }}
                      >
                        Schedule Interview
                      </Button>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">
                        Awaiting Test Completion
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'interviews' && (
          <div className="space-y-6">
            {interviews.map((interview) => (
              <div key={interview._id} className="glass rounded-2xl p-8 shadow-medium border border-white/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-xl mb-2">
                      {interview.candidateId?.name} - {interview.jobId?.title}
                    </h4>
                    <p className="text-slate-700 font-medium mb-4">{interview.jobId?.company}</p>
                    <div className="flex items-center space-x-6 text-slate-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{new Date(interview.scheduledDateTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{new Date(interview.scheduledDateTime).toLocaleTimeString()}</span>
                      </div>
                      <span className="font-medium">{interview.duration} min</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-soft border ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:text-brand-700 text-sm font-semibold flex items-center space-x-1"
                      >
                        <Video className="h-4 w-4" />
                        <span>Join Meeting</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'slots' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Interview Slot Management</h3>
              <p className="text-slate-600 mb-8">
                Manage your available interview time slots. Candidates can request these slots for interviews.
              </p>
              <Button onClick={() => setShowSlotsModal(true)} icon={Plus} size="lg">
                Manage All Slots
              </Button>
            </div>
            
            {jobs.map((job) => (
              <div key={job._id} className="glass rounded-2xl p-6 shadow-medium border border-white/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                    <p className="text-slate-600">{job.availableSlots?.length || 0} available slots</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => manageSlots(job._id)}
                    icon={Calendar}
                  >
                    Manage Slots
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}