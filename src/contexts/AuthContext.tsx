import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  type: 'player' | 'creator';
  walletAddress?: string;
  avatar?: string;
  earnings?: number;
  gamesCreated?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, type: 'player' | 'creator') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('satsurge_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('satsurge_users') || '[]');
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('satsurge_user', JSON.stringify(existingUser));
      return true;
    }
    
    return false;
  };

  const register = async (
    email: string, 
    password: string, 
    username: string, 
    type: 'player' | 'creator'
  ): Promise<boolean> => {
    // Mock registration - replace with real auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username,
      type,
      earnings: 0,
      gamesCreated: 0,
    };
    
    // Store in localStorage (replace with real database)
    const users = JSON.parse(localStorage.getItem('satsurge_users') || '[]');
    users.push(newUser);
    localStorage.setItem('satsurge_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('satsurge_user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('satsurge_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('satsurge_user', JSON.stringify(updatedUser));
      
      // Update in users array too
      const users = JSON.parse(localStorage.getItem('satsurge_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('satsurge_users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};