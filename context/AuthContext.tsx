"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserRole, User } from '@/types';
// mock data is only used in development/demo mode
let mockUsers: Record<string, User> = {};
if (process.env.NODE_ENV !== 'production') {
  // lazy load to avoid bundling in production
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  mockUsers = require('@/data/mock').mockUsers;
}

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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('student');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('demo-role') as UserRole | null;
    const savedUserId = localStorage.getItem('current-user-id');
    const savedToken = sessionStorage.getItem('auth_token');

    if (savedToken) {
      setTokenState(savedToken);
    } else {
      setIsLoading(false);
    }

    // if we have a demo user id and mock data, use it
    if (savedUserId && mockUsers[savedUserId]) {
      const currentUser = mockUsers[savedUserId];
      setUser(currentUser);
      setRoleState((savedRole as UserRole) || currentUser.role);
      setIsDemoMode(!!savedRole);
    }
  }, []);

  const login = async (userId: string, password: string): Promise<void> => {
    const useApi =
      process.env.NODE_ENV === 'production' ||
      process.env.NEXT_PUBLIC_USE_API === 'true';

    if (useApi) {
      // call backend auth endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'email-login', email: userId, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user as User);
        setRoleState((data.user as any).role as UserRole);
        localStorage.setItem('current-user-id', String((data.user as any).id));
        setIsDemoMode(false);
      }
      return;
    }

    // demo/mock logic (development)
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

  const setUserFromApi = (apiUser: Partial<User> | { user: Partial<User> }) => {
    // Handle nested { user: ... } response wrapper
    const userData = 'user' in apiUser ? (apiUser.user as Partial<User>) : apiUser;
    
    const mapped: User = {
      id: String(userData.id ?? userData.email ?? 'guest'),
      name: userData.name ?? 'API User',
      email: userData.email ?? '',
      role: (userData.role as UserRole) ?? ('student' as UserRole),
      avatar: userData.avatar ?? '👤',
      course: (userData as any).course ?? undefined,
      year_level: (userData as any).year_level ?? undefined,
      section: (userData as any).section ?? undefined,
    } as User;

    setUser(mapped);
    setRoleState(mapped.role);
    localStorage.setItem('current-user-id', mapped.id);
    setIsDemoMode(false);
    setIsLoading(false);
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

  // if token exists and we don't yet have user details, fetch from API
  useEffect(() => {
    if (token && !user) {
      const fetchCurrent = async () => {
        try {
          // Use the dedicated /api/auth/me endpoint
          const res = await fetch(
            '/api/auth/me',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.ok) {
            const result = await res.json();
            setUserFromApi(result);
          } else {
            // If token is invalid/expired, clear it
            logout();
          }
        } catch (e) {
          console.warn('Unable to fetch current user', e);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCurrent();
    } else if (token && user) {
      setIsLoading(false);
    }
  }, [token, user]);

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
    isLoading,
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
