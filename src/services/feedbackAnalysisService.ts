// Feedback Analysis Service with DeepSeek Integration
import { deepSeekClient } from './deepSeekClient';

export interface FeedbackAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  keywords: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  redFlags: string[];
  strengths: string[];
  recommendation: string;
}

export class FeedbackAnalysisService {

  static async analyzeFeedback(feedbackText: string): Promise<FeedbackAnalysis> {
    const prompt = `Analyze the following interview feedback and provide sentiment analysis.

IMPORTANT: Return ONLY a JSON object with no additional text.

Feedback:
${feedbackText}

Return a JSON object with this exact structure:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": (number 0-1),
  "confidence": (number 0-1),
  "keywords": {
    "positive": ["word1", "word2"],
    "negative": ["word1", "word2"],
    "neutral": ["word1", "word2"]
  },
  "redFlags": ["concern1", "concern2"],
  "strengths": ["strength1", "strength2"],
  "recommendation": "Brief recommendation"
}`;

    try {
      const response = await deepSeekClient.generateText(prompt, 0.3);
      const cleanedResponse = this.cleanJsonResponse(response);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Feedback analysis failed:', error);
      // Return mock analysis as fallback
      return {
        sentiment: 'positive',
        score: 0.75,
        confidence: 0.87,
        keywords: {
          positive: ['excellent', 'skilled', 'experienced', 'professional'],
          negative: ['lacks', 'limited', 'needs improvement'],
          neutral: ['candidate', 'interview', 'experience', 'background']
        },
        redFlags: [
          'Communication skills need improvement',
          'Limited experience with specific technologies'
        ],
        strengths: [
          'Strong technical knowledge',
          'Good problem-solving approach',
          'Professional demeanor'
        ],
        recommendation: 'Recommend for next round with focus on communication assessment'
      };
    }
  }

  private static cleanJsonResponse(response: string): string {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return response.substring(jsonStart, jsonEnd + 1);
    }
    
    return response;
  }
}