import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Users, Calendar, TrendingUp, CheckCircle, Star, Zap, Shield, Target, Award, 
  ArrowRight, Play, Sparkles, Globe, Clock, Upload, BarChart3, Briefcase, 
  ChevronRight, Rocket, Trophy, Lightbulb, Search, Filter, Heart
} from 'lucide-react';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = React.useState(0);

  const features = [
    {
      icon: Brain,
      title: 'AI Resume Analysis',
      description: 'Advanced NLP technology extracts skills, experience, and qualifications with 95% accuracy',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Smart Job Matching',
      description: 'Intelligent algorithms match candidates to perfect opportunities with detailed scoring',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Calendar,
      title: 'Seamless Scheduling',
      description: 'Automated interview scheduling with Google Meet integration and smart calendar sync',
      color: 'from-violet-500 to-violet-600'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Resumes Processed', icon: Upload },
    { value: '95%', label: 'Accuracy Rate', icon: Target },
    { value: '80%', label: 'Time Saved', icon: Clock },
    { value: '500+', label: 'Companies', icon: Briefcase }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director at TechCorp',
      content: 'CareerAI transformed our hiring process. We reduced time-to-hire by 60% while improving candidate quality.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: 'Found my dream job in just 2 weeks! The AI matching was incredibly accurate and saved me so much time.',
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Talent Acquisition Lead',
      content: 'The automated screening and interview scheduling features are game-changers for our recruitment team.',
      avatar: 'ER'
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <nav className="glass rounded-3xl px-8 py-6 shadow-xl border border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">CareerAI</span>
                <p className="text-sm text-slate-500 font-medium">Intelligent Hiring Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-slate-700 hover:text-blue-600 transition-colors font-semibold">Features</a>
                <a href="#how-it-works" className="text-slate-700 hover:text-blue-600 transition-colors font-semibold">How it Works</a>
                <a href="#pricing" className="text-slate-700 hover:text-blue-600 transition-colors font-semibold">Pricing</a>
              </div>
              <Link to="/login" className="text-slate-700 hover:text-blue-600 transition-colors font-semibold">
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-violet-700 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 glass rounded-full text-blue-700 font-semibold mb-8 shadow-lg border border-blue-200/60">
            <Sparkles className="h-5 w-5 mr-2" />
            Powered by Advanced AI Technology
          </div>
          
          <h1 className="text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 bg-clip-text text-transparent block">Transform</span>
            <span className="text-slate-900 block">Hiring Forever</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
            Revolutionize recruitment with AI-powered resume analysis, intelligent matching, 
            and seamless interview scheduling. Find perfect candidates 80% faster.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg px-12 py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-violet-700 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              className="border-2 border-slate-300 text-slate-700 font-bold text-lg px-12 py-5 rounded-2xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
            >
              <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
            </button>
          </div>
          
          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="glass rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-slate-600 font-semibold text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Powerful AI Features</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
            Everything you need to revolutionize your recruitment process
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              return (
                <div 
                  key={index}
                  className={`p-8 rounded-3xl border-2 transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? 'border-blue-300 bg-blue-50/50 shadow-xl scale-105' 
                      : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50/30'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="relative">
            <div className="glass rounded-4xl p-12 shadow-2xl border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Ready to Transform Hiring?</h3>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Join thousands of companies using AI to discover exceptional talent and build amazing teams.
                </p>
                <Link 
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-violet-700 transition-all duration-300 transform hover:-translate-y-1 group inline-flex items-center"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Simple, powerful, and intelligent - our AI handles the complexity
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Upload, title: 'Upload Resume', desc: 'Candidates upload resumes for instant AI analysis', step: '01' },
              { icon: Brain, title: 'AI Analysis', desc: 'Advanced algorithms extract skills and experience', step: '02' },
              { icon: Target, title: 'Smart Matching', desc: 'Intelligent matching with detailed scoring', step: '03' },
              { icon: Calendar, title: 'Interview & Hire', desc: 'Seamless scheduling and feedback collection', step: '04' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center group relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 mt-8 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by Teams Worldwide</h2>
            <p className="text-lg text-slate-600">See what our users say about CareerAI</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium mb-4">"{testimonial.content}"</p>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="glass rounded-4xl p-16 text-center shadow-2xl border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6">
                Start Hiring Smarter Today
              </h2>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Transform your recruitment process with AI. No setup fees, no long-term contracts. 
                Start your free trial and see results immediately.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg px-12 py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-violet-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Start Free Trial
                </Link>
                <div className="flex items-center space-x-2 text-slate-600">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">No credit card required</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
                  <div className="text-sm text-slate-500 font-medium">AI Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600 mb-1">99.9%</div>
                  <div className="text-sm text-slate-500 font-medium">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">SOC2</div>
                  <div className="text-sm text-slate-500 font-medium">Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CareerAI</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Revolutionizing recruitment with AI-powered intelligence, automation, and insights.
              </p>
              <div className="flex space-x-4">
                {[Globe, Users, Star].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                    <Icon className="h-5 w-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors font-medium">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors font-medium">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors font-medium">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400 font-medium">
              © 2025 CareerAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}