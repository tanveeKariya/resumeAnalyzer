import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, AlertCircle, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'hr' | 'candidate'>('candidate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: 'hr' | 'candidate') => {
    setLoading(true);
    setError('');
    
    try {
      const demoCredentials = {
        hr: { email: 'hr@demo.com', password: 'demo123' },
        candidate: { email: 'candidate@demo.com', password: 'demo123' }
      };
      
      const { email: demoEmail, password: demoPassword } = demoCredentials[demoRole];
      console.log('Attempting demo login for:', demoRole);
      await login(demoEmail, demoPassword, demoRole);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Demo login error:', error);
      setError(error.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-violet-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center shadow-large group-hover:shadow-glow transition-all duration-300">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <span className="text-3xl font-bold gradient-text">CareerAI</span>
              <p className="text-sm text-slate-500 font-medium">Intelligent Hiring Platform</p>
            </div>
          </Link>
          <h2 className="text-5xl font-bold text-slate-900 mb-4">Welcome Back</h2>
          <p className="text-slate-600 text-lg font-medium">Sign in to continue your intelligent hiring journey</p>
        </div>

        {/* Demo Login Cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => handleDemoLogin('candidate')}
            disabled={loading}
            className="group p-8 glass rounded-3xl border border-white/20 hover:border-brand-300 hover:bg-brand-50/50 transition-all disabled:opacity-50 shadow-medium hover:shadow-large transform hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <User className="h-8 w-8 text-white" />
            </div>
            <p className="font-bold text-slate-900 text-lg mb-1">Demo Candidate</p>
            <p className="text-sm text-slate-600 font-medium">Experience as job seeker</p>
          </button>
          
          <button
            onClick={() => handleDemoLogin('hr')}
            disabled={loading}
            className="group p-8 glass rounded-3xl border border-white/20 hover:border-violet-300 hover:bg-violet-50/50 transition-all disabled:opacity-50 shadow-medium hover:shadow-large transform hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <p className="font-bold text-slate-900 text-lg mb-1">Demo HR</p>
            <p className="text-sm text-slate-600 font-medium">Experience as recruiter</p>
          </button>
        </div>

        {/* Login Form */}
        <Card glass padding="xl" shadow="large" className="border border-white/20">
          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 animate-slide-down">
              <AlertCircle className="h-6 w-6 text-rose-600" />
              <span className="text-rose-800 font-medium">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              placeholder="Enter your email"
              required
              size="lg"
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              placeholder="Enter your password"
              required
              size="lg"
            />

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Role
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'hr' | 'candidate')}
                  className="input-field pl-12 text-lg appearance-none cursor-pointer"
                  required
                >
                  <option value="candidate">Job Candidate</option>
                  <option value="hr">HR / Recruiter</option>
                </select>
              </div>
            </div>

            <Button
              type="submit" 
              disabled={loading}
              loading={loading}
              fullWidth
              size="xl"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-600 hover:text-brand-700 font-bold transition-colors">
                Create Account
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-slate-200/60">
            <div className="flex items-center justify-center space-x-2 text-slate-500">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Secured with enterprise-grade encryption</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}