'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const PUBLIC_ROUTES = ['/login'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace('/dashboard');
    }
  }, [hasHydrated, isAuthenticated, isPublicRoute, pathname, router]);

  if (!hasHydrated) return null;
  if (!isAuthenticated && !isPublicRoute) return null;
  if (isAuthenticated && isPublicRoute) return null;

  return <>{children}</>;
}