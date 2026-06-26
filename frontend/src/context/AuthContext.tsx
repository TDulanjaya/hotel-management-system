"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user.types';
import { login as apiLogin } from '@/lib/api/authApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { authenticatedFetch } = await import('@/lib/api/authApi');
          const res = await authenticatedFetch('/api/auth/me');
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user info", error);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await apiLogin(email, pass);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser({ id: '1', name: 'Admin', email, role: 'ADMIN' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
