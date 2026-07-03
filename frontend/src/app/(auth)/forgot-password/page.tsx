'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-end pr-20">
      <Image src="/auth.png" alt="Background" fill sizes="100vw" className="object-cover" priority />
      <div className="absolute inset-0 z-10" />

      <div className="relative z-20 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-12 mx-4">
        {!sent ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Forgot your password?</h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter your email and we'll send you a reset link
            </p>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 text-black"
                />
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-green-400 hover:bg-green-500 text-white py-3 rounded-full font-semibold text-lg transition disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Remember your password?{' '}
                <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-400 text-sm mb-6">
              We sent a password reset link to <span className="font-medium text-gray-700">{email}</span>
            </p>
            <Link href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition inline-block">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}