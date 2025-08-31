// Local Storage Service for Data Persistence
import { ResumeAnalysis } from './resumeAnalysisService';
import { JobMatch } from './jobMatchingService';
import { Interview } from './interviewSchedulingService';
import { FeedbackAnalysis } from './feedbackAnalysisService';

export interface StoredResumeAnalysis extends ResumeAnalysis {
  id: string;
  uploadedAt: string;
  fileName: string;
}

export interface StoredJobMatch extends JobMatch {
  candidateId: string;
  analyzedAt: string;
}

export interface StoredInterview extends Interview {
  candidateId: string;
  hrId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredFeedback extends FeedbackAnalysis {
  id: string;
  interviewId: number;
  submittedBy: string;
  submittedAt: string;
  feedbackText: string;
}

export class StorageService {
  private static readonly KEYS = {
    RESUME_ANALYSES: 'career_ai_resume_analyses',
    JOB_MATCHES: 'career_ai_job_matches',
    INTERVIEWS: 'career_ai_interviews',
    FEEDBACK_ANALYSES: 'career_ai_feedback_analyses',
    JOB_DESCRIPTIONS: 'career_ai_job_descriptions'
  };

  // Resume Analysis Storage
  static saveResumeAnalysis(analysis: ResumeAnalysis, fileName: string): string {
    const analyses = this.getResumeAnalyses();
    const id = Date.now().toString();
    const storedAnalysis: StoredResumeAnalysis = {
      ...analysis,
      id,
      uploadedAt: new Date().toISOString(),
      fileName
    };
    
    analyses.push(storedAnalysis);
    localStorage.setItem(this.KEYS.RESUME_ANALYSES, JSON.stringify(analyses));
    return id;
  }

  static getResumeAnalyses(): StoredResumeAnalysis[] {
    try {
      const stored = localStorage.getItem(this.KEYS.RESUME_ANALYSES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getResumeAnalysis(id: string): StoredResumeAnalysis | null {
    const analyses = this.getResumeAnalyses();
    return analyses.find(analysis => analysis.id === id) || null;
  }

  // Job Matches Storage
  static saveJobMatches(matches: JobMatch[], candidateId: string): void {
    const allMatches = this.getJobMatches();
    const storedMatches: StoredJobMatch[] = matches.map(match => ({
      ...match,
      candidateId,
      analyzedAt: new Date().toISOString()
    }));
    
    // Remove existing matches for this candidate
    const filteredMatches = allMatches.filter(m => m.candidateId !== candidateId);
    const updatedMatches = [...filteredMatches, ...storedMatches];
    
    localStorage.setItem(this.KEYS.JOB_MATCHES, JSON.stringify(updatedMatches));
  }

  static getJobMatches(candidateId?: string): StoredJobMatch[] {
    try {
      const stored = localStorage.getItem(this.KEYS.JOB_MATCHES);
      const matches = stored ? JSON.parse(stored) : [];
      return candidateId ? matches.filter((m: StoredJobMatch) => m.candidateId === candidateId) : matches;
    } catch {
      return [];
    }
  }

  // Interview Storage
  static saveInterview(interview: Interview, candidateId: string, hrId: string): string {
    const interviews = this.getInterviews();
    const id = Date.now().toString();
    const storedInterview: StoredInterview = {
      ...interview,
      id: parseInt(id),
      candidateId,
      hrId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    interviews.push(storedInterview);
    localStorage.setItem(this.KEYS.INTERVIEWS, JSON.stringify(interviews));
    return id;
  }

  static getInterviews(candidateId?: string, hrId?: string): StoredInterview[] {
    try {
      const stored = localStorage.getItem(this.KEYS.INTERVIEWS);
      let interviews = stored ? JSON.parse(stored) : [];
      
      if (candidateId) {
        interviews = interviews.filter((i: StoredInterview) => i.candidateId === candidateId);
      }
      if (hrId) {
        interviews = interviews.filter((i: StoredInterview) => i.hrId === hrId);
      }
      
      return interviews;
    } catch {
      return [];
    }
  }

  static updateInterview(id: number, updates: Partial<Interview>): void {
    const interviews = this.getInterviews();
    const index = interviews.findIndex(interview => interview.id === id);
    
    if (index !== -1) {
      interviews[index] = {
        ...interviews[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.KEYS.INTERVIEWS, JSON.stringify(interviews));
    }
  }

  // Feedback Storage
  static saveFeedbackAnalysis(
    analysis: FeedbackAnalysis,
    interviewId: number,
    submittedBy: string,
    feedbackText: string
  ): string {
    const feedbacks = this.getFeedbackAnalyses();
    const id = Date.now().toString();
    const storedFeedback: StoredFeedback = {
      ...analysis,
      id,
      interviewId,
      submittedBy,
      submittedAt: new Date().toISOString(),
      feedbackText
    };
    
    feedbacks.push(storedFeedback);
    localStorage.setItem(this.KEYS.FEEDBACK_ANALYSES, JSON.stringify(feedbacks));
    return id;
  }

  static getFeedbackAnalyses(interviewId?: number): StoredFeedback[] {
    try {
      const stored = localStorage.getItem(this.KEYS.FEEDBACK_ANALYSES);
      let feedbacks = stored ? JSON.parse(stored) : [];
      
      if (interviewId) {
        feedbacks = feedbacks.filter((f: StoredFeedback) => f.interviewId === interviewId);
      }
      
      return feedbacks;
    } catch {
      return [];
    }
  }

  // Job Descriptions Storage
  static saveJobDescription(title: string, description: string): string {
    const jobDescriptions = this.getJobDescriptions();
    const id = Date.now().toString();
    const jobDescription = {
      id,
      title,
      description,
      createdAt: new Date().toISOString()
    };
    
    jobDescriptions.push(jobDescription);
    localStorage.setItem(this.KEYS.JOB_DESCRIPTIONS, JSON.stringify(jobDescriptions));
    return id;
  }

  static getJobDescriptions(): any[] {
    try {
      const stored = localStorage.getItem(this.KEYS.JOB_DESCRIPTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Utility Methods
  static clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static exportData(): string {
    const data = {
      resumeAnalyses: this.getResumeAnalyses(),
      jobMatches: this.getJobMatches(),
      interviews: this.getInterviews(),
      feedbackAnalyses: this.getFeedbackAnalyses(),
      jobDescriptions: this.getJobDescriptions(),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  static getStatistics() {
    const resumeAnalyses = this.getResumeAnalyses();
    const jobMatches = this.getJobMatches();
    const interviews = this.getInterviews();
    const feedbacks = this.getFeedbackAnalyses();

    return {
      totalResumes: resumeAnalyses.length,
      totalMatches: jobMatches.length,
      totalInterviews: interviews.length,
      completedInterviews: interviews.filter(i => i.status === 'completed').length,
      pendingInterviews: interviews.filter(i => i.status === 'pending').length,
      confirmedInterviews: interviews.filter(i => i.status === 'confirmed').length,
      totalFeedbacks: feedbacks.length,
      averageMatchScore: jobMatches.length > 0 
        ? Math.round(jobMatches.reduce((sum, match) => sum + match.matchScore, 0) / jobMatches.length)
        : 0
    };
  }
}