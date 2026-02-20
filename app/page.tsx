'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardSkeleton } from '@/components/loading/Skeletons';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/${user.role}/dashboard`);
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return <DashboardSkeleton />;
}
