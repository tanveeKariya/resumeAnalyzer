import { ResumeExtractor, ResumeAnalysisService, EnhancedNLPService } from './api';

export class ResumeService {
  static async uploadAndAnalyze(file: File) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload a file smaller than 10MB.');
      }

      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.docx')) {
        throw new Error('Invalid file type. Please upload a PDF or DOCX file.');
      }

      // Extract text from file
      console.log('Extracting text from file:', file.name);
      const resumeText = await ResumeExtractor.getResumeText(file);
      
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Unable to extract meaningful text from the file. Please ensure the file contains readable text.');
      }

      console.log('Text extracted successfully, length:', resumeText.length);

      // Upload to backend for AI analysis
      const response = await ResumeAnalysisService.uploadResume({
        originalText: resumeText,
        fileName: file.name
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to upload resume');
      }

      console.log('Resume analysis completed successfully');

      return {
        resumeId: response.data._id,
        extractedData: response.data.extractedData
      };
    } catch (error: any) {
      console.error('Resume upload failed:', error);
      throw new Error(error.message || 'Failed to process resume. Please try again.');
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

  static async analyzeResumeText(resumeText: string) {
    try {
      return await EnhancedNLPService.extractResumeData(resumeText);
    } catch (error) {
      console.error('Resume text analysis failed:', error);
      throw error;
    }
  }
}