"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserRole, User } from '@/types';
import { mockUsers } from '@/data/mock';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (userId: string, password: string) => Promise<void>;
  setUserFromApi: (user: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  token: string | null;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('student');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('demo-role') as UserRole | null;
    const savedUserId = localStorage.getItem('current-user-id');
    const savedToken = sessionStorage.getItem('auth_token');

    if (savedToken) {
      setTokenState(savedToken);
    }

    if (savedUserId && mockUsers[savedUserId]) {
      const currentUser = mockUsers[savedUserId];
      setUser(currentUser);
      setRoleState((savedRole as UserRole) || currentUser.role);
      setIsDemoMode(!!savedRole);
    }
  }, []);

  const login = async (userId: string, _password: string): Promise<void> => {
    // Support both demo mode and real API
    // If userId looks like a real ID (number), use mock data fallback
    // Otherwise, use mock user data
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (mockUsers[userId]) {
          const currentUser = mockUsers[userId];
          setUser(currentUser);
          setRoleState(currentUser.role);
          localStorage.setItem('current-user-id', userId);
          localStorage.removeItem('demo-role');
          setIsDemoMode(false);
          resolve();
        } else {
          // For demo purposes, create a user from the provided ID
          const demoUser: User = {
            id: userId,
            name: 'Test User',
            email: 'test@jmc.edu.ph',
            role: 'student',
            avatar: '👤',
          };
          setUser(demoUser);
          setRoleState('student');
          localStorage.setItem('current-user-id', userId);
          localStorage.removeItem('demo-role');
          setIsDemoMode(false);
          resolve();
        }
      }, 500);
    });
  };

  const setUserFromApi = (apiUser: Partial<User>) => {
    const mapped: User = {
      id: String(apiUser.id ?? apiUser.email ?? 'guest'),
      name: apiUser.name ?? 'API User',
      email: apiUser.email ?? '',
      role: (apiUser.role as UserRole) ?? ('student' as UserRole),
      avatar: apiUser.avatar ?? '👤',
    } as User;

    setUser(mapped);
    setRoleState(mapped.role);
    localStorage.setItem('current-user-id', mapped.id);
    setIsDemoMode(false);
  };

  const logout = () => {
    setUser(null);
    setRoleState('student');
    setTokenState(null);
    localStorage.removeItem('current-user-id');
    localStorage.removeItem('demo-role');
    sessionStorage.removeItem('auth_token');
    setIsDemoMode(false);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('demo-role', newRole);
    setIsDemoMode(true);
  };

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    sessionStorage.setItem('auth_token', newToken);
  };

  const value: AuthContextType = {
    user,
    role,
    setRole,
    login,
    setUserFromApi,
    logout,
    isAuthenticated: user !== null,
    isDemoMode,
    token,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
