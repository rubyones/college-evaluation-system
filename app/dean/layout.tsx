'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LayoutDashboard, Users, BookOpen, FileText, BarChart3, Settings, Calendar, ClipboardList, GraduationCap, Library } from 'lucide-react';

const deanNavItems = [
  { label: 'Dashboard', href: '/dean/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Academic Period', href: '/dean/academic', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Evaluation Forms', href: '/dean/forms', icon: <FileText className="w-5 h-5" /> },
  { label: 'Evaluation Setup', href: '/dean/evaluation-setup', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Evaluations', href: '/dean/evaluations', icon: <ClipboardList className="w-5 h-5" /> },
  { label: 'Classes', href: '/dean/classes', icon: <GraduationCap className="w-5 h-5" /> },
  { label: 'Subjects', href: '/dean/subjects', icon: <Library className="w-5 h-5" /> },
  { label: 'Reports', href: '/dean/reports', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Users', href: '/dean/users', icon: <Users className="w-5 h-5" /> },
  { label: 'Audit Logs', href: '/dean/audit', icon: <FileText className="w-5 h-5" /> },
  { label: 'Settings', href: '/dean/settings', icon: <Settings className="w-5 h-5" /> },
];

export default function DeanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || role !== 'dean')) {
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

  if (!isAuthenticated || role !== 'dean') {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar items={deanNavItems} title="Admin Portal" />
      <TopNavbar />
      <main className="page-container">
        {children}
      </main>
    </div>
  );
}
