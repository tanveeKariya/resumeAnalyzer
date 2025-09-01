import React, { useState } from 'react';
import { Star, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  jobTitle: string;
  onSubmit: (feedback: any) => void;
}

export default function FeedbackModal({ isOpen, onClose, candidateName, jobTitle, onSubmit }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');

  const addStrength = () => {
    if (newStrength.trim()) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength('');
    }
  };

  const addWeakness = () => {
    if (newWeakness.trim()) {
      setWeaknesses([...weaknesses, newWeakness.trim()]);
      setNewWeakness('');
    }
  };

  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };

  const removeWeakness = (index: number) => {
    setWeaknesses(weaknesses.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const feedback = {
      rating,
      comments,
      strengths,
      weaknesses,
      recommendation,
      submittedAt: new Date().toISOString()
    };
    onSubmit(feedback);
    onClose();
  };

  const isValid = rating > 0 && comments.trim() && recommendation;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Interview Feedback" size="lg">
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900">Interview Details</h4>
          <p className="text-blue-800">Candidate: <span className="font-medium">{candidateName}</span></p>
          <p className="text-blue-800">Position: <span className="font-medium">{jobTitle}</span></p>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 transition-colors ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star className="h-8 w-8 fill-current" />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {rating > 0 && `${rating}/5 stars`}
            </span>
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Comments <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Provide detailed feedback about the candidate's performance..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Strengths */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                placeholder="Add a strength..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addStrength()}
              />
              <Button size="sm" onClick={addStrength}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {strength}
                  <button
                    onClick={() => removeStrength(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Weaknesses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Areas for Improvement</label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newWeakness}
                onChange={(e) => setNewWeakness(e.target.value)}
                placeholder="Add an area for improvement..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addWeakness()}
              />
              <Button size="sm" onClick={addWeakness}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {weaknesses.map((weakness, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {weakness}
                  <button
                    onClick={() => removeWeakness(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommendation <span className="text-red-500">*</span>
          </label>
          <select
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select recommendation...</option>
            <option value="hire">Hire - Excellent candidate</option>
            <option value="next-round">Proceed to next round</option>
            <option value="hold">Hold - Need more evaluation</option>
            <option value="reject">Reject - Not suitable</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <Button onClick={handleSubmit} disabled={!isValid} className="flex-1">
            Submit Feedback
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}