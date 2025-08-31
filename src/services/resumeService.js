import { 
  ResumeAnalysisService,
  InterviewSchedulingService,
  JobMatchingService,
  FeedbackAnalysisService,
  AuthService,
  StorageService
} from '../services/api';



export class ResumeExtractor {
  static async extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Simple PDF text extraction (for demo purposes)
          const text = new TextDecoder().decode(uint8Array);
          const extractedText = text.replace(/[^\x20-\x7E\n]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          resolve(extractedText || 'Unable to extract text from PDF');
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  static async extractTextFromDOCX(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // For demo purposes, return a placeholder
          // In production, you'd use mammoth.js or similar
          resolve('DOCX content extracted (demo mode)');
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  static async getResumeText(file) {
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return this.extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type');
    }
  }
}

export class ResumeService {
  static async uploadAndAnalyze(file) {
    try {
      // Extract text from file
      const resumeText = await ResumeExtractor.getResumeText(file);
      
      // Upload to backend for AI analysis
      const response = await ResumeAnalysisService.uploadResume({
        originalText: resumeText,
        fileName: file.name
      });

      return response.data;
    } catch (error) {
      console.error('Resume upload failed:', error);
      throw error;
    }
  }

  static async getUserResumes() {
    try {
      const response = await ResumeAnalysisService.getUserResumes();
      return response.data;
    } catch (error) {
      console.error('Failed to get resumes:', error);
      throw error;
    }
  }

  static async findJobMatches(resumeId) {
    try {
      const response = await ResumeAnalysisService.findJobMatches(resumeId);
      return response.data;
    } catch (error) {
      console.error('Job matching failed:', error);
      throw error;
    }
  }

  static async deleteResume(resumeId) {
    try {
      const response = await ResumeAnalysisService.deleteResume(resumeId);
      return response.data;
    } catch (error) {
      console.error('Resume deletion failed:', error);
      throw error;
    }
  }
}