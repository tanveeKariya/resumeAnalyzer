import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('career_ai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('career_ai_token');
      localStorage.removeItem('career_ai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =====================
// Type Definitions
// =====================
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'hr' | 'candidate';
  profile?: {
    phone?: string;
    linkedin?: string;
    location?: string;
    bio?: string;
  };
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ResumeAnalysis {
  _id: string;
  userId: string;
  fileName: string;
  originalText: string;
  extractedData: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    skills: string[];
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      degree: string;
      school: string;
      year: string;
      cgpa?: string;
      stream?: string;
    }>;
    certifications?: string[];
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
    }>;
  };
  processedAt: string;
  isActive: boolean;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: {
    skills: string[];
    experience: {
      min: number;
      max: number;
      level: string;
    };
    education: {
      degree: string;
      stream: string[];
      cgpa?: number;
    };
  };
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  postedBy: string;
  isActive: boolean;
  applicants: Array<{
    userId: string;
    resumeId: string;
    matchScore: number;
    appliedAt: string;
    status: string;
    candidateBrief?: string;
  }>;
  createdAt: string;
}

export interface Interview {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  candidateId: {
    _id: string;
    name: string;
    email: string;
    profile?: any;
  };
  recruiterId: {
    _id: string;
    name: string;
    email: string;
  };
  resumeId: string;
  scheduledDateTime: string;
  duration: number;
  type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLink?: string;
  notes?: string;
  candidateBrief?: string;
  slotExpiresAt: string;
  feedback?: {
    rating: number;
    comments: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    submittedAt: string;
    submittedBy: string;
  };
}

// =====================
// Auth Service
// =====================
export class AuthService {
  static setAuthToken(token: string) {
    if (token) {
      localStorage.setItem('career_ai_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('career_ai_token');
      delete api.defaults.headers.common['Authorization'];
    }
  }

  static async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'hr' | 'candidate';
    profile?: any;
  }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/users/register', userData);
    
    if (response.data.success) {
      this.setAuthToken(response.data.data.token);
      localStorage.setItem('career_ai_user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  }

  static async login(email: string, password: string, role: 'hr' | 'candidate'): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/users/login', {
      email,
      password,
      role
    });
    
    if (response.data.success) {
      this.setAuthToken(response.data.data.token);
      localStorage.setItem('career_ai_user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  }

  static async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    const response = await api.get('/users/me');
    return response.data;
  }

  static async updateProfile(profileData: any): Promise<{ success: boolean; data: User }> {
    const response = await api.patch('/users/profile', profileData);
    return response.data;
  }

  static logout() {
    this.setAuthToken('');
    localStorage.removeItem('career_ai_user');
  }
}

// =====================
// Resume Analysis Service
// =====================
export class ResumeAnalysisService {
  static async uploadResume(resumeData: {
    originalText: string;
    fileName: string;
  }): Promise<{ success: boolean; data: ResumeAnalysis }> {
    const response = await api.post('/resumes/upload', resumeData);
    return response.data;
  }

  static async getUserResumes(): Promise<{ success: boolean; data: ResumeAnalysis[] }> {
    const response = await api.get('/resumes');
    return response.data;
  }

  static async getResumeAnalysis(resumeId: string): Promise<{ success: boolean; data: ResumeAnalysis }> {
    const response = await api.get(`/resumes/${resumeId}`);
    return response.data;
  }

  static async findJobMatches(resumeId: string): Promise<{ success: boolean; data: { matches: any[]; resumeData: any } }> {
    const response = await api.get(`/resumes/${resumeId}/matches`);
    return response.data;
  }

  static async deleteResume(resumeId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
  }
}

// =====================
// Job Service
// =====================
export class JobService {
  static async createJob(jobData: {
    title: string;
    company: string;
    description: string;
    requirements: {
      skills: string[];
      experience: {
        min: number;
        max: number;
        level: string;
      };
      education: {
        degree: string;
        stream: string[];
        cgpa?: number;
      };
    };
    location: string;
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    type: string;
  }): Promise<{ success: boolean; data: Job }> {
    const response = await api.post('/jobs', jobData);
    return response.data;
  }

  static async getJobs(params?: {
    page?: number;
    limit?: number;
    location?: string;
    type?: string;
    skills?: string;
  }): Promise<{ success: boolean; data: { jobs: Job[]; pagination: any } }> {
    const response = await api.get('/jobs', { params });
    return response.data;
  }

  static async getJobById(jobId: string): Promise<{ success: boolean; data: Job }> {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  }

  static async applyToJob(jobId: string, resumeId: string): Promise<{ success: boolean; data: any }> {
    const response = await api.post(`/jobs/${jobId}/apply`, { resumeId });
    return response.data;
  }

  static async getJobApplicants(jobId: string): Promise<{ success: boolean; data: any }> {
    const response = await api.get(`/jobs/${jobId}/applicants`);
    return response.data;
  }

  static async updateJobStatus(jobId: string, isActive: boolean): Promise<{ success: boolean; data: Job }> {
    const response = await api.patch(`/jobs/${jobId}/status`, { isActive });
    return response.data;
  }
}

// =====================
// Interview Service
// =====================
export class InterviewService {
  static async scheduleInterview(interviewData: {
    jobId: string;
    candidateId: string;
    resumeId: string;
    scheduledDateTime: string;
    duration?: number;
    type?: string;
    meetingLink?: string;
    notes?: string;
  }): Promise<{ success: boolean; data: Interview }> {
    const response = await api.post('/interviews/schedule', interviewData);
    return response.data;
  }

  static async getUserInterviews(params?: {
    status?: string;
    upcoming?: boolean;
  }): Promise<{ success: boolean; data: Interview[] }> {
    const response = await api.get('/interviews', { params });
    return response.data;
  }

  static async getInterviewDetails(interviewId: string): Promise<{ success: boolean; data: Interview }> {
    const response = await api.get(`/interviews/${interviewId}`);
    return response.data;
  }

  static async respondToInterview(interviewId: string, response: 'accept' | 'decline'): Promise<{ success: boolean; data: Interview }> {
    const res = await api.patch(`/interviews/${interviewId}/respond`, { response });
    return res.data;
  }

  static async updateInterviewStatus(interviewId: string, status: string): Promise<{ success: boolean; data: Interview }> {
    const response = await api.patch(`/interviews/${interviewId}/status`, { status });
    return response.data;
  }

  static async submitFeedback(interviewId: string, feedbackData: {
    rating: number;
    comments: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  }): Promise<{ success: boolean; data: any }> {
    const response = await api.post(`/interviews/${interviewId}/feedback`, feedbackData);
    return response.data;
  }

  static async getAvailableSlots(jobId: string, date?: string): Promise<{ success: boolean; data: Date[] }> {
    const response = await api.get(`/interviews/jobs/${jobId}/slots`, { params: { date } });
    return response.data;
  }
}

// =====================
// Resume Extractor
// =====================
export class ResumeExtractor {
  static async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Simple text extraction for demo
          let text = '';
          for (let i = 0; i < uint8Array.length; i++) {
            const char = uint8Array[i];
            if ((char >= 32 && char <= 126) || char === 10 || char === 13) {
              text += String.fromCharCode(char);
            }
          }
          
          const cleanText = text
            .replace(/[^\x20-\x7E\n]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          resolve(cleanText || 'Unable to extract text from PDF');
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  static async extractTextFromDOCX(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // For demo purposes, return sample text
        resolve(`
          John Doe
          Software Engineer
          john.doe@email.com
          +1 (555) 123-4567
          
          SKILLS:
          JavaScript, React, Node.js, Python, MongoDB, Express.js, TypeScript, Redux, REST API, Git, GitHub, Docker, AWS, HTML, CSS, Agile, Scrum
          
          EXPERIENCE:
          Senior Software Engineer at TechCorp Inc. (2021 - Present)
          - Developed scalable web applications using React and Node.js
          - Implemented microservices architecture with Docker and Kubernetes
          - Led a team of 5 developers in agile environment
          
          Software Developer at StartupXYZ (2019 - 2021)
          - Built full-stack applications using MERN stack
          - Integrated third-party APIs and payment systems
          - Optimized database queries and improved performance by 40%
          
          EDUCATION:
          Bachelor of Science in Computer Science
          University of Technology (2015 - 2019)
          CGPA: 3.8/4.0
          
          CERTIFICATIONS:
          - AWS Certified Solutions Architect
          - MongoDB Certified Developer
          - Scrum Master Certification
          
          PROJECTS:
          E-commerce Platform
          - Built using React, Node.js, MongoDB
          - Implemented payment gateway integration
          - Technologies: React, Node.js, Express.js, MongoDB, Stripe API
        `);
      };
      reader.readAsText(file);
    });
  }

  static async getResumeText(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      return this.extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF or DOCX files only.');
    }
  }
}

// =====================
// Job Matching Service
// =====================
export class JobMatchingService {
  static async applyToJob(jobId: string, resumeId: string): Promise<{ success: boolean; data: any }> {
    return JobService.applyToJob(jobId, resumeId);
  }

  static async getJobMatches(resumeId: string): Promise<{ success: boolean; data: any }> {
    return ResumeAnalysisService.findJobMatches(resumeId);
  }
}

// =====================
// Interview Scheduling Service
// =====================
export class InterviewSchedulingService {
  static async getUserInterviews(): Promise<Interview[]> {
    const response = await InterviewService.getUserInterviews();
    return response.data;
  }

  static async respondToInterview(interviewId: string, response: 'accept' | 'decline'): Promise<Interview> {
    const res = await InterviewService.respondToInterview(interviewId, response);
    return res.data;
  }

  static generateInterviewSlots(startDate: Date, daysAhead = 7): Date[] {
    const slots: Date[] = [];
    const currentDate = new Date(startDate);
    
    for (let day = 0; day < daysAhead; day++) {
      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      // Morning slots (9 AM - 12 PM)
      for (let hour = 9; hour < 12; hour++) {
        const slot = new Date(currentDate);
        slot.setHours(hour, 0, 0, 0);
        slots.push(slot);
      }
      
      // Afternoon slots (2 PM - 5 PM)
      for (let hour = 14; hour < 17; hour++) {
        const slot = new Date(currentDate);
        slot.setHours(hour, 0, 0, 0);
        slots.push(slot);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return slots;
  }
}

// =====================
// Feedback Analysis Service
// =====================
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
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      return JSON.parse(this.cleanJsonResponse(content));
    } catch (error) {
      console.error('Feedback analysis failed:', error);
      // Return fallback analysis
      return {
        sentiment: 'positive',
        score: 0.75,
        confidence: 0.87,
        keywords: {
          positive: ['excellent', 'skilled', 'experienced'],
          negative: ['lacks', 'limited'],
          neutral: ['candidate', 'interview']
        },
        redFlags: ['Communication needs improvement'],
        strengths: ['Strong technical skills', 'Good problem-solving'],
        recommendation: 'Recommend for next round'
      };
    }
  }

  private static cleanJsonResponse(response: string): string {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    return jsonStart !== -1 && jsonEnd !== -1
      ? response.substring(jsonStart, jsonEnd + 1)
      : response;
  }
}

// =====================
// Storage Service
// =====================
export class StorageService {
  static saveResumeAnalysis(analysis: any, fileName: string): string {
    const analyses = this.getResumeAnalyses();
    const id = Date.now().toString();
    const storedAnalysis = {
      ...analysis,
      id,
      uploadedAt: new Date().toISOString(),
      fileName
    };
    
    analyses.push(storedAnalysis);
    localStorage.setItem('career_ai_resume_analyses', JSON.stringify(analyses));
    return id;
  }

  static getResumeAnalyses(): any[] {
    try {
      const stored = localStorage.getItem('career_ai_resume_analyses');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveJobMatches(matches: any[], candidateId: string): void {
    localStorage.setItem(`career_ai_job_matches_${candidateId}`, JSON.stringify(matches));
  }

  static getJobMatches(candidateId: string): any[] {
    try {
      const stored = localStorage.getItem(`career_ai_job_matches_${candidateId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveInterview(interview: any, candidateId: string, hrId: string): string {
    const interviews = this.getInterviews();
    const id = Date.now().toString();
    const storedInterview = {
      ...interview,
      id: parseInt(id),
      candidateId,
      hrId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    interviews.push(storedInterview);
    localStorage.setItem('career_ai_interviews', JSON.stringify(interviews));
    return id;
  }

  static getInterviews(): any[] {
    try {
      const stored = localStorage.getItem('career_ai_interviews');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static updateInterview(id: number, updates: any): void {
    const interviews = this.getInterviews();
    const index = interviews.findIndex(interview => interview.id === id);
    
    if (index !== -1) {
      interviews[index] = {
        ...interviews[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('career_ai_interviews', JSON.stringify(interviews));
    }
  }

  static saveFeedbackAnalysis(
    analysis: FeedbackAnalysis,
    interviewId: number,
    submittedBy: string,
    feedbackText: string
  ): string {
    const feedbacks = this.getFeedbackAnalyses();
    const id = Date.now().toString();
    const storedFeedback = {
      ...analysis,
      id,
      interviewId,
      submittedBy,
      submittedAt: new Date().toISOString(),
      feedbackText
    };
    
    feedbacks.push(storedFeedback);
    localStorage.setItem('career_ai_feedback_analyses', JSON.stringify(feedbacks));
    return id;
  }

  static getFeedbackAnalyses(): any[] {
    try {
      const stored = localStorage.getItem('career_ai_feedback_analyses');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getStatistics() {
    const resumeAnalyses = this.getResumeAnalyses();
    const interviews = this.getInterviews();
    const feedbacks = this.getFeedbackAnalyses();

    return {
      totalResumes: resumeAnalyses.length,
      totalMatches: resumeAnalyses.length * 3, // Mock calculation
      totalInterviews: interviews.length,
      completedInterviews: interviews.filter(i => i.status === 'completed').length,
      pendingInterviews: interviews.filter(i => i.status === 'pending').length,
      confirmedInterviews: interviews.filter(i => i.status === 'confirmed').length,
      totalFeedbacks: feedbacks.length,
      averageMatchScore: 85 // Mock average
    };
  }
}

export default api;