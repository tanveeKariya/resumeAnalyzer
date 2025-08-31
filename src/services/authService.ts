// Authentication Service
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'hr' | 'candidate';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  private static readonly STORAGE_KEY = 'career_ai_user';
  private static readonly TOKEN_KEY = 'career_ai_token';

  static async register(
    email: string,
    password: string,
    name: string,
    role: 'hr' | 'candidate'
  ): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would make an API call to your backend
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const token = this.generateMockToken(user);

    // Store user data
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);

    return { user, token };
  }

  static async login(
    email: string,
    password: string,
    role: 'hr' | 'candidate'
  ): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In a real app, this would validate credentials against your backend
    const user: User = {
      id: Date.now().toString(),
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const token = this.generateMockToken(user);

    // Store user data
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);

    return { user, token };
  }

  static async demoLogin(role: 'hr' | 'candidate'): Promise<AuthResponse> {
    const demoUsers = {
      hr: {
        id: 'demo-hr-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'hr' as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      candidate: {
        id: 'demo-candidate-1',
        name: 'Alex Chen',
        email: 'alex.chen@email.com',
        role: 'candidate' as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    };

    const user = demoUsers[role];
    const token = this.generateMockToken(user);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);

    return { user, token };
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  }

  private static generateMockToken(user: User): string {
    // In a real app, this would be a JWT token from your backend
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    // Mock JWT token (base64 encoded payload)
    return btoa(JSON.stringify(payload));
  }

  static validateToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }
}