import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
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
      await login(demoEmail, demoPassword, demoRole);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CareerAI</span>
          </Link>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h2>
          <p className="text-gray-600 text-lg">Sign in to your account to continue your journey</p>
        </div>

        {/* Demo Login Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => handleDemoLogin('candidate')}
            disabled={loading}
            className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <p className="font-bold text-gray-900">Demo Candidate</p>
            <p className="text-sm text-gray-600">Try as job seeker</p>
          </button>
          
          <button
            onClick={() => handleDemoLogin('hr')}
            disabled={loading}
            className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <p className="font-bold text-gray-900">Demo HR</p>
            <p className="text-sm text-gray-600">Try as recruiter</p>
          </button>
        </div>

        {/* Login Form */}
        <Card className="p-8 backdrop-blur-sm bg-white/80 shadow-2xl border-white/20">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              placeholder="Enter your email"
              required
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              placeholder="Enter your password"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'hr' | 'candidate')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
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
              className="w-full"
              size="lg"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}