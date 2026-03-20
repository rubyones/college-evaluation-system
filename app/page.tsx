'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { getRoleDashboardPath } from '@/utils/helpers';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(getRoleDashboardPath(user.role));
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return <DashboardSkeleton />;
}
