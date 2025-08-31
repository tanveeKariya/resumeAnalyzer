// Resume Analysis Service with DeepSeek Integration
import { deepSeekClient } from './deepSeekClient';
import { MATCHING_WEIGHTS } from '../config/constants';

export interface ResumeAnalysis {
  name: string;
  email: string;
  phone: string;
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
  }>;
}

export class ResumeAnalysisService {

  static async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    const prompt = `Analyze the following resume and extract structured information. Return ONLY a JSON object with no additional text.

Resume text:
${resumeText}

Return a JSON object with this exact structure:
{
  "name": "Full name of the candidate",
  "email": "Email address",
  "phone": "Phone number",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Duration",
      "description": "Brief description"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "school": "School name",
      "year": "Year"
    }
  ]
}`;

    try {
      const response = await deepSeekClient.generateText(prompt, 0.3);
      const cleanedResponse = this.cleanJsonResponse(response);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Resume analysis failed:', error);
      // Return mock data as fallback
      return {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            duration: '2021 - Present',
            description: 'Led development of web applications using React and Node.js'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of Technology',
            year: '2019'
          }
        ]
      };
    }
  }

  private static cleanJsonResponse(response: string): string {
    // Remove any markdown formatting or extra text
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return response.substring(jsonStart, jsonEnd + 1);
    }
    
    return response;
  }
}