'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    localStorage.setItem('token', token);

    api.get('/auth/me').then(({ data }) => {
      setAuth(data, token);
      router.push('/dashboard');
    }).catch(() => {
      router.push('/login');
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}