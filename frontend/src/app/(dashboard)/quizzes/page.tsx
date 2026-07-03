'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface LessonWithChapter {
  _id: string;
  title: string;
  topicId: string;
  duration?: string;
  chapter: { _id: string; name: string };
}

export default function QuizzesPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonWithChapter[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/lessons/all').then(res => setLessons(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = lessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.chapter?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-400 text-sm mt-1">Test your knowledge and master new skills with our curated assessments.</p>
      </div>

      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search for lessons..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm text-black" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(lesson => (
          <div key={lesson._id}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition cursor-pointer group"
            onClick={() => router.push(`/quiz/${lesson._id}`)}>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition">
              <span>📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
            <p className="text-xs text-gray-400 mb-4">{lesson.chapter?.name}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>📋 AI Generated</span>
              {lesson.duration && <span>⏱ {lesson.duration}</span>}
            </div>
            <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm font-medium transition">
              Start Quiz →
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">📝</p>
          <p>{search ? `No quizzes found for "${search}"` : 'No lessons available yet'}</p>
        </div>
      )}
    </div>
  );
}