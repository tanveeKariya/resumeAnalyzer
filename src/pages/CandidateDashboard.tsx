import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Video, CheckCircle, AlertCircle, User, Award, Zap, Brain, Target, Play } from 'lucide-react';
import { InterviewService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Interview {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  recruiterId: {
    _id: string;
    name: string;
    email: string;
  };
  scheduledDateTime: string;
  duration: number;
  type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLink?: string;
  notes?: string;
  candidateBrief?: string;
  slotExpiresAt: string;
  feedback?: {
    rating: number;
    comments: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  };
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewRequests, setInterviewRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user?.role === 'candidate') {
      loadInterviews();
      loadInterviewRequests();
    }
  }, [user]);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const response = await InterviewService.getUserInterviews();
      if (response.success) {
        setInterviews(response.data);
      }
    } catch (error) {
      console.error('Failed to load interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInterviewRequests = () => {
    const stored = localStorage.getItem('career_ai_interview_requests') || '[]';
    const requests = JSON.parse(stored);
    setInterviewRequests(requests);
  };

  const respondToInterview = async (interviewId: string, response: 'accept' | 'decline') => {
    try {
      setLoading(true);
      const result = await InterviewService.respondToInterview(interviewId, response);
      if (result.success) {
        await loadInterviews();
        alert(`Interview ${response}ed successfully!`);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${response} interview`);
    } finally {
      setLoading(false);
    }
  };

  const upcomingInterviews = interviews.filter(i => 
    i.status !== 'completed' && new Date(i.scheduledDateTime) > new Date()
  );
  const pastInterviews = interviews.filter(i => 
    i.status === 'completed' || new Date(i.scheduledDateTime) <= new Date()
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed': return 'bg-brand-100 text-brand-800 border-brand-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'text-amber-500' : 'text-slate-300'}>
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center space-x-4">
          <div className="w-16 h-16 gradient-brand rounded-3xl flex items-center justify-center shadow-large">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <span>My Interviews</span>
        </h1>
        <p className="text-slate-600 text-xl font-medium">Manage your interview schedule and track your progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="group cursor-pointer" hover glass padding="lg" shadow="medium">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 gradient-brand rounded-3xl flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-slate-900">{upcomingInterviews.length}</span>
          </div>
          <div>
            <p className="text-slate-900 font-bold text-lg mb-2">Upcoming</p>
            <p className="text-sm text-brand-600 font-medium">
              {upcomingInterviews.length > 0 
                ? `Next: ${formatDate(upcomingInterviews[0].scheduledDateTime)}` 
                : 'None scheduled'
              }
            </p>
          </div>
        </Card>

        <Card className="group cursor-pointer" hover glass padding="lg" shadow="medium">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-slate-900">{pastInterviews.length}</span>
          </div>
          <div>
            <p className="text-slate-900 font-bold text-lg mb-2">Completed</p>
            <p className="text-sm text-emerald-600 font-medium">
              {pastInterviews.length > 0 ? 'Recently completed' : 'No completed interviews'}
            </p>
          </div>
        </Card>

        <Card className="group cursor-pointer" hover glass padding="lg" shadow="medium">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-slate-900">
              {interviewRequests.filter((r: any) => r.status === 'pending').length}
            </span>
          </div>
          <div>
            <p className="text-slate-900 font-bold text-lg mb-2">Pending Requests</p>
            <p className="text-sm text-amber-600 font-medium">Awaiting HR confirmation</p>
          </div>
        </Card>

        <Card className="group cursor-pointer" hover glass padding="lg" shadow="medium">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <Award className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-slate-900">
              {pastInterviews.filter(i => i.feedback && i.feedback.rating >= 4).length}
            </span>
          </div>
          <div>
            <p className="text-slate-900 font-bold text-lg mb-2">Positive Feedback</p>
            <p className="text-sm text-violet-600 font-medium">High-rated interviews</p>
          </div>
        </Card>
      </div>

      {/* Interview Requests */}
      {interviewRequests.length > 0 && (
        <Card glass padding="xl" shadow="large" className="border border-white/20">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <Target className="h-6 w-6 text-amber-600" />
            <span>Pending Interview Requests</span>
          </h2>
          <div className="space-y-4">
            {interviewRequests.filter((r: any) => r.status === 'pending').map((request: any) => (
              <div key={request._id} className="p-6 glass rounded-2xl border border-amber-200/60 bg-amber-50/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Interview Request Submitted</h4>
                    <p className="text-slate-600 font-medium">Waiting for recruiter confirmation</p>
                    <p className="text-sm text-amber-600 font-medium mt-1">
                      Expires: {new Date(request.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Upcoming Interviews */}
      <Card glass padding="xl" shadow="large" className="border border-white/20">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
          <Zap className="h-6 w-6 text-brand-600" />
          <span>Upcoming Interviews</span>
        </h2>
        {upcomingInterviews.length > 0 ? (
          <div className="space-y-6">
            {upcomingInterviews.map((interview) => (
              <div key={interview._id} className="glass rounded-2xl p-8 shadow-medium border border-white/20 hover:shadow-large transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="font-bold text-slate-900 text-2xl">{interview.jobId.title}</h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-soft border ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>
                    <p className="text-brand-600 font-semibold text-lg mb-4">{interview.jobId.company}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-slate-700">
                          <Calendar className="h-5 w-5 text-brand-600" />
                          <span className="font-medium text-lg">{formatDate(interview.scheduledDateTime)}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-700">
                          <Clock className="h-5 w-5 text-brand-600" />
                          <span className="font-medium text-lg">{formatTime(interview.scheduledDateTime)} ({interview.duration} min)</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-700">
                          <MapPin className="h-5 w-5 text-brand-600" />
                          <span className="font-medium">{interview.jobId.location}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-slate-700">
                          <User className="h-5 w-5 text-brand-600" />
                          <span className="font-medium">{interview.recruiterId.name}</span>
                        </div>
                        <p className="text-slate-700">
                          <span className="font-semibold">Type:</span> <span className="capitalize font-medium">{interview.type} Interview</span>
                        </p>
                        {interview.meetingLink && (
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-brand-600 hover:text-brand-700 font-semibold transition-colors"
                          >
                            <Video className="h-5 w-5 mr-2" />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>

                    {interview.notes && (
                      <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl mb-6">
                        <p className="text-brand-800 font-medium">
                          <span className="font-bold">Note:</span> {interview.notes}
                        </p>
                      </div>
                    )}

                    {interview.status === 'pending' && (
                      <div className="flex space-x-4">
                        <Button
                          onClick={() => respondToInterview(interview._id, 'accept')}
                          disabled={loading}
                          variant="secondary"
                          loading={loading}
                          icon={CheckCircle}
                          size="lg"
                        >
                          Accept Interview
                        </Button>
                        <Button
                          onClick={() => respondToInterview(interview._id, 'decline')}
                          disabled={loading}
                          variant="danger"
                          loading={loading}
                          icon={AlertCircle}
                          size="lg"
                        >
                          Decline
                        </Button>
                        <div className="flex items-center text-sm text-slate-600 font-medium">
                          <Clock className="h-4 w-4 mr-1" />
                          Expires: {formatDate(interview.slotExpiresAt)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Upcoming Interviews</h3>
            <p className="text-slate-600 text-lg mb-8">
              You don't have any interviews scheduled at the moment.
            </p>
            <Button onClick={() => window.location.href = '/matches'} size="lg" icon={Target}>
              Browse Job Matches
            </Button>
          </div>
        )}
      </Card>

      {/* Past Interviews */}
      <Card glass padding="xl" shadow="large" className="border border-white/20">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
          <Brain className="h-6 w-6 text-violet-600" />
          <span>Interview History</span>
        </h2>
        {pastInterviews.length > 0 ? (
          <div className="space-y-6">
            {pastInterviews.map((interview) => (
              <div key={interview._id} className="glass rounded-2xl p-8 shadow-medium border border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-xl mb-2">{interview.jobId.title}</h3>
                    <p className="text-slate-700 font-medium text-lg">{interview.jobId.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mt-3">
                      <span className="font-medium">{formatDate(interview.scheduledDateTime)}</span>
                      <span>•</span>
                      <span className="font-medium">with {interview.recruiterId.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {interview.feedback?.rating && (
                      <>
                        <div className="flex items-center space-x-1 mb-2">
                          {getRatingStars(interview.feedback.rating)}
                        </div>
                        <span className="text-sm text-slate-500 font-medium">{interview.feedback.rating}/5.0</span>
                      </>
                    )}
                  </div>
                </div>
                
                {interview.feedback?.comments && (
                  <div className="p-6 glass rounded-2xl border border-brand-200/60 bg-brand-50/30">
                    <p className="text-slate-800 font-medium mb-4">
                      <span className="font-bold text-brand-800">Feedback:</span> {interview.feedback.comments}
                    </p>
                    {interview.feedback.strengths.length > 0 && (
                      <div>
                        <span className="font-bold text-emerald-700">Strengths:</span>
                        <ul className="text-emerald-700 ml-4 font-medium mt-2">
                          {interview.feedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Brain className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Interview History</h3>
            <p className="text-slate-600 text-lg mb-8">Your completed interviews will appear here.</p>
            <Button onClick={() => window.location.href = '/matches'} size="lg" icon={Play}>
              Start Applying to Jobs
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}