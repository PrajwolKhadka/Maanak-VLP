'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">Invalid reset link.</p>
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-end pr-20">
      <Image src="/auth.png" alt="Background" fill sizes="100vw" className="object-cover" priority />
      <div className="absolute inset-0 z-10" />

      <div className="relative z-20 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-12 mx-4">
        {!success ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset your password</h2>
            <p className="text-gray-400 text-sm mb-6">Enter your new password below</p>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600">New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 text-black"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Confirm Password</label>
                <input
                  type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 text-black"
                />
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-green-400 hover:bg-green-500 text-white py-3 rounded-full font-semibold text-lg transition disabled:opacity-60">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password reset!</h2>
            <p className="text-gray-400 text-sm mb-2">Your password has been updated successfully.</p>
            <p className="text-gray-400 text-sm">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}