'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LayoutDashboard, Users, BookOpen, FileText, BarChart3, Settings } from 'lucide-react';

const deanNavItems = [
  { label: 'Dashboard', href: '/dean/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Academic Management', href: '/dean/academic', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Evaluation Forms', href: '/dean/forms', icon: <FileText className="w-5 h-5" /> },
  { label: 'Evaluations', href: '/dean/evaluations', icon: <BarChart3 className="w-5 h-5" /> },
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
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || role !== 'dean') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'dean') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar items={deanNavItems} title="Admin Portal" />
      <TopNavbar />
      <main className="page-container">
        {children}
      </main>
    </div>
  );
}
