import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Users, Calendar, TrendingUp, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">CareerAI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
            Login
          </Link>
          <Link 
            to="/signup" 
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Career Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your recruitment process with intelligent resume analysis, 
            smart job matching, and automated interview scheduling.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/signup" 
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Intelligent Recruitment Solutions</h2>
          <p className="text-xl text-gray-600">Streamline your hiring process with AI-powered insights</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Resume Analysis</h3>
            <p className="text-gray-600">
              Extract key skills and experiences from resumes using advanced NLP technology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Matching</h3>
            <p className="text-gray-600">
              Match candidates to job roles with AI-powered similarity analysis and scoring.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Interview Scheduling</h3>
            <p className="text-gray-600">
              Automated interview scheduling with calendar integration and candidate notifications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Feedback Analysis</h3>
            <p className="text-gray-600">
              Analyze interview feedback with sentiment analysis to identify top candidates.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose CareerAI?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Save 80% Time</h3>
                    <p className="text-gray-600">Automate resume screening and candidate evaluation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Improve Quality</h3>
                    <p className="text-gray-600">AI-powered matching ensures better candidate-job fit</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Reduce Bias</h3>
                    <p className="text-gray-600">Objective evaluation based on skills and experience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Scale Efficiently</h3>
                    <p className="text-gray-600">Handle hundreds of applications with ease</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Hiring?</h3>
                <p className="mb-6 opacity-90">
                  Join thousands of companies using AI to find the perfect candidates faster.
                </p>
                <Link 
                  to="/signup"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
                >
                  Start Your Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">CareerAI</span>
          </div>
          <p className="text-gray-400">
            © 2025 CareerAI. Built for GFG x Accenture Hackathon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}