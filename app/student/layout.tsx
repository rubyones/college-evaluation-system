'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { BookOpen, History, User, LogOut } from 'lucide-react';

const studentNavItems = [
  { label: 'Dashboard', href: '/student/dashboard', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Evaluations', href: '/student/evaluations', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'History', href: '/student/history', icon: <History className="w-5 h-5" /> },
  { label: 'Profile', href: '/student/profile', icon: <User className="w-5 h-5" /> },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || role !== 'student')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || role !== 'student') {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar items={studentNavItems} title="Student Portal" />
      <TopNavbar />
      <main className="page-container">
        {children}
      </main>
    </div>
  );
}
