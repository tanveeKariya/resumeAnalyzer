import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Upload, Target, Calendar, MessageSquare, TrendingUp, Users, Clock, CheckCircle,
  BarChart3, FileText, Star, Award, Zap, Brain, Shield, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = React.useState<any>({});


  React.useEffect(() => {
    // Get real statistics from storage
    const statistics = StorageService.getStatistics();
    setStats(statistics);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  const candidateStats = [
    {
      label: 'Resumes Uploaded',
      value: stats.totalResumes?.toString() || '0',
      icon: Upload,
      color: 'bg-primary-500',
      change: stats.totalResumes > 0 ? `${stats.totalResumes} total uploaded` : 'Upload your first resume'
    },
    {
      label: 'Job Matches',
      value: stats.totalMatches?.toString() || '0',
      icon: Target,
      color: 'bg-secondary-500',
      change: stats.averageMatchScore > 0 ? `${stats.averageMatchScore}% avg match` : 'No matches yet'
    },
    {
      label: 'Interviews Scheduled',
      value: stats.pendingInterviews?.toString() || '0',
      icon: Calendar,
      color: 'bg-accent-500',
      change: stats.confirmedInterviews > 0 ? `${stats.confirmedInterviews} confirmed` : 'No interviews scheduled'
    },
    {
      label: 'Applications',
      value: (stats.totalMatches * 2)?.toString() || '0',
      icon: CheckCircle,
      color: 'bg-success-500',
      change: stats.totalMatches > 0 ? `${Math.floor(stats.totalMatches * 0.6)} in progress` : 'No applications yet'
    }
  ];

  const hrStats = [
    {
      label: 'Candidates Reviewed',
      value: stats.totalResumes?.toString() || '0',
      icon: Users,
      color: 'bg-primary-500',
      change: stats.totalResumes > 0 ? `${stats.totalResumes} total reviewed` : 'No candidates yet'
    },
    {
      label: 'Shortlisted',
      value: Math.floor(stats.totalResumes * 0.6)?.toString() || '0',
      icon: Target,
      color: 'bg-secondary-500',
      change: stats.totalResumes > 0
        ? `${Math.round((Math.floor(stats.totalResumes * 0.6) / stats.totalResumes) * 100)}% rate`
        : '0% rate'
    },
    {
      label: 'Interviews Today',
      value: stats.pendingInterviews?.toString() || '0',
      icon: Calendar,
      color: 'bg-accent-500',
      change: stats.completedInterviews > 0 ? `${stats.completedInterviews} completed` : 'No interviews today'
    },
    {
      label: 'Avg. Response Time',
      value: '2.3h',
      icon: Clock,
      color: 'bg-success-500',
      change: '-15% this week'
    }
  ];

  const displayStats = user?.role === 'hr' ? hrStats : candidateStats;

  const quickActions = user?.role === 'hr'
    ? [
        { label: 'Review Candidates', path: '/matches', icon: Users, color: 'bg-primary-500' },
        { label: 'Schedule Interviews', path: '/hr-dashboard', icon: Calendar, color: 'bg-secondary-500' },
        { label: 'Analyze Feedback', path: '/feedback', icon: MessageSquare, color: 'bg-accent-500' }
      ]
    : [
        { label: 'Upload Resume', path: '/upload', icon: Upload, color: 'bg-primary-500' },
        { label: 'View Matches', path: '/matches', icon: Target, color: 'bg-secondary-500' },
        { label: 'My Interviews', path: '/candidate-dashboard', icon: Calendar, color: 'bg-accent-500' }
      ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl border-0">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {user?.name || 'Guest'}!</h1>
              <p className="opacity-90 text-lg">
          {user?.role === 'hr'
                ? 'Manage your recruitment pipeline with AI-powered insights.'
            : user?.role === 'candidate'
                ? 'Discover your next career opportunity with AI assistance.'
                : 'Welcome to CareerAI - your intelligent career assistant.'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" hover gradient>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${stat.color.replace('bg-', 'bg-gradient-to-br from-').replace('-500', '-500 to-').replace('500', '600')} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-gray-700 font-semibold mb-2 text-lg">{stat.label}</p>
              <p className="text-sm text-green-600 font-medium">{stat.change}</p>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-8" gradient>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className="flex items-center p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group shadow-sm hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${action.color.replace('bg-', 'bg-gradient-to-br from-').replace('-500', '-500 to-').replace('500', '600')} rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-blue-700 text-lg">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-8" gradient>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span>Recent Activity</span>
        </h2>
        <div className="space-y-4">
          {user?.role === 'hr' ? (
            <>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">New candidate applications</p>
                  <p className="text-sm text-blue-700">{stats.totalResumes || 0} resumes analyzed this week</p>
                </div>
                <span className="text-sm text-blue-600 ml-auto font-medium">2h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Interview completed</p>
                  <p className="text-sm text-purple-700">{stats.completedInterviews || 0} interviews completed</p>
                </div>
                <span className="text-sm text-purple-600 ml-auto font-medium">4h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Feedback analyzed</p>
                  <p className="text-sm text-emerald-700">{stats.totalFeedbacks || 0} feedback analyses completed</p>
                </div>
                <span className="text-sm text-emerald-600 ml-auto font-medium">1d ago</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">New job matches found</p>
                  <p className="text-sm text-blue-700">{stats.totalMatches || 0} positions match your profile</p>
                </div>
                <span className="text-sm text-blue-600 ml-auto font-medium">1h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Interview scheduled</p>
                  <p className="text-sm text-purple-700">{stats.pendingInterviews || 0} interviews pending</p>
                </div>
                <span className="text-sm text-purple-600 ml-auto font-medium">3h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Resume processed</p>
                  <p className="text-sm text-emerald-700">Latest resume analysis completed</p>
                </div>
                <span className="text-sm text-emerald-600 ml-auto font-medium">1d ago</span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
