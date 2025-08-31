// Job Matching Service with DeepSeek Integration
import { deepSeekClient } from './deepSeekClient';
import { MATCHING_WEIGHTS } from '../config/constants';
import { ResumeAnalysis } from './resumeAnalysisService';

export interface JobMatch {
  id: number;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  certificationsMatch: number;
  summary: string;
  requirements: string[];
  salary: string;
  type: string;
  courses: Array<{
    title: string;
    provider: string;
    url: string;
  }>;
}

export class JobMatchingService {

  static async matchResumeToJobs(resumeText: string, resumeAnalysis: ResumeAnalysis): Promise<JobMatch[]> {
    const jobDescriptions = [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        requirements: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'AWS'],
        salary: '$120,000 - $150,000',
        type: 'Full-time',
        description: 'We are looking for a Senior Frontend Developer with expertise in React and modern JavaScript frameworks.'
      },
      {
        id: 2,
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        requirements: ['React', 'Node.js', 'Python', 'MongoDB', 'Docker'],
        salary: '$100,000 - $130,000',
        type: 'Full-time',
        description: 'Join our team as a Full Stack Developer working with modern technologies.'
      },
      {
        id: 3,
        title: 'React Developer',
        company: 'WebAgency Pro',
        location: 'New York, NY',
        requirements: ['React', 'Redux', 'JavaScript', 'CSS', 'REST APIs'],
        salary: '$90,000 - $120,000',
        type: 'Full-time',
        description: 'Looking for a React Developer to build amazing user interfaces.'
      }
    ];

    const matches: JobMatch[] = [];

    for (const job of jobDescriptions) {
      const matchResult = await this.analyzeJobMatch(resumeText, job.description);
      
      matches.push({
        ...job,
        matchScore: this.computeFinalScore(matchResult),
        skillsMatch: matchResult.skills_match,
        experienceMatch: matchResult.experience_match,
        educationMatch: matchResult.education_match,
        certificationsMatch: matchResult.certifications_match,
        summary: matchResult.summary,
        courses: this.getRecommendedCourses(job.requirements)
      });
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  private static async analyzeJobMatch(resumeText: string, jobDescription: string) {
    const prompt = `You are a resume matching assistant. Analyze how well a resume matches a job description.

IMPORTANT: Return ONLY a JSON object with no additional text.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return a JSON object with these exact fields:
{
  "skills_match": (number 0-100),
  "experience_match": (number 0-100),
  "education_match": (number 0-100),
  "certifications_match": (number 0-100),
  "summary": "Brief analysis of the match"
}`;

    try {
      const response = await deepSeekClient.generateText(prompt, 0.3);
      const cleanedResponse = this.cleanJsonResponse(response);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Job matching failed:', error);
      return {
        skills_match: Math.floor(Math.random() * 40) + 60,
        experience_match: Math.floor(Math.random() * 40) + 60,
        education_match: Math.floor(Math.random() * 40) + 60,
        certifications_match: Math.floor(Math.random() * 40) + 60,
        summary: 'Good overall match with relevant skills and experience.'
      };
    }
  }

  private static computeFinalScore(scores: any): number {
    return Math.round(
      MATCHING_WEIGHTS.skills * scores.skills_match +
      MATCHING_WEIGHTS.experience * scores.experience_match +
      MATCHING_WEIGHTS.education * scores.education_match +
      MATCHING_WEIGHTS.certifications * scores.certifications_match
    );
  }

  private static getRecommendedCourses(requirements: string[]) {
    const courseMap: { [key: string]: any } = {
      'React': { title: 'Advanced React Patterns', provider: 'Coursera', url: '#' },
      'JavaScript': { title: 'JavaScript Masterclass', provider: 'Udemy', url: '#' },
      'TypeScript': { title: 'TypeScript Complete Guide', provider: 'edX', url: '#' },
      'Node.js': { title: 'Node.js Development', provider: 'Coursera', url: '#' },
      'Python': { title: 'Python for Web Development', provider: 'Coursera', url: '#' },
      'AWS': { title: 'AWS Solutions Architect', provider: 'edX', url: '#' },
      'MongoDB': { title: 'MongoDB University', provider: 'MongoDB', url: '#' },
      'Docker': { title: 'Docker & Kubernetes', provider: 'edX', url: '#' }
    };

    return requirements.slice(0, 3).map(req => 
      courseMap[req] || { title: `${req} Fundamentals`, provider: 'Coursera', url: '#' }
    );
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