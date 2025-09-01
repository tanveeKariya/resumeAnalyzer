import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Video, CheckCircle, AlertCircle, User, Award, Zap, Brain } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user?.role === 'candidate') {
      loadInterviews();
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
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span>My Interviews</span>
        </h1>
        <p className="text-gray-600 text-lg">Manage your interview schedule and track your progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" gradient>
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{upcomingInterviews.length}</span>
          </div>
          <p className="text-gray-700 font-semibold mt-3 text-lg">Upcoming</p>
          <p className="text-sm text-blue-600 font-medium">
            {upcomingInterviews.length > 0 
              ? `Next: ${formatDate(upcomingInterviews[0].scheduledDateTime)}` 
              : 'None scheduled'
            }
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" gradient>
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{pastInterviews.length}</span>
          </div>
          <p className="text-gray-700 font-semibold mt-3 text-lg">Completed</p>
          <p className="text-sm text-green-600 font-medium">
            {pastInterviews.length > 0 ? 'Recently completed' : 'No completed interviews'}
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" gradient>
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {interviews.filter(i => i.status === 'pending').length}
            </span>
          </div>
          <p className="text-gray-700 font-semibold mt-3 text-lg">Pending Response</p>
          <p className="text-sm text-amber-600 font-medium">Awaiting your response</p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" gradient>
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {pastInterviews.filter(i => i.feedback && typeof i.feedback.rating === 'number' && i.feedback.rating >= 4).length}
            </span>
          </div>
          <p className="text-gray-700 font-semibold mt-3 text-lg">Positive Feedback</p>
          <p className="text-sm text-purple-600 font-medium">High-rated interviews</p>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      <Card className="p-8" gradient>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <span>Upcoming Interviews</span>
        </h2>
        {upcomingInterviews.length > 0 ? (
          <div className="space-y-6">
            {upcomingInterviews.map((interview) => (
              <div key={interview._id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">{interview.jobId.title}</h3>
                    <p className="text-blue-600 font-semibold text-lg">{interview.jobId.company}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(interview.status)}`}>
                    {interview.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(interview.scheduledDateTime)}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{formatTime(interview.scheduledDateTime)} ({interview.duration} min)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{interview.jobId.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Type:</span> <span className="capitalize font-medium">{interview.type} Interview</span>
                    </p>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{interview.recruiterId.name}</span>
                    </div>
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>

                {interview.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800 font-medium">
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
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => respondToInterview(interview._id, 'decline')}
                      disabled={loading}
                      variant="danger"
                      loading={loading}
                      icon={X}
                    >
                      Decline
                    </Button>
                    <div className="text-sm text-gray-600 flex items-center font-medium">
                      <Clock className="h-4 w-4 mr-1" />
                      Expires: {formatDate(interview.slotExpiresAt)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Interviews</h3>
            <p className="text-gray-500">You don't have any interviews scheduled at the moment.</p>
          </div>
        )}
      </Card>

      {/* Past Interviews */}
      <Card className="p-8" gradient>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span>Interview History</span>
        </h2>
        {pastInterviews.length > 0 ? (
          <div className="space-y-6">
            {pastInterviews.map((interview) => (
              <div key={interview._id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{interview.jobId.title}</h3>
                    <p className="text-gray-700 font-medium">{interview.jobId.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <span className="font-medium">{formatDate(interview.scheduledDateTime)}</span>
                      <span>•</span>
                      <span className="font-medium">with {interview.recruiterId.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {interview.feedback?.rating && (
                      <>
                        <div className="flex items-center space-x-1 mb-1">
                          {getRatingStars(interview.feedback.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{interview.feedback.rating}/5.0</span>
                      </>
                    )}
                  </div>
                </div>
                
                {interview.feedback?.comments && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-gray-800">
                      <span className="font-bold">Feedback:</span> {interview.feedback.comments}
                    </p>
                    {interview.feedback.strengths.length > 0 && (
                      <div className="mt-2">
                        <span className="font-bold text-green-700">Strengths:</span>
                        <ul className="text-sm text-green-700 ml-4 font-medium">
                          {interview.feedback.strengths.map((strength, index) => (
                            <li key={index}>• {strength}</li>
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
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Interview History</h3>
            <p className="text-gray-500">Your completed interviews will appear here.</p>
          </div>
        )}
      </Card>
    </div>
  );
}