import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, User, AuthResponse } from '../services/api';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, role: 'hr' | 'candidate') => Promise<void>;
  register: (email: string, password: string, name: string, role: 'hr' | 'candidate') => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('career_ai_token');
      const storedUser = localStorage.getItem('career_ai_user');
      
      if (token && storedUser) {
        try {
          AuthService.setAuthToken(token);
          const response = await AuthService.getCurrentUser();
          if (response.success) {
            setUser(response.data);
          } else {
            // Token invalid, clear storage
            logout();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, role: 'hr' | 'candidate'): Promise<void> => {
    setLoading(true);
    try {
      const response: AuthResponse = await AuthService.login(email, password, role);
      if (response.success) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'hr' | 'candidate'): Promise<void> => {
    setLoading(true);
    try {
      const response: AuthResponse = await AuthService.register({
        name,
        email,
        password,
        role
      });
      if (response.success) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user && !!localStorage.getItem('career_ai_token');

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      register, 
      logout, 
      loading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}