import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = (requireAuth: boolean = true) => {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !token) {
      router.push('/login');
    }
  }, [token, requireAuth, router]);

  return { user, token, logout, isAuthenticated: !!token };
};