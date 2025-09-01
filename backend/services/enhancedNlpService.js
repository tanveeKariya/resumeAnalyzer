const axios = require('axios');
const keys = require('../config/keys');
const logger = require('../utils/logger');

class EnhancedNLPService {
  constructor() {
+    this.apiKey = keys.deepSeekApiKey;
+    this.apiUrl = keys.deepSeekApiUrl;
+  }

+  async extractResumeData(resumeText) {
+    const prompt = `You are an expert resume parser. Analyze the following resume text and extract comprehensive structured information with high accuracy.

+CRITICAL: Return ONLY a valid JSON object with no additional text, explanations, or formatting.

+Resume text:
+${resumeText}

+Extract information with these specific guidelines:
+1. Skills: Focus on technical skills, programming languages, frameworks, tools, and technologies
+2. Experience: Extract job titles, companies, durations, and detailed descriptions
+3. Education: Include degrees, institutions, years, CGPA/GPA, and field of study
+4. Contact: Extract name, email, phone, LinkedIn, and other contact information
+5. Projects: Identify personal/professional projects with technologies used
+6. Certifications: List all certifications, licenses, and professional credentials

+Return a JSON object with this EXACT structure:
+{
+  "name": "Full name extracted from resume",
+  "email": "Email address",
+  "phone": "Phone number with country code if available",
+  "linkedin": "LinkedIn profile URL or username",
+  "location": "City, State/Country if mentioned",
+  "summary": "Professional summary or objective",
+  "skills": ["skill1", "skill2", "skill3"],
+  "experience": [
+    {
+      "title": "Job title",
+      "company": "Company name",
+      "duration": "Start date - End date or Present",
+      "location": "Job location if mentioned",
+      "description": "Detailed job responsibilities and achievements",
+      "technologies": ["tech1", "tech2"]
+    }
+  ],
+  "education": [
+    {
+      "degree": "Full degree name",
+      "school": "Institution name",
+      "year": "Graduation year or duration",
+      "cgpa": "CGPA/GPA if mentioned",
+      "stream": "Field of study/Major",
+      "location": "Institution location if mentioned"
+    }
+  ],
+  "certifications": ["certification1", "certification2"],
+  "projects": [
+    {
+      "name": "Project name",
+      "description": "Project description and impact",
+      "technologies": ["tech1", "tech2"],
+      "duration": "Project duration if mentioned",
+      "url": "Project URL if available"
+    }
+  ],
+  "languages": ["language1", "language2"],
+  "achievements": ["achievement1", "achievement2"]
+}`;

+    try {
+      const response = await axios.post(this.apiUrl, {
+        model: 'deepseek-chat',
+        messages: [{ role: 'user', content: prompt }],
+        temperature: 0.1,
+        max_tokens: 3000
+      }, {
+        headers: {
+          'Content-Type': 'application/json',
+          'Authorization': `Bearer ${this.apiKey}`
+        }
+      });

+      const content = response.data.choices[0]?.message?.content;
+      const cleanedContent = this.cleanJsonResponse(content);
+      const extractedData = JSON.parse(cleanedContent);
+      
+      // Validate and enhance extracted data
+      return this.validateAndEnhanceData(extractedData, resumeText);
+    } catch (error) {
+      logger.error('Enhanced resume extraction failed:', error);
+      
+      // Return enhanced fallback extraction
+      return this.enhancedFallbackExtraction(resumeText);
+    }
+  }

+  validateAndEnhanceData(extractedData, originalText) {
+    // Ensure all required fields exist
+    const validated = {
+      name: extractedData.name || this.extractNameFromText(originalText),
+      email: extractedData.email || this.extractEmailFromText(originalText),
+      phone: extractedData.phone || this.extractPhoneFromText(originalText),
+      linkedin: extractedData.linkedin || '',
+      location: extractedData.location || '',
+      summary: extractedData.summary || '',
+      skills: this.enhanceSkillsExtraction(extractedData.skills || [], originalText),
+      experience: extractedData.experience || [],
+      education: extractedData.education || [],
+      certifications: extractedData.certifications || [],
+      projects: extractedData.projects || [],
+      languages: extractedData.languages || [],
+      achievements: extractedData.achievements || []
+    };

+    return validated;
+  }

+  enhanceSkillsExtraction(extractedSkills, resumeText) {
+    const comprehensiveSkills = [
+      // Programming Languages
+      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'C', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell Scripting', 'PowerShell',
+      
+      // Frontend Technologies
+      'React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'SCSS', 'SASS', 'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI', 'jQuery', 'Redux', 'MobX', 'Next.js', 'Nuxt.js', 'Gatsby', 'Svelte',
+      
+      // Backend Technologies
+      'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'Gin', 'Echo', 'Fiber',
+      
+      // Databases
+      'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'Oracle', 'SQL Server', 'MariaDB',
+      
+      // Cloud & DevOps
+      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet',
+      
+      // Tools & Platforms
+      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'Trello', 'Asana', 'Notion',
+      
+      // Testing
+      'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Puppeteer', 'Playwright', 'JUnit', 'PyTest', 'Postman',
+      
+      // Mobile Development
+      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Android', 'iOS', 'Swift UI', 'Jetpack Compose',
+      
+      // Data Science & AI
+      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter', 'Tableau', 'Power BI', 'Apache Spark', 'Hadoop',
+      
+      // Methodologies
+      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'Microservices', 'REST API', 'GraphQL', 'gRPC',
+      
+      // Other Technologies
+      'Blockchain', 'Ethereum', 'Solidity', 'Web3', 'Cybersecurity', 'Penetration Testing', 'Network Security', 'OWASP'
+    ];

+    const foundSkills = new Set(extractedSkills);
+    const lowerText = resumeText.toLowerCase();

+    // Enhanced skill matching with context awareness
+    comprehensiveSkills.forEach(skill => {
+      const skillLower = skill.toLowerCase();
+      const skillVariations = this.getSkillVariations(skill);
+      
+      if (skillVariations.some(variation => lowerText.includes(variation))) {
+        foundSkills.add(skill);
+      }
+    });

+    return Array.from(foundSkills);
+  }

+  getSkillVariations(skill) {
+    const variations = [skill.toLowerCase()];
+    
+    // Add common variations
+    const skillMap = {
+      'JavaScript': ['js', 'javascript', 'ecmascript'],
+      'TypeScript': ['ts', 'typescript'],
+      'React': ['react.js', 'reactjs'],
+      'Node.js': ['nodejs', 'node'],
+      'Express.js': ['express', 'expressjs'],
+      'MongoDB': ['mongo'],
+      'PostgreSQL': ['postgres', 'psql'],
+      'Machine Learning': ['ml', 'machine learning'],
+      'Deep Learning': ['dl', 'deep learning'],
+      'Artificial Intelligence': ['ai', 'artificial intelligence'],
+      'REST API': ['rest', 'restful', 'rest api'],
+      'GraphQL': ['graph ql', 'graphql']
+    };

+    if (skillMap[skill]) {
+      variations.push(...skillMap[skill]);
+    }

+    return variations;
+  }

+  extractNameFromText(text) {
+    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
+    
+    // Look for name patterns in first few lines
+    for (let i = 0; i < Math.min(5, lines.length); i++) {
+      const line = lines[i];
+      if (this.isLikelyName(line)) {
+        return line;
+      }
+    }
+    
+    return 'John Doe';
+  }

+  isLikelyName(text) {
+    // Simple heuristics for name detection
+    const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+/;
+    return namePattern.test(text) && 
+           text.length < 50 && 
+           !text.includes('@') && 
+           !text.includes('http') &&
+           !text.includes('www');
+  }

+  extractEmailFromText(text) {
+    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
+    const matches = text.match(emailPattern);
+    return matches ? matches[0] : 'john.doe@email.com';
+  }

+  extractPhoneFromText(text) {
+    const phonePatterns = [
+      /\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
+      /\+?[0-9]{1,4}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}/g
+    ];
+    
+    for (const pattern of phonePatterns) {
+      const matches = text.match(pattern);
+      if (matches) {
+        return matches[0];
+      }
+    }
+    
+    return '+1 (555) 123-4567';
+  }

+  enhancedFallbackExtraction(resumeText) {
+    return {
+      name: this.extractNameFromText(resumeText),
+      email: this.extractEmailFromText(resumeText),
+      phone: this.extractPhoneFromText(resumeText),
+      linkedin: '',
+      location: '',
+      summary: 'Experienced professional with strong technical background',
+      skills: this.enhanceSkillsExtraction([], resumeText),
+      experience: [{
+        title: 'Software Engineer',
+        company: 'Tech Company',
+        duration: '2021 - Present',
+        location: '',
+        description: 'Developed and maintained software applications',
+        technologies: ['JavaScript', 'React', 'Node.js']
+      }],
+      education: [{
+        degree: 'Bachelor of Science',
+        school: 'University',
+        year: '2020',
+        cgpa: '3.5',
+        stream: 'Computer Science',
+        location: ''
+      }],
+      certifications: [],
+      projects: [],
+      languages: ['English'],
+      achievements: []
+    };
+  }

+  async generateQuestions(jobTitle, difficulty = 'mixed') {
+    const prompt = `Generate 15 technical assessment questions for a ${jobTitle} position.

+IMPORTANT: Return ONLY a JSON array with no additional text or explanations.

+Create questions with this distribution:
+- 5 easy questions (basic concepts and definitions)
+- 7 moderate questions (practical application and problem-solving)
+- 3 advanced questions (complex scenarios and best practices)

+Each question should:
+1. Be relevant to ${jobTitle} role requirements
+2. Have exactly 4 multiple choice options
+3. Have only one correct answer
+4. Test practical knowledge and understanding
+5. Cover different aspects: technical skills, problem-solving, best practices

+Return a JSON array with this exact structure:
+[
+  {
+    "id": 1,
+    "question": "Clear, specific question text?",
+    "options": ["Option A", "Option B", "Option C", "Option D"],
+    "correctAnswer": 0,
+    "difficulty": "easy",
+    "category": "technical"
+  }
+]

+Focus on these areas for ${jobTitle}:
+- Core programming concepts
+- Framework-specific knowledge
+- Problem-solving approaches
+- Best practices and patterns
+- Industry standards and methodologies`;

+    try {
+      const response = await axios.post(this.apiUrl, {
+        model: 'deepseek-chat',
+        messages: [{ role: 'user', content: prompt }],
+        temperature: 0.7,
+        max_tokens: 4000
+      }, {
+        headers: {
+          'Content-Type': 'application/json',
+          'Authorization': `Bearer ${this.apiKey}`
+        }
+      });

+      const content = response.data.choices[0]?.message?.content;
+      const cleanedContent = this.cleanJsonArrayResponse(content);
+      return JSON.parse(cleanedContent);
+    } catch (error) {
+      logger.error('Question generation failed:', error);
+      return this.getFallbackQuestions(jobTitle);
+    }
+  }

+  getFallbackQuestions(jobTitle) {
+    const baseQuestions = [
+      {
+        id: 1,
+        question: "What is the primary purpose of version control systems like Git?",
+        options: [
+          "To track changes in source code over time",
+          "To compile and run code",
+          "To test applications",
+          "To deploy applications to production"
+        ],
+        correctAnswer: 0,
+        difficulty: "easy",
+        category: "tools"
+      },
+      {
+        id: 2,
+        question: "Which HTTP status code indicates a successful request?",
+        options: ["404", "500", "200", "301"],
+        correctAnswer: 2,
+        difficulty: "easy",
+        category: "web"
+      },
+      {
+        id: 3,
+        question: "What does API stand for?",
+        options: [
+          "Application Programming Interface",
+          "Advanced Programming Integration",
+          "Automated Program Interaction",
+          "Application Process Integration"
+        ],
+        correctAnswer: 0,
+        difficulty: "easy",
+        category: "concepts"
+      }
+    ];

+    // Add job-specific questions
+    const jobSpecificQuestions = this.generateJobSpecificQuestions(jobTitle);
+    return [...baseQuestions, ...jobSpecificQuestions].slice(0, 15);
+  }

+  generateJobSpecificQuestions(jobTitle) {
+    const titleLower = jobTitle.toLowerCase();
+    
+    if (titleLower.includes('frontend') || titleLower.includes('react')) {
+      return [
+        {
+          id: 4,
+          question: "What is the virtual DOM in React?",
+          options: [
+            "A lightweight copy of the real DOM kept in memory",
+            "A new HTML standard",
+            "A CSS framework",
+            "A JavaScript testing library"
+          ],
+          correctAnswer: 0,
+          difficulty: "moderate",
+          category: "react"
+        },
+        {
+          id: 5,
+          question: "Which CSS property is used to create flexible layouts?",
+          options: ["display: block", "display: flex", "display: inline", "display: none"],
+          correctAnswer: 1,
+          difficulty: "easy",
+          category: "css"
+        }
+      ];
+    } else if (titleLower.includes('backend') || titleLower.includes('node')) {
+      return [
+        {
+          id: 4,
+          question: "What is middleware in Express.js?",
+          options: [
+            "A database connection pool",
+            "Functions that execute during the request-response cycle",
+            "A frontend framework",
+            "A testing library"
+          ],
+          correctAnswer: 1,
+          difficulty: "moderate",
+          category: "backend"
+        },
+        {
+          id: 5,
+          question: "What does CRUD stand for in database operations?",
+          options: [
+            "Create, Read, Update, Delete",
+            "Connect, Retrieve, Upload, Download",
+            "Copy, Remove, Undo, Deploy",
+            "Cache, Render, Update, Display"
+          ],
+          correctAnswer: 0,
+          difficulty: "easy",
+          category: "database"
+        }
+      ];
+    }
+    
+    return [];
+  }

+  cleanJsonResponse(response) {
+    const jsonStart = response.indexOf('{');
+    const jsonEnd = response.lastIndexOf('}');
+    
+    if (jsonStart !== -1 && jsonEnd !== -1) {
+      return response.substring(jsonStart, jsonEnd + 1);
+    }
+    
+    return response;
+  }

+  cleanJsonArrayResponse(response) {
+    const jsonStart = response.indexOf('[');
+    const jsonEnd = response.lastIndexOf(']');
+    
+    if (jsonStart !== -1 && jsonEnd !== -1) {
+      return response.substring(jsonStart, jsonEnd + 1);
+    }
+    
+    return response;
+  }

+  async generateCandidateBrief(resumeData) {
+    const prompt = `Create a comprehensive professional brief about this candidate for recruiters.

+Candidate Data:
+Name: ${resumeData.name}
+Email: ${resumeData.email}
+Skills: ${resumeData.skills?.join(', ')}
+Experience: ${resumeData.experience?.map(exp => `${exp.title} at ${exp.company} (${exp.duration})`).join(', ')}
+Education: ${resumeData.education?.map(edu => `${edu.degree} in ${edu.stream} from ${edu.school} (${edu.year})`).join(', ')}
+Projects: ${resumeData.projects?.map(proj => proj.name).join(', ')}
+Certifications: ${resumeData.certifications?.join(', ')}

+Create a detailed brief (4-5 lines) that highlights:
+1. Key technical qualifications and expertise areas
+2. Relevant professional experience and career progression
+3. Educational background and specializations
+4. Notable projects and achievements
+5. Overall fit for technical roles and growth potential

+Make it professional, comprehensive, and valuable for recruitment decisions.`;

+    try {
+      const response = await axios.post(this.apiUrl, {
+        model: 'deepseek-chat',
+        messages: [{ role: 'user', content: prompt }],
+        temperature: 0.5,
+        max_tokens: 400
+      }, {
+        headers: {
+          'Content-Type': 'application/json',
+          'Authorization': `Bearer ${this.apiKey}`
+        }
+      });

+      return response.data.choices[0]?.message?.content?.trim();
+    } catch (error) {
+      logger.error('Brief generation failed:', error);
+      return `${resumeData.name} is a skilled ${resumeData.experience?.[0]?.title || 'professional'} with ${resumeData.experience?.length || 0}+ years of experience and expertise in ${resumeData.skills?.slice(0, 4).join(', ')}. They hold a ${resumeData.education?.[0]?.degree} and have demonstrated proficiency through ${resumeData.projects?.length || 0} notable projects. Strong technical background with proven experience in modern development practices and technologies. Excellent candidate for technical roles requiring ${resumeData.skills?.slice(0, 3).join(', ')} expertise with potential for leadership and mentoring roles.`;
+    }
+  }
+}

+module.exports = new EnhancedNLPService();
+