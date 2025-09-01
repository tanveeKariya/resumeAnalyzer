import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from '../config/constants';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty?: string;
  category?: string;
}

export class TestService {
  static async generateQuestions(jobTitle: string): Promise<Question[]> {
    const prompt = `Generate 15 technical assessment questions for a ${jobTitle} position. 
    
    IMPORTANT: Return ONLY a JSON array with no additional text.
    
    Create questions that are:
    - 5 easy level questions (basic concepts)
    - 7 moderate level questions (practical application)
    - 3 advanced level questions (problem-solving)
    
    Each question should have 4 multiple choice options with only one correct answer.
    
    Return a JSON array with this exact structure:
    [
      {
        "id": 1,
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "difficulty": "easy",
        "category": "technical"
      }
    ]
    
    Focus on relevant technical skills for ${jobTitle} including programming concepts, frameworks, best practices, and problem-solving.`;

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
          temperature: 0.7,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      const cleanedContent = this.cleanJsonResponse(content);
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Question generation failed:', error);
      // Return fallback questions
      return this.getFallbackQuestions(jobTitle);
    }
  }

  private static cleanJsonResponse(response: string): string {
    const jsonStart = response.indexOf('[');
    const jsonEnd = response.lastIndexOf(']');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return response.substring(jsonStart, jsonEnd + 1);
    }
    
    return response;
  }

  private static getFallbackQuestions(jobTitle: string): Question[] {
    const baseQuestions = [
      {
        id: 1,
        question: "What is the primary purpose of React hooks?",
        options: [
          "To manage state in functional components",
          "To create class components",
          "To handle routing",
          "To manage CSS styles"
        ],
        correctAnswer: 0,
        difficulty: "easy",
        category: "react"
      },
      {
        id: 2,
        question: "Which HTTP method is typically used to create a new resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: 1,
        difficulty: "easy",
        category: "web"
      },
      {
        id: 3,
        question: "What does API stand for?",
        options: [
          "Application Programming Interface",
          "Advanced Programming Integration",
          "Automated Program Interaction",
          "Application Process Integration"
        ],
        correctAnswer: 0,
        difficulty: "easy",
        category: "concepts"
      },
      {
        id: 4,
        question: "In JavaScript, what does the 'this' keyword refer to?",
        options: [
          "The current function",
          "The global object",
          "The object that owns the method",
          "The parent element"
        ],
        correctAnswer: 2,
        difficulty: "moderate",
        category: "javascript"
      },
      {
        id: 5,
        question: "What is the purpose of version control systems like Git?",
        options: [
          "To compile code",
          "To track changes in source code",
          "To run tests",
          "To deploy applications"
        ],
        correctAnswer: 1,
        difficulty: "easy",
        category: "tools"
      }
    ];

    // Generate more questions based on job title
    const additionalQuestions = this.generateJobSpecificQuestions(jobTitle);
    return [...baseQuestions, ...additionalQuestions].slice(0, 15);
  }

  private static generateJobSpecificQuestions(jobTitle: string): Question[] {
    const frontendQuestions = [
      {
        id: 6,
        question: "Which CSS property is used to create flexible layouts?",
        options: ["display: block", "display: flex", "display: inline", "display: none"],
        correctAnswer: 1,
        difficulty: "easy",
        category: "css"
      },
      {
        id: 7,
        question: "What is the virtual DOM in React?",
        options: [
          "A copy of the real DOM kept in memory",
          "A new HTML standard",
          "A CSS framework",
          "A JavaScript library"
        ],
        correctAnswer: 0,
        difficulty: "moderate",
        category: "react"
      }
    ];

    const backendQuestions = [
      {
        id: 6,
        question: "What is middleware in Express.js?",
        options: [
          "A database connection",
          "Functions that execute during request-response cycle",
          "A frontend framework",
          "A testing library"
        ],
        correctAnswer: 1,
        difficulty: "moderate",
        category: "backend"
      },
      {
        id: 7,
        question: "What does CRUD stand for in database operations?",
        options: [
          "Create, Read, Update, Delete",
          "Connect, Retrieve, Upload, Download",
          "Copy, Remove, Undo, Deploy",
          "Cache, Render, Update, Display"
        ],
        correctAnswer: 0,
        difficulty: "easy",
        category: "database"
      }
    ];

    const fullStackQuestions = [
      {
        id: 6,
        question: "What is RESTful API design?",
        options: [
          "A database design pattern",
          "An architectural style for web services",
          "A frontend framework",
          "A testing methodology"
        ],
        correctAnswer: 1,
        difficulty: "moderate",
        category: "web"
      },
      {
        id: 7,
        question: "What is the purpose of JWT tokens?",
        options: [
          "To style web pages",
          "To store user authentication information",
          "To manage database connections",
          "To handle file uploads"
        ],
        correctAnswer: 1,
        difficulty: "moderate",
        category: "security"
      }
    ];

    if (jobTitle.toLowerCase().includes('frontend') || jobTitle.toLowerCase().includes('react')) {
      return frontendQuestions;
    } else if (jobTitle.toLowerCase().includes('backend') || jobTitle.toLowerCase().includes('node')) {
      return backendQuestions;
    } else {
      return fullStackQuestions;
    }
  }
}