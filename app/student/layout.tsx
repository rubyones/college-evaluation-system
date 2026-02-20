'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { BookOpen, History, User, LogOut } from 'lucide-react';

const studentNavItems = [
  { label: 'Dashboard', href: '/student/dashboard', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Evaluations', href: '/student/evaluations', icon: <BookOpen className="w-5 h-5" />, badge: 2 },
  { label: 'History', href: '/student/history', icon: <History className="w-5 h-5" /> },
  { label: 'Profile', href: '/student/profile', icon: <User className="w-5 h-5" /> },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || role !== 'student') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'student') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar items={studentNavItems} title="Student Portal" />
      <TopNavbar />
      <main className="page-container">
        {children}
      </main>
    </div>
  );
}
