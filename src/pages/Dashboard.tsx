import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Upload, Target, Calendar, MessageSquare, TrendingUp, Users, Clock, CheckCircle,
  BarChart3, FileText, Star, Award, Zap, Brain, Shield, Sparkles, ArrowUpRight, 
  Activity, Briefcase, Plus, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/api';
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
      gradient: 'from-blue-500 to-blue-600',
      change: stats.totalResumes > 0 ? `${stats.totalResumes} total uploaded` : 'Upload your first resume',
      trend: 'up'
    },
    {
      label: 'Applications',
      value: stats.totalApplications?.toString() || '0',
      icon: Target,
      gradient: 'from-emerald-500 to-emerald-600',
      change: stats.totalApplications > 0 ? `${stats.totalApplications} applications sent` : 'No applications yet',
      trend: 'up'
    },
    {
      label: 'Interviews',
      value: stats.totalInterviews?.toString() || '0',
      icon: Calendar,
      gradient: 'from-violet-500 to-violet-600',
      change: stats.confirmedInterviews > 0 ? `${stats.confirmedInterviews} confirmed` : 'No interviews scheduled',
      trend: 'neutral'
    },
    {
      label: 'Profile Views',
      value: Math.floor(stats.totalApplications * 3.2)?.toString() || '0',
      icon: Eye,
      gradient: 'from-amber-500 to-amber-600',
      change: stats.totalApplications > 0 ? `+${Math.floor(stats.totalApplications * 0.8)} this week` : 'No views yet',
      trend: 'up'
    }
  ];

  const hrStats = [
    {
      label: 'Jobs Posted',
      value: stats.totalJobs?.toString() || '0',
      icon: Briefcase,
      gradient: 'from-blue-500 to-blue-600',
      change: stats.totalJobs > 0 ? `${stats.totalJobs} active positions` : 'Post your first job',
      trend: 'up'
    },
    {
      label: 'Applications',
      value: stats.totalApplications?.toString() || '0',
      icon: Users,
      gradient: 'from-emerald-500 to-emerald-600',
      change: stats.totalApplications > 0 ? `${stats.totalApplications} candidates applied` : 'No applications yet',
      trend: 'up'
    },
    {
      label: 'Interviews',
      value: stats.totalInterviews?.toString() || '0',
      icon: Calendar,
      gradient: 'from-violet-500 to-violet-600',
      change: stats.completedInterviews > 0 ? `${stats.completedInterviews} completed` : 'No interviews yet',
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
        { label: 'Post New Job', path: '/hr-dashboard', icon: Plus, gradient: 'from-blue-500 to-blue-600', description: 'Create job listing' },
        { label: 'Review Candidates', path: '/hr-dashboard', icon: Users, gradient: 'from-emerald-500 to-emerald-600', description: 'Analyze applications' },
        { label: 'Manage Interviews', path: '/hr-dashboard', icon: Calendar, gradient: 'from-violet-500 to-violet-600', description: 'Schedule meetings' }
      ]
    : [
        { label: 'Upload Resume', path: '/upload', icon: Upload, gradient: 'from-blue-500 to-blue-600', description: 'AI-powered analysis' },
        { label: 'Browse Jobs', path: '/matches', icon: Target, gradient: 'from-emerald-500 to-emerald-600', description: 'Find opportunities' },
        { label: 'My Applications', path: '/candidate-dashboard', icon: Calendar, gradient: 'from-violet-500 to-violet-600', description: 'Track progress' }
      ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 text-white shadow-2xl border-0 relative overflow-hidden" padding="xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
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
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="group cursor-pointer hover:scale-105" glass padding="lg" shadow="medium">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
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
          <Zap className="h-8 w-8 text-blue-600" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className="group p-8 rounded-3xl border border-slate-200/60 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-2 group-hover:text-blue-700 transition-colors">
                  {action.label}
                </h3>
                <p className="text-slate-600 font-medium mb-4">{action.description}</p>
                <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
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
        <div className="space-y-4">
          {user?.role === 'hr' ? (
            <>
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">New candidate applications</p>
                  <p className="text-blue-700 font-semibold">{stats.totalApplications || 0} applications received</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-blue-600 font-bold">2h ago</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-emerald-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">Job posting active</p>
                  <p className="text-emerald-700 font-semibold">{stats.totalJobs || 0} positions currently open</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-emerald-600 font-bold">1d ago</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">Resume analyzed</p>
                  <p className="text-blue-700 font-semibold">AI extracted {stats.totalResumes > 0 ? '25+' : '0'} skills from your profile</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-blue-600 font-bold">1h ago</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 p-6 glass rounded-2xl border border-emerald-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">Job matches found</p>
                  <p className="text-emerald-700 font-semibold">{stats.totalApplications > 0 ? '8' : '0'} positions match your profile</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-emerald-600 font-bold">3h ago</span>
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