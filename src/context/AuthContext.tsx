import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('fairq_user');
      if (raw) return JSON.parse(raw) as User;
    } catch {}
    // Inject demo user if none exists
    const demoUser = { id: 'demo1', name: 'Demo User', email: 'demo@fairq.com' };
    localStorage.setItem('fairq_user', JSON.stringify(demoUser));
    return demoUser;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('fairq_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('fairq_user');
      }
    } catch {}
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ id: '1', name: email.split('@')[0], email });
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ id: '1', name, email });
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = useCallback(async (updates: Partial<Pick<User, 'name' | 'email'>>) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};