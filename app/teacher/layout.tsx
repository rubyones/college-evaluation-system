'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { BookOpen, Users, TrendingUp, Lightbulb, Award } from 'lucide-react';

const teacherNavItems = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'My Classes', href: '/teacher/classes', icon: <Users className="w-5 h-5" /> },
  { label: 'Peer Evaluation', href: '/teacher/peer', icon: <Award className="w-5 h-5" /> },
  { label: 'Results', href: '/teacher/results', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'AI Coach', href: '/teacher/ai-coach', icon: <Lightbulb className="w-5 h-5" /> },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || role !== 'teacher') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'teacher') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar items={teacherNavItems} title="Teacher Portal" />
      <TopNavbar />
      <main className="page-container">
        {children}
      </main>
    </div>
  );
}
