'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { greetingByTime } from '@/lib/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import ContinueCard from '@/components/dashboard/ContinueCard';
import Link from 'next/link';
import { DashboardData } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setData(res.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greetingByTime()}, <span className="text-purple-500">{user?.username}!</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Your learning journey is on track. Ready for today's challenge?</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
          <span>🔥</span>
          <span className="text-orange-500 font-semibold text-sm">{data?.streak || 0} Day Streak</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Quizzes" value={data?.stats.totalQuizzes || 0} icon="✅" />
        <StatsCard label="Topics Finished" value={data?.stats.topicsFinished || 0} icon="🎓" />
        <StatsCard label="Average Score" value={`${data?.stats.avgScore || 0}%`} icon="📊" />
        <StatsCard label="Accuracy" value={`${data?.stats.accuracy || 0}%`} icon="🎯" />
      </div>

      {/* Continue where you left off */}
      {data?.continueItems && data.continueItems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span>▶️</span>
            <h2 className="text-lg font-bold text-gray-900">Continue where you left off</h2>
          </div>
          <div className="flex gap-4">
            {data.continueItems.map((item, i) => (
              <ContinueCard key={i} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Explore Topics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <h2 className="text-lg font-bold text-gray-900">Explore Topics</h2>
          </div>
          <Link href="/topics" className="text-purple-500 text-sm hover:underline">View all topics</Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {data?.exploreTopics.map(topic => (
            <Link key={topic.id} href={`/topics/${topic.id}`}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3 group-hover:bg-purple-100 transition">
                <span>⚗️</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">{topic.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}