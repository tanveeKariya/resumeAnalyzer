import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Users, Calendar, TrendingUp, CheckCircle, Star, Zap, Shield, Target, Award, ArrowRight, Play, Sparkles, Globe, Clock, Upload } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-violet-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <nav className="glass rounded-3xl px-8 py-6 shadow-large border border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-brand rounded-2xl flex items-center justify-center shadow-medium">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">CareerAI</span>
                <p className="text-xs text-slate-500 font-medium">Intelligent Hiring Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-slate-700 hover:text-brand-600 transition-colors font-semibold">
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="button-primary"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 glass rounded-full text-brand-700 font-semibold mb-8 shadow-soft border border-brand-200/60">
            <Sparkles className="h-5 w-5 mr-2" />
            Powered by Advanced AI Technology
          </div>
          
          <h1 className="text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="gradient-text block">Transform</span>
            <span className="text-slate-900 block">Hiring Forever</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
            Revolutionize recruitment with AI-powered resume analysis, intelligent matching, 
            automated testing, and seamless interview scheduling. Find perfect candidates 80% faster.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link 
              to="/signup" 
              className="button-primary text-lg px-10 py-5 shadow-large hover:shadow-glow-lg group"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              className="button-outline text-lg px-10 py-5 group"
            >
              <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
            </button>
          </div>
          
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="glass rounded-3xl p-8 shadow-medium border border-white/20 hover:shadow-large transition-all duration-300">
              <div className="text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-slate-600 font-semibold">Accuracy Rate</div>
              <div className="text-sm text-slate-500 mt-1">AI-powered analysis</div>
            </div>
            <div className="glass rounded-3xl p-8 shadow-medium border border-white/20 hover:shadow-large transition-all duration-300">
              <div className="text-4xl font-bold gradient-text mb-2">80%</div>
              <div className="text-slate-600 font-semibold">Time Saved</div>
              <div className="text-sm text-slate-500 mt-1">Automated workflows</div>
            </div>
            <div className="glass rounded-3xl p-8 shadow-medium border border-white/20 hover:shadow-large transition-all duration-300">
              <div className="text-4xl font-bold gradient-text mb-2">50k+</div>
              <div className="text-slate-600 font-semibold">Resumes Processed</div>
              <div className="text-sm text-slate-500 mt-1">And growing daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Powerful AI Features</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
            Everything you need to revolutionize your recruitment process and discover exceptional talent
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="glass p-10 rounded-3xl shadow-large border border-white/20 hover:shadow-glow transition-all duration-500 group">
            <div className="w-20 h-20 gradient-brand rounded-3xl flex items-center justify-center mb-8 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">AI Resume Analysis</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Advanced NLP technology extracts skills, experience, and qualifications with industry-leading 95% accuracy.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Intelligent skill extraction</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Experience timeline analysis</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Education & certification parsing</span>
              </li>
            </ul>
          </div>

          <div className="glass p-10 rounded-3xl shadow-large border border-white/20 hover:shadow-glow transition-all duration-500 group">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-3xl flex items-center justify-center mb-8 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Smart Testing</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              AI-generated technical assessments with role-specific questions and intelligent scoring algorithms.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Dynamic question generation</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Adaptive difficulty levels</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Instant scoring & insights</span>
              </li>
            </ul>
          </div>

          <div className="glass p-10 rounded-3xl shadow-large border border-white/20 hover:shadow-glow transition-all duration-500 group">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Seamless Scheduling</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Automated interview scheduling with Google Meet integration and comprehensive feedback collection.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Auto Google Meet generation</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Smart calendar integration</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Automated feedback workflows</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold text-slate-900 mb-8">
                Why Choose CareerAI?
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-soft">
                    <Zap className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-2">Save 80% Time</h3>
                    <p className="text-slate-600 leading-relaxed">Automate resume screening, testing, and candidate evaluation with cutting-edge AI technology</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center shadow-soft">
                    <Target className="h-7 w-7 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-2">Improve Quality</h3>
                    <p className="text-slate-600 leading-relaxed">AI-powered matching and testing ensures superior candidate-job fit and better hiring outcomes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center shadow-soft">
                    <Shield className="h-7 w-7 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-2">Reduce Bias</h3>
                    <p className="text-slate-600 leading-relaxed">Objective evaluation based on skills, experience, and performance metrics for fair hiring</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shadow-soft">
                    <Users className="h-7 w-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-2">Scale Efficiently</h3>
                    <p className="text-slate-600 leading-relaxed">Handle thousands of applications with intelligent automated workflows and smart filtering</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="glass rounded-4xl p-12 shadow-large border border-white/20 text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-40 h-40 gradient-brand rounded-full -translate-y-20 translate-x-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full translate-y-16 -translate-x-16"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-large">
                    <Award className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-6">Ready to Transform Hiring?</h3>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Join thousands of companies using AI to discover exceptional talent and build amazing teams.
                  </p>
                  <Link 
                    to="/signup"
                    className="button-primary text-lg px-10 py-5 shadow-large hover:shadow-glow-lg group"
                  >
                    <span>Start Your Free Trial</span>
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200/60">
                    <div>
                      <div className="text-2xl font-bold text-brand-600 mb-1">24/7</div>
                      <div className="text-sm text-slate-500 font-medium">AI Support</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-violet-600 mb-1">99.9%</div>
                      <div className="text-sm text-slate-500 font-medium">Uptime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-600 mb-1">SOC2</div>
                      <div className="text-sm text-slate-500 font-medium">Compliant</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-24 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Simple, powerful, and intelligent - our AI handles the complexity so you can focus on what matters
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Upload Resume</h3>
              <p className="text-slate-600 leading-relaxed">
                Candidates upload resumes in PDF or DOCX format for instant AI analysis
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced algorithms extract skills, experience, and qualifications with precision
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Matching</h3>
              <p className="text-slate-600 leading-relaxed">
                Intelligent algorithms match candidates to perfect job opportunities
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Interview & Hire</h3>
              <p className="text-slate-600 leading-relaxed">
                Seamless scheduling, testing, and feedback collection for optimal hiring decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-lg text-slate-600">Companies worldwide rely on CareerAI for their hiring needs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            {['TechCorp', 'InnovateLabs', 'FutureWorks', 'DataDriven'].map((company, index) => (
              <div key={index} className="glass rounded-2xl p-6 text-center shadow-soft border border-white/20">
                <div className="w-12 h-12 bg-slate-200 rounded-xl mx-auto mb-3"></div>
                <p className="font-bold text-slate-700">{company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="glass rounded-4xl p-16 text-center shadow-large border border-white/20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 gradient-brand rounded-full -translate-y-32 -translate-x-32"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full translate-y-40 translate-x-40"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-slate-900 mb-6">
                Start Hiring Smarter Today
              </h2>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Transform your recruitment process with AI. No setup fees, no long-term contracts. 
                Start your free trial and see results immediately.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link 
                  to="/signup" 
                  className="button-primary text-lg px-12 py-5 shadow-large hover:shadow-glow-lg"
                >
                  Start Free Trial
                </Link>
                <div className="flex items-center space-x-2 text-slate-600">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">No credit card required</span>
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
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-medium">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CareerAI</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Revolutionizing recruitment with AI-powered intelligence, automation, and insights for the modern workplace.
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
                <li><a href="#" className="hover:text-white transition-colors font-medium">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors font-medium">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Press Kit</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors font-medium">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400 font-medium">
              © 2025 CareerAI. Built for GFG x Accenture Hackathon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}