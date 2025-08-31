// API Configuration Constants
export const DEEPSEEK_API_KEY = 'sk-57104a7f80b94a2eb28e88abe51203b6';
export const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Application Constants
export const APP_NAME = 'CareerAI';
export const VERSION = '1.0.0';

// File Upload Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Matching Algorithm Weights
export const MATCHING_WEIGHTS = {
  skills: 0.4,
  experience: 0.3,
  education: 0.2,
  certifications: 0.1
};

// Interview Scheduling Constants
export const BUSINESS_HOURS = {
  start: 9,
  end: 17,
  lunchBreak: { start: 12, end: 14 }
};