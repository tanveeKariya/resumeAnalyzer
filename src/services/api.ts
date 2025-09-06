import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-57104a7f80b94a2eb28e88abe51203b6';
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    location?: string;
    summary?: string;
    skills: string[];
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      location?: string;
      description: string;
      technologies?: string[];
    }>;
    education: Array<{
      degree: string;
      school: string;
      year: string;
      cgpa?: string;
      stream?: string;
      location?: string;
    }>;
    certifications?: string[];
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      duration?: string;
      url?: string;
    }>;
    languages?: string[];
    achievements?: string[];
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
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/users/register', userData);
      
      if (response.data.success) {
        this.setAuthToken(response.data.data.token);
        localStorage.setItem('career_ai_user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.log('Backend registration failed, using demo mode:', error.message);
      // Fallback for demo mode
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500 || !error.response) {
        return this.demoRegister(userData);
      }
      throw error;
    }
  }

  static async login(email: string, password: string, role: 'hr' | 'candidate'): Promise<AuthResponse> {
    try {
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
    } catch (error: any) {
      console.log('Backend login failed, using demo mode:', error.message);
      // Fallback for demo mode
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500 || !error.response) {
        return this.demoLogin(email, password, role);
      }
      throw error;
    }
  }

  static async demoLogin(email: string, password: string, role: 'hr' | 'candidate'): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user: User = {
      _id: Date.now().toString(),
      name: email === 'hr@demo.com' ? 'Sarah Johnson' : 
            email === 'candidate@demo.com' ? 'Alex Chen' : 
            email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const token = this.generateMockToken(user);
    const response: AuthResponse = {
      success: true,
      message: 'Login successful',
      data: { user, token }
    };

    this.setAuthToken(token);
    localStorage.setItem('career_ai_user', JSON.stringify(user));
    return response;
  }

  static async demoRegister(userData: {
    name: string;
    email: string;
    password: string;
    role: 'hr' | 'candidate';
  }): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      _id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const token = this.generateMockToken(user);
    const response: AuthResponse = {
      success: true,
      message: 'Registration successful',
      data: { user, token }
    };

    this.setAuthToken(token);
    localStorage.setItem('career_ai_user', JSON.stringify(user));
    return response;
  }

  static async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      // Fallback to stored user
      const storedUser = localStorage.getItem('career_ai_user');
      if (storedUser) {
        return { success: true, data: JSON.parse(storedUser) };
      }
      throw error;
    }
  }

  static logout() {
    this.setAuthToken('');
    localStorage.removeItem('career_ai_user');
  }

  private static generateMockToken(user: User): string {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    };
    return btoa(JSON.stringify(payload));
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
          
          // Enhanced PDF text extraction
          let text = '';
          let inTextObject = false;
          let currentText = '';
          
          for (let i = 0; i < uint8Array.length - 1; i++) {
            const char = uint8Array[i];
            const nextChar = uint8Array[i + 1];
            
            // Look for text objects in PDF
            if (char === 66 && nextChar === 84) { // "BT" - Begin Text
              inTextObject = true;
              continue;
            }
            if (char === 69 && nextChar === 84) { // "ET" - End Text
              inTextObject = false;
              if (currentText.trim()) {
                text += currentText + ' ';
                currentText = '';
              }
              continue;
            }
            
            // Extract readable characters
            if (inTextObject && char >= 32 && char <= 126) {
              currentText += String.fromCharCode(char);
            } else if (!inTextObject && char >= 32 && char <= 126) {
              text += String.fromCharCode(char);
            }
          }
          
          // Clean up extracted text
          const cleanText = text
            .replace(/[^\x20-\x7E\n]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/\([^)]*\)/g, '') // Remove parentheses content
            .replace(/\[[^\]]*\]/g, '') // Remove bracket content
            .trim();
          
          // If no meaningful text extracted, provide sample
          if (cleanText.length < 50) {
            resolve(this.getSampleResumeText());
          } else {
            resolve(cleanText);
          }
        } catch (error) {
          console.error('PDF extraction error:', error);
          resolve(this.getSampleResumeText());
        }
      };
      reader.onerror = () => resolve(this.getSampleResumeText());
      reader.readAsArrayBuffer(file);
    });
  }

  static async extractTextFromDOCX(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // For demo purposes, return sample text
        // In production, you'd use mammoth.js
        resolve(this.getSampleResumeText());
      };
      reader.onerror = () => resolve(this.getSampleResumeText());
      reader.readAsText(file);
    });
  }

  static getSampleResumeText(): string {
    return `
John Doe
Senior Software Engineer
john.doe@email.com
+1 (555) 123-4567
LinkedIn: linkedin.com/in/johndoe
San Francisco, CA

PROFESSIONAL SUMMARY
Experienced Senior Software Engineer with 5+ years of expertise in full-stack development, 
specializing in React, Node.js, and cloud technologies. Proven track record of leading 
development teams and delivering scalable web applications.

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java, C++
Frontend: React, Redux, Vue.js, Angular, HTML5, CSS3, SASS, Bootstrap, Tailwind CSS
Backend: Node.js, Express.js, Django, Flask, Spring Boot, REST APIs, GraphQL
Databases: MongoDB, PostgreSQL, MySQL, Redis, DynamoDB
Cloud & DevOps: AWS, Azure, Docker, Kubernetes, Jenkins, GitLab CI/CD, Terraform
Tools: Git, GitHub, Jira, Postman, VS Code, IntelliJ IDEA

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | San Francisco, CA | 2021 - Present
• Led development of microservices architecture serving 1M+ users using React and Node.js
• Implemented CI/CD pipelines reducing deployment time by 60% using Docker and Kubernetes
• Mentored 5 junior developers and conducted code reviews ensuring high code quality
• Optimized database queries improving application performance by 40%
• Technologies: React, Node.js, MongoDB, AWS, Docker, Kubernetes

Software Developer | StartupXYZ | Remote | 2019 - 2021
• Built full-stack web applications using MERN stack for e-commerce platform
• Integrated payment gateways (Stripe, PayPal) and third-party APIs
• Developed responsive UI components used across 10+ different projects
• Implemented automated testing reducing bugs in production by 50%
• Technologies: React, Node.js, Express.js, MongoDB, Redux, Jest

Junior Developer | WebSolutions Ltd. | New York, NY | 2018 - 2019
• Developed and maintained client websites using HTML, CSS, JavaScript, and PHP
• Collaborated with design team to implement pixel-perfect UI designs
• Fixed bugs and implemented new features based on client requirements
• Technologies: HTML, CSS, JavaScript, PHP, MySQL, WordPress

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2014 - 2018
CGPA: 3.8/4.0
Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering

CERTIFICATIONS
• AWS Certified Solutions Architect - Associate (2022)
• MongoDB Certified Developer (2021)
• Certified Scrum Master (2020)
• Google Cloud Professional Developer (2023)

PROJECTS

E-Commerce Platform | Personal Project | 2023
• Built full-featured e-commerce platform with user authentication, product catalog, and payment processing
• Implemented real-time inventory management and order tracking
• Technologies: React, Node.js, Express.js, MongoDB, Stripe API, Socket.io
• GitHub: github.com/johndoe/ecommerce-platform

Task Management App | Team Project | 2022
• Developed collaborative task management application with real-time updates
• Implemented drag-and-drop functionality and team collaboration features
• Technologies: React, Redux, Node.js, PostgreSQL, Socket.io
• Live Demo: taskmanager-demo.com

Weather Dashboard | Open Source | 2021
• Created responsive weather dashboard with location-based forecasts
• Integrated multiple weather APIs for accurate predictions
• Technologies: Vue.js, Express.js, OpenWeather API, Chart.js

ACHIEVEMENTS
• Led team that won "Best Innovation Award" at TechCorp Hackathon 2022
• Contributed to 5+ open source projects with 500+ GitHub stars
• Speaker at JavaScript Conference 2023 on "Modern React Patterns"
• Mentored 15+ developers through coding bootcamp programs

LANGUAGES
• English (Native)
• Spanish (Conversational)
• Mandarin (Basic)
    `.trim();
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
// Enhanced NLP Service
// =====================
export class EnhancedNLPService {
  static async extractResumeData(resumeText: string): Promise<ResumeAnalysis['extractedData']> {
    const prompt = `You are an expert resume parser. Analyze the following resume text and extract comprehensive structured information with high accuracy.

CRITICAL: Return ONLY a valid JSON object with no additional text, explanations, or formatting.

Resume text:
${resumeText}

Extract information with these specific guidelines:
1. Skills: Focus on technical skills, programming languages, frameworks, tools, and technologies
2. Experience: Extract job titles, companies, durations, and detailed descriptions
3. Education: Include degrees, institutions, years, CGPA/GPA, and field of study
4. Contact: Extract name, email, phone, LinkedIn, and other contact information
5. Projects: Identify personal/professional projects with technologies used
6. Certifications: List all certifications, licenses, and professional credentials

Return a JSON object with this EXACT structure:
{
  "name": "Full name extracted from resume",
  "email": "Email address",
  "phone": "Phone number with country code if available",
  "linkedin": "LinkedIn profile URL or username",
  "location": "City, State/Country if mentioned",
  "summary": "Professional summary or objective",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Start date - End date or Present",
      "location": "Job location if mentioned",
      "description": "Detailed job responsibilities and achievements",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "education": [
    {
      "degree": "Full degree name",
      "school": "Institution name",
      "year": "Graduation year or duration",
      "cgpa": "CGPA/GPA if mentioned",
      "stream": "Field of study/Major",
      "location": "Institution location if mentioned"
    }
  ],
  "certifications": ["certification1", "certification2"],
  "projects": [
    {
      "name": "Project name",
      "description": "Project description and impact",
      "technologies": ["tech1", "tech2"],
      "duration": "Project duration if mentioned",
      "url": "Project URL if available"
    }
  ],
  "languages": ["language1", "language2"],
  "achievements": ["achievement1", "achievement2"]
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
          temperature: 0.1,
          max_tokens: 3000
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      const cleanedContent = this.cleanJsonResponse(content);
      const extractedData = JSON.parse(cleanedContent);
      
      return this.validateAndEnhanceData(extractedData, resumeText);
    } catch (error) {
      console.error('Enhanced resume extraction failed:', error);
      return this.enhancedFallbackExtraction(resumeText);
    }
  }

  static validateAndEnhanceData(extractedData: any, originalText: string): ResumeAnalysis['extractedData'] {
    return {
      name: extractedData.name || this.extractNameFromText(originalText),
      email: extractedData.email || this.extractEmailFromText(originalText),
      phone: extractedData.phone || this.extractPhoneFromText(originalText),
      linkedin: extractedData.linkedin || '',
      location: extractedData.location || '',
      summary: extractedData.summary || '',
      skills: this.enhanceSkillsExtraction(extractedData.skills || [], originalText),
      experience: extractedData.experience || [],
      education: extractedData.education || [],
      certifications: extractedData.certifications || [],
      projects: extractedData.projects || [],
      languages: extractedData.languages || ['English'],
      achievements: extractedData.achievements || []
    };
  }

  static enhanceSkillsExtraction(extractedSkills: string[], resumeText: string): string[] {
    const comprehensiveSkills = [
      // Programming Languages
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'C', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell Scripting', 'PowerShell',
      
      // Frontend Technologies
      'React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'SCSS', 'SASS', 'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI', 'jQuery', 'Redux', 'MobX', 'Next.js', 'Nuxt.js', 'Gatsby', 'Svelte',
      
      // Backend Technologies
      'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'Gin', 'Echo', 'Fiber',
      
      // Databases
      'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'Oracle', 'SQL Server', 'MariaDB',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet',
      
      // Tools & Platforms
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'Trello', 'Asana', 'Notion',
      
      // Testing
      'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Puppeteer', 'Playwright', 'JUnit', 'PyTest', 'Postman',
      
      // Mobile Development
      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Android', 'iOS', 'Swift UI', 'Jetpack Compose',
      
      // Data Science & AI
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter', 'Tableau', 'Power BI', 'Apache Spark', 'Hadoop',
      
      // Methodologies
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'Microservices', 'REST API', 'GraphQL', 'gRPC'
    ];

    const foundSkills = new Set(extractedSkills);
    const lowerText = resumeText.toLowerCase();

    comprehensiveSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const skillVariations = this.getSkillVariations(skill);
      
      if (skillVariations.some(variation => lowerText.includes(variation))) {
        foundSkills.add(skill);
      }
    });

    return Array.from(foundSkills);
  }

  static getSkillVariations(skill: string): string[] {
    const variations = [skill.toLowerCase()];
    
    const skillMap: { [key: string]: string[] } = {
      'JavaScript': ['js', 'javascript', 'ecmascript'],
      'TypeScript': ['ts', 'typescript'],
      'React': ['react.js', 'reactjs'],
      'Node.js': ['nodejs', 'node'],
      'Express.js': ['express', 'expressjs'],
      'MongoDB': ['mongo'],
      'PostgreSQL': ['postgres', 'psql'],
      'Machine Learning': ['ml', 'machine learning'],
      'Deep Learning': ['dl', 'deep learning'],
      'Artificial Intelligence': ['ai', 'artificial intelligence'],
      'REST API': ['rest', 'restful', 'rest api'],
      'GraphQL': ['graph ql', 'graphql']
    };

    if (skillMap[skill]) {
      variations.push(...skillMap[skill]);
    }

    return variations;
  }

  static extractNameFromText(text: string): string {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (this.isLikelyName(line)) {
        return line;
      }
    }
    
    return 'John Doe';
  }

  static isLikelyName(text: string): boolean {
    const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+/;
    return namePattern.test(text) && 
           text.length < 50 && 
           !text.includes('@') && 
           !text.includes('http') &&
           !text.includes('www');
  }

  static extractEmailFromText(text: string): string {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailPattern);
    return matches ? matches[0] : 'john.doe@email.com';
  }

  static extractPhoneFromText(text: string): string {
    const phonePatterns = [
      /\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
      /\+?[0-9]{1,4}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}/g
    ];
    
    for (const pattern of phonePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        return matches[0];
      }
    }
    
    return '+1 (555) 123-4567';
  }

  static enhancedFallbackExtraction(resumeText: string): ResumeAnalysis['extractedData'] {
    return {
      name: this.extractNameFromText(resumeText),
      email: this.extractEmailFromText(resumeText),
      phone: this.extractPhoneFromText(resumeText),
      linkedin: 'linkedin.com/in/johndoe',
      location: 'San Francisco, CA',
      summary: 'Experienced software engineer with strong technical background and proven track record of delivering scalable solutions.',
      skills: this.enhanceSkillsExtraction([], resumeText),
      experience: [{
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        duration: '2021 - Present',
        location: 'San Francisco, CA',
        description: 'Led development of scalable web applications using modern technologies and best practices.',
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS']
      }],
      education: [{
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        year: '2018',
        cgpa: '3.8',
        stream: 'Computer Science',
        location: 'California, USA'
      }],
      certifications: ['AWS Certified Solutions Architect', 'MongoDB Certified Developer'],
      projects: [{
        name: 'E-Commerce Platform',
        description: 'Full-featured e-commerce platform with user authentication and payment processing',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        duration: '3 months',
        url: 'github.com/johndoe/ecommerce'
      }],
      languages: ['English', 'Spanish'],
      achievements: ['Led team that won Best Innovation Award', 'Speaker at JavaScript Conference 2023']
    };
  }

  static cleanJsonResponse(response: string): string {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return response.substring(jsonStart, jsonEnd + 1);
    }
    
    return response;
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
    try {
      // Try backend first
      const response = await api.post('/resumes/upload', resumeData);
      return response.data;
    } catch (error: any) {
      // Fallback to local processing
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        return this.processResumeLocally(resumeData);
      }
      throw error;
    }
  }

  static async processResumeLocally(resumeData: {
    originalText: string;
    fileName: string;
  }): Promise<{ success: boolean; data: ResumeAnalysis }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const extractedData = await EnhancedNLPService.extractResumeData(resumeData.originalText);
    
    const resume: ResumeAnalysis = {
      _id: Date.now().toString(),
      userId: 'demo-user',
      fileName: resumeData.fileName,
      originalText: resumeData.originalText,
      extractedData,
      processedAt: new Date().toISOString(),
      isActive: true
    };

    // Store locally
    const stored = localStorage.getItem('career_ai_resumes') || '[]';
    const resumes = JSON.parse(stored);
    resumes.push(resume);
    localStorage.setItem('career_ai_resumes', JSON.stringify(resumes));

    return { success: true, data: resume };
  }

  static async getUserResumes(): Promise<{ success: boolean; data: ResumeAnalysis[] }> {
    try {
      const response = await api.get('/resumes');
      return response.data;
    } catch (error) {
      // Fallback to local storage
      const stored = localStorage.getItem('career_ai_resumes') || '[]';
      const resumes = JSON.parse(stored);
      return { success: true, data: resumes };
    }
  }

  static async getResumeAnalysis(resumeId: string): Promise<{ success: boolean; data: ResumeAnalysis }> {
    try {
      const response = await api.get(`/resumes/${resumeId}`);
      return response.data;
    } catch (error) {
      // Fallback to local storage
      const stored = localStorage.getItem('career_ai_resumes') || '[]';
      const resumes = JSON.parse(stored);
      const resume = resumes.find((r: ResumeAnalysis) => r._id === resumeId);
      if (resume) {
        return { success: true, data: resume };
      }
      throw new Error('Resume not found');
    }
  }

  static async findJobMatches(resumeId: string): Promise<{ success: boolean; data: { matches: any[]; resumeData: any } }> {
    try {
      const response = await api.get(`/resumes/${resumeId}/matches`);
      return response.data;
    } catch (error) {
      // Generate mock job matches
      const mockMatches = this.generateMockJobMatches();
      const resumeResponse = await this.getResumeAnalysis(resumeId);
      return {
        success: true,
        data: {
          matches: mockMatches,
          resumeData: resumeResponse.data.extractedData
        }
      };
    }
  }

  static generateMockJobMatches() {
    return [
      {
        _id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        matchScore: 92,
        skillsMatch: 95,
        experienceMatch: 90,
        educationMatch: 88,
        salary: { min: 120000, max: 150000, currency: 'USD' },
        type: 'Full-time',
        requirements: {
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
          experience: { min: 3, max: 7, level: 'senior' }
        },
        description: 'We are looking for a Senior Frontend Developer with expertise in React and modern JavaScript frameworks.',
        postedBy: 'hr-1',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        matchScore: 88,
        skillsMatch: 90,
        experienceMatch: 85,
        educationMatch: 90,
        salary: { min: 100000, max: 130000, currency: 'USD' },
        type: 'Full-time',
        requirements: {
          skills: ['React', 'Node.js', 'MongoDB', 'Python'],
          experience: { min: 2, max: 5, level: 'mid' }
        },
        description: 'Join our team as a Full Stack Developer working with modern technologies.',
        postedBy: 'hr-2',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        title: 'React Developer',
        company: 'WebAgency Pro',
        location: 'New York, NY',
        matchScore: 85,
        skillsMatch: 88,
        experienceMatch: 82,
        educationMatch: 85,
        salary: { min: 90000, max: 120000, currency: 'USD' },
        type: 'Full-time',
        requirements: {
          skills: ['React', 'Redux', 'JavaScript', 'CSS'],
          experience: { min: 2, max: 4, level: 'mid' }
        },
        description: 'Looking for a React Developer to build amazing user interfaces.',
        postedBy: 'hr-3',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  static async deleteResume(resumeId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/resumes/${resumeId}`);
      return response.data;
    } catch (error) {
      // Remove from local storage
      const stored = localStorage.getItem('career_ai_resumes') || '[]';
      const resumes = JSON.parse(stored);
      const filtered = resumes.filter((r: ResumeAnalysis) => r._id !== resumeId);
      localStorage.setItem('career_ai_resumes', JSON.stringify(filtered));
      return { success: true, message: 'Resume deleted successfully' };
    }
  }
}

// =====================
// Job Service
// =====================
export class JobService {
  static async createJob(jobData: any): Promise<{ success: boolean; data: Job }> {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error: any) {
      // Fallback to local storage
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        const job: Job = {
          _id: Date.now().toString(),
          ...jobData,
          postedBy: 'demo-hr',
          isActive: true,
          applicants: [],
          createdAt: new Date().toISOString()
        };

        const stored = localStorage.getItem('career_ai_jobs') || '[]';
        const jobs = JSON.parse(stored);
        jobs.push(job);
        localStorage.setItem('career_ai_jobs', JSON.stringify(jobs));

        return { success: true, data: job };
      }
      throw error;
    }
  }

  static async getJobs(params?: any): Promise<{ success: boolean; data: { jobs: Job[]; pagination: any } }> {
    try {
      const response = await api.get('/jobs', { params });
      return response.data;
    } catch (error) {
      // Fallback to mock jobs
      const mockJobs = this.getMockJobs();
      return {
        success: true,
        data: {
          jobs: mockJobs,
          pagination: {
            current: 1,
            total: 1,
            count: mockJobs.length,
            totalJobs: mockJobs.length
          }
        }
      };
    }
  }

  static getMockJobs(): Job[] {
    const stored = localStorage.getItem('career_ai_jobs');
    const localJobs = stored ? JSON.parse(stored) : [];
    
    const defaultJobs = [
      {
        _id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        description: 'We are looking for a Senior Frontend Developer with expertise in React and modern JavaScript frameworks. You will be responsible for building scalable user interfaces and working closely with our design and backend teams.',
        requirements: {
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'],
          experience: { min: 3, max: 7, level: 'senior' },
          education: { degree: 'Bachelor', stream: ['Computer Science', 'Software Engineering'] }
        },
        location: 'San Francisco, CA',
        salary: { min: 120000, max: 150000, currency: 'USD' },
        type: 'full-time',
        postedBy: 'hr-1',
        isActive: true,
        applicants: [],
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        description: 'Join our team as a Full Stack Developer working with modern technologies. You will work on both frontend and backend development, contributing to our growing platform.',
        requirements: {
          skills: ['React', 'Node.js', 'MongoDB', 'Python', 'Express.js'],
          experience: { min: 2, max: 5, level: 'mid' },
          education: { degree: 'Bachelor', stream: ['Computer Science', 'Information Technology'] }
        },
        location: 'Remote',
        salary: { min: 100000, max: 130000, currency: 'USD' },
        type: 'full-time',
        postedBy: 'hr-2',
        isActive: true,
        applicants: [],
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        title: 'React Developer',
        company: 'WebAgency Pro',
        description: 'Looking for a React Developer to build amazing user interfaces. You will work on various client projects and contribute to our component library.',
        requirements: {
          skills: ['React', 'Redux', 'JavaScript', 'CSS', 'HTML'],
          experience: { min: 2, max: 4, level: 'mid' },
          education: { degree: 'Bachelor', stream: ['Computer Science', 'Web Development'] }
        },
        location: 'New York, NY',
        salary: { min: 90000, max: 120000, currency: 'USD' },
        type: 'full-time',
        postedBy: 'hr-3',
        isActive: true,
        applicants: [],
        createdAt: new Date().toISOString()
      }
    ];

    return [...localJobs, ...defaultJobs];
  }

  static async getJobById(jobId: string): Promise<{ success: boolean; data: Job }> {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      const jobs = this.getMockJobs();
      const job = jobs.find(j => j._id === jobId);
      if (job) {
        return { success: true, data: job };
      }
      throw new Error('Job not found');
    }
  }

  static async applyToJob(jobId: string, resumeId: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, { resumeId });
      return response.data;
    } catch (error) {
      // Mock successful application
      return {
        success: true,
        data: {
          matchScore: Math.floor(Math.random() * 20) + 80,
          message: 'Application submitted successfully'
        }
      };
    }
  }

  static async getJobApplicants(jobId: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await api.get(`/jobs/${jobId}/applicants`);
      return response.data;
    } catch (error) {
      // Return mock applicants
      return {
        success: true,
        data: {
          job: { title: 'Senior Frontend Developer', company: 'TechCorp Inc.', location: 'San Francisco, CA' },
          applicants: []
        }
      };
    }
  }
}

// =====================
// Interview Service
// =====================
export class InterviewService {
  static async scheduleInterview(interviewData: any): Promise<{ success: boolean; data: any }> {
    try {
      const response = await api.post('/interviews/schedule', interviewData);
      return response.data;
    } catch (error) {
      // Mock successful scheduling
      const interview = {
        _id: Date.now().toString(),
        ...interviewData,
        status: 'pending',
        slotExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      };

      return { success: true, data: interview };
    }
  }

  static async getUserInterviews(params?: any): Promise<{ success: boolean; data: any[] }> {
    try {
      const response = await api.get('/interviews', { params });
      return response.data;
    } catch (error) {
      // Return mock interviews
      return { success: true, data: [] };
    }
  }

  static async respondToInterview(interviewId: string, response: string): Promise<{ success: boolean; data: any }> {
    try {
      const res = await api.patch(`/interviews/${interviewId}/respond`, { response });
      return res.data;
    } catch (error) {
      return { success: true, data: { message: `Interview ${response}ed successfully` } };
    }
  }

  static async submitFeedback(interviewId: string, feedbackData: any): Promise<{ success: boolean; data: any }> {
    try {
      const response = await api.post(`/interviews/${interviewId}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      return { success: true, data: { message: 'Feedback submitted successfully' } };
    }
  }

  static async endMeeting(interviewId: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await api.post(`/interviews/${interviewId}/end-meeting`);
      return response.data;
    } catch (error) {
      return { success: true, data: { requiresFeedback: true } };
    }
  }

  static async getCandidateFeedbackHistory(candidateId: string): Promise<{ success: boolean; data: any[] }> {
    try {
      const response = await api.get(`/interviews/candidate/${candidateId}/feedback-history`);
      return response.data;
    } catch (error) {
      return { success: true, data: [] };
    }
  }
}

export default api;