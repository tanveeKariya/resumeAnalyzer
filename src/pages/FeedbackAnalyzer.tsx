import React, { useState } from 'react';
import { MessageSquare, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Save, Download, RefreshCw } from 'lucide-react';
import { FeedbackAnalysisService, FeedbackAnalysis } from '../services/feedbackAnalysisService';
import { StorageService } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';

export default function FeedbackAnalyzer() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);

  React.useEffect(() => {
    // Load saved feedback analyses
    const analyses = StorageService.getFeedbackAnalyses();
    setSavedAnalyses(analyses);
  }, []);

  const analyzeFeedback = async () => {
    if (!feedback.trim()) return;

    setError('');
    setAnalyzing(true);

    try {
      const result = await FeedbackAnalysisService.analyzeFeedback(feedback);
      setAnalysis(result);
    } catch (error) {
      setError('Failed to analyze feedback. Please try again.');
      console.error('Feedback analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveFeedbackAnalysis = () => {
    if (analysis && user) {
      const id = StorageService.saveFeedbackAnalysis(
        analysis,
        Date.now(), // Mock interview ID
        user.id,
        feedback
      );
      
      // Refresh saved analyses
      const analyses = StorageService.getFeedbackAnalyses();
      setSavedAnalyses(analyses);
      
      alert('Feedback analysis saved successfully!');
    }
  };

  const downloadAnalysis = () => {
    if (analysis) {
      const dataStr = JSON.stringify({
        feedback,
        analysis,
        analyzedAt: new Date().toISOString(),
        analyzedBy: user?.name || 'Unknown'
      }, null, 2);
      
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `feedback-analysis-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-success-600 bg-success-50';
      case 'negative': return 'text-error-600 bg-error-50';
      case 'neutral': return 'text-warning-600 bg-warning-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="h-5 w-5" />;
      case 'negative': return <AlertTriangle className="h-5 w-5" />;
      case 'neutral': return <BarChart3 className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const sampleFeedbacks = [
    "The candidate demonstrated excellent technical skills and showed great problem-solving abilities during the coding challenge. Very impressed with their React knowledge.",
    "Good communication skills but lacks experience with our specific tech stack. Would need significant training to be effective in this role.",
    "Candidate seems nervous but has solid fundamentals. Their portfolio projects show creativity and technical competence. Recommend second interview.",
    "Unprepared for the interview. Couldn't answer basic questions about the role or company. Communication skills need significant improvement."
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Analyzer</h1>
        <p className="text-gray-600">Analyze interview feedback using AI-powered sentiment analysis</p>
        {error && (
          <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-error-600" />
            <span className="text-error-800 text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Quick Sample Buttons */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Samples</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {sampleFeedbacks.map((sample, index) => (
            <button
              key={index}
              onClick={() => setFeedback(sample)}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-sm"
            >
              {sample.substring(0, 100)}...
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Input */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Interview Feedback</h2>
        <div className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Paste interview feedback here for AI analysis..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {feedback.length} characters
            </span>
            <button
              onClick={analyzeFeedback}
              disabled={!feedback.trim() || analyzing}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  <span>Analyze Feedback</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Sentiment Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Analysis</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${getSentimentColor(analysis.sentiment)}`}>
                <div className="flex items-center space-x-3">
                  {getSentimentIcon(analysis.sentiment)}
                  <div>
                    <h3 className="font-semibold capitalize">{analysis.sentiment}</h3>
                    <p className="text-sm opacity-80">Overall Sentiment</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{Math.round(analysis.score * 100)}%</h3>
                    <p className="text-sm text-gray-600">Sentiment Score</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-secondary-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{Math.round(analysis.confidence * 100)}%</h3>
                    <p className="text-sm text-gray-600">Confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Keywords Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Terms Analysis</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-success-700 mb-3">Positive Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.positive.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-error-700 mb-3">Negative Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.negative.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-error-100 text-error-800 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Neutral Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.neutral.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-success-500" />
                <h2 className="text-xl font-semibold text-gray-900">Identified Strengths</h2>
              </div>
              <div className="space-y-3">
                {analysis.strengths.map((strength: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-6 w-6 text-warning-500" />
                <h2 className="text-xl font-semibold text-gray-900">Areas of Concern</h2>
              </div>
              <div className="space-y-3">
                {analysis.redFlags.map((flag: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-3">AI Recommendation</h2>
            <p className="text-lg opacity-90">{analysis.recommendation}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {user?.role === 'hr' && (
              <>
                <button 
                  onClick={() => alert('Candidate approved and moved to next round!')}
                  className="bg-success-600 text-white px-6 py-3 rounded-lg hover:bg-success-700 transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve Candidate</span>
                </button>
                <button 
                  onClick={() => alert('Follow-up interview scheduled!')}
                  className="bg-warning-600 text-white px-6 py-3 rounded-lg hover:bg-warning-700 transition-colors flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Follow-up</span>
                </button>
                <button 
                  onClick={() => alert('Application rejected with feedback sent to candidate.')}
                  className="bg-error-600 text-white px-6 py-3 rounded-lg hover:bg-error-700 transition-colors flex items-center space-x-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Reject Application</span>
                </button>
              </>
            )}
            
            <button 
              onClick={saveFeedbackAnalysis}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Analysis</span>
            </button>
            
            <button 
              onClick={downloadAnalysis}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      {/* Saved Analyses */}
      {savedAnalyses.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Analyses</h2>
          <div className="space-y-3">
            {savedAnalyses.slice(-5).map((savedAnalysis) => (
              <div key={savedAnalysis.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(savedAnalysis.sentiment)}`}>
                        {savedAnalysis.sentiment}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(savedAnalysis.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {savedAnalysis.feedbackText.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {Math.round(savedAnalysis.score * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}