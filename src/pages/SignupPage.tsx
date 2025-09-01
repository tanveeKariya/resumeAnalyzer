import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, AlertCircle, UserPlus, Sparkles, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'hr' | 'candidate'>('candidate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    
    try {
      await register(email, password, name.trim(), role);
      navigate('/dashboard');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'AI-powered resume analysis',
    'Intelligent job matching',
    'Automated interview scheduling',
    'Real-time feedback collection'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-violet-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center shadow-large group-hover:shadow-glow transition-all duration-300">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <span className="text-3xl font-bold gradient-text">CareerAI</span>
                <p className="text-sm text-slate-500 font-medium">Intelligent Hiring Platform</p>
              </div>
            </Link>

            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Join the Future of Hiring
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                Create your account and experience the power of AI-driven recruitment. 
                Transform how you hire or find your dream job.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-slate-700 font-semibold">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="glass rounded-3xl p-8 border border-white/20 shadow-medium">
              <div className="flex items-center space-x-4 mb-4">
                <Shield className="h-8 w-8 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-lg">Enterprise Security</h3>
              </div>
              <p className="text-slate-600 font-medium">
                Your data is protected with bank-level encryption and SOC2 compliance standards.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <Card glass padding="xl" shadow="large" className="border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Create Account</h2>
                <p className="text-slate-600 font-medium">Get started with your free account today</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 animate-slide-down">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                  <span className="text-rose-800 font-medium">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="text"
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={UserPlus}
                  placeholder="Enter your full name"
                  required
                  size="lg"
                />

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
                  placeholder="Create a secure password"
                  required
                  size="lg"
                />

                <Input
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={Lock}
                  placeholder="Confirm your password"
                  required
                  size="lg"
                />

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    I am a...
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-brand-600 hover:text-brand-700 font-bold transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}