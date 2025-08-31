import { ResumeExtractor, ResumeAnalysisService } from './api';

export class ResumeService {
  static async uploadAndAnalyze(file: File) {
    try {
      // Extract text from file
      const resumeText = await ResumeExtractor.getResumeText(file);
      
      // Upload to backend for AI analysis
      const response = await ResumeAnalysisService.uploadResume({
        originalText: resumeText,
        fileName: file.name
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to upload resume');
      }

      return {
        resumeId: response.data._id,
        extractedData: response.data.extractedData
      };
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

  static async findJobMatches(resumeId: string) {
    try {
      const response = await ResumeAnalysisService.findJobMatches(resumeId);
      return response.data;
    } catch (error) {
      console.error('Job matching failed:', error);
      throw error;
    }
  }

  static async deleteResume(resumeId: string) {
    try {
      const response = await ResumeAnalysisService.deleteResume(resumeId);
      return response.data;
    } catch (error) {
      console.error('Resume deletion failed:', error);
      throw error;
    }
  }
}