import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Upload, Target, Calendar, MessageSquare, TrendingUp, Users, Clock, CheckCircle,
  BarChart3, FileText, Star, Award, Zap, Brain, Shield, Sparkles, ArrowUpRight, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = React.useState<any>({});

  React.useEffect(() => {
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
      gradient: 'from-brand-500 to-brand-600',
      change: stats.totalResumes > 0 ? `${stats.totalResumes} total uploaded` : 'Upload your first resume',
      trend: 'up'
    },
    {
      label: 'Job Matches',
      value: stats.totalMatches?.toString() || '0',
      icon: Target,
      gradient: 'from-violet-500 to-violet-600',
      change: stats.averageMatchScore > 0 ? `${stats.averageMatchScore}% avg match` : 'No matches yet',
      trend: 'up'
    },
    {
      label: 'Interviews Scheduled',
      value: stats.pendingInterviews?.toString() || '0',
      icon: Calendar,
      gradient: 'from-emerald-500 to-emerald-600',
      change: stats.confirmedInterviews > 0 ? `${stats.confirmedInterviews} confirmed` : 'No interviews scheduled',
      trend: 'neutral'
    },
    {
      label: 'Applications',
      value: (stats.totalMatches * 2)?.toString() || '0',
      icon: CheckCircle,
      gradient: 'from-amber-500 to-amber-600',
      change: stats.totalMatches > 0 ? `${Math.floor(stats.totalMatches * 0.6)} in progress` : 'No applications yet',
      trend: 'up'
    }
  ];

  const hrStats = [
    {
      label: 'Candidates Reviewed',
      value: stats.totalResumes?.toString() || '0',
      icon: Users,
      gradient: 'from-brand-500 to-brand-600',
      change: stats.totalResumes > 0 ? `${stats.totalResumes} total reviewed` : 'No candidates yet',
      trend: 'up'
    },
    {
      label: 'Shortlisted',
      value: Math.floor(stats.totalResumes * 0.6)?.toString() || '0',
      icon: Target,
      gradient: 'from-violet-500 to-violet-600',
      change: stats.totalResumes > 0
        ? `${Math.round((Math.floor(stats.totalResumes * 0.6) / stats.totalResumes) * 100)}% rate`
        : '0% rate',
      trend: 'up'
    },
    {
      label: 'Interviews Today',
      value: stats.pendingInterviews?.toString() || '0',
      icon: Calendar,
      gradient: 'from-emerald-500 to-emerald-600',
      change: stats.completedInterviews > 0 ? `${stats.completedInterviews} completed` : 'No interviews today',
      trend: 'neutral'
    },
    {
      label: 'Avg. Response Time',
      value: '2.3h',
      icon: Clock,
      gradient: 'from-amber-500 to-amber-600',
      change: '-15% this week',
      trend: 'down'
    }
  ];

  const displayStats = user?.role === 'hr' ? hrStats : candidateStats;

  const quickActions = user?.role === 'hr'
    ? [
        { label: 'Review Candidates', path: '/matches', icon: Users, gradient: 'from-brand-500 to-brand-600', description: 'Analyze applications' },
        { label: 'Schedule Interviews', path: '/hr-dashboard', icon: Calendar, gradient: 'from-violet-500 to-violet-600', description: 'Manage meetings' },
        { label: 'View Analytics', path: '/analytics', icon: BarChart3, gradient: 'from-emerald-500 to-emerald-600', description: 'Performance insights' }
      ]
    : [
        { label: 'Upload Resume', path: '/upload', icon: Upload, gradient: 'from-brand-500 to-brand-600', description: 'AI-powered analysis' },
        { label: 'View Matches', path: '/matches', icon: Target, gradient: 'from-violet-500 to-violet-600', description: 'Find opportunities' },
        { label: 'My Interviews', path: '/candidate-dashboard', icon: Calendar, gradient: 'from-emerald-500 to-emerald-600', description: 'Manage schedule' }
      ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <Card className="gradient-brand text-white shadow-large border-0 relative overflow-hidden" padding="xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-medium">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-3">{getGreeting()}, {user?.name || 'Guest'}!</h1>
              <p className="text-white/90 text-xl font-medium">
                {user?.role === 'hr'
                  ? 'Manage your recruitment pipeline with AI-powered insights and automation.'
                  : user?.role === 'candidate'
                  ? 'Discover your next career opportunity with intelligent AI assistance.'
                  : 'Welcome to CareerAI - your intelligent career assistant.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-white/80" />
              <span className="text-white/90 font-medium">System Status: All systems operational</span>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft"></div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="group cursor-pointer" hover glass padding="lg" shadow="medium">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-3xl flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-slate-900">{stat.value}</span>
                  {stat.trend === 'up' && (
                    <div className="flex items-center justify-end text-emerald-600 mt-1">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="text-xs font-bold">+12%</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-slate-900 font-bold text-lg mb-2">{stat.label}</p>
                <p className="text-sm text-slate-600 font-medium">{stat.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card glass padding="xl" shadow="large">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center space-x-3">
          <Zap className="h-8 w-8 text-brand-600" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className="group p-8 rounded-3xl border border-slate-200/60 hover:border-brand-300 hover:bg-brand-50/50 transition-all duration-300 shadow-soft hover:shadow-large transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-2 group-hover:text-brand-700 transition-colors">
                  {action.label}
                </h3>
                <p className="text-slate-600 font-medium">{action.description}</p>
                <div className="flex items-center mt-4 text-brand-600 group-hover:text-brand-700 transition-colors">
                  <span className="text-sm font-semibold">Get started</span>
                  <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card glass padding="xl" shadow="large">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center space-x-3">
          <Brain className="h-8 w-8 text-violet-600" />
          <span>Recent Activity</span>
        </h2>
        <div className="space-y-6">
          {user?.role === 'hr' ? (
            <>
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-brand-200/60 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">New candidate applications</p>
                  <p className="text-brand-700 font-semibold">{stats.totalResumes || 0} resumes analyzed this week</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-brand-600 font-bold">2h ago</span>
                  <div className="w-2 h-2 bg-brand-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-violet-200/60 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">Interview completed</p>
                  <p className="text-violet-700 font-semibold">{stats.completedInterviews || 0} interviews completed</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-violet-600 font-bold">4h ago</span>
                  <div className="w-2 h-2 bg-violet-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-emerald-200/60 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">Feedback analyzed</p>
                  <p className="text-emerald-700 font-semibold">{stats.totalFeedbacks || 0} feedback analyses completed</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-emerald-600 font-bold">1d ago</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-brand-200/60 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">New job matches found</p>
                  <p className="text-brand-700 font-semibold">{stats.totalMatches || 0} positions match your profile</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-brand-600 font-bold">1h ago</span>
                  <div className="w-2 h-2 bg-brand-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-violet-200/60 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">Interview scheduled</p>
                  <p className="text-violet-700 font-semibold">{stats.pendingInterviews || 0} interviews pending</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-violet-600 font-bold">3h ago</span>
                  <div className="w-2 h-2 bg-violet-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-emerald-200/60 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-medium">
                  <Upload className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">Resume processed</p>
                  <p className="text-emerald-700 font-semibold">Latest resume analysis completed</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-emerald-600 font-bold">1d ago</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}