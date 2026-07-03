'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { TopicCategory } from '@/types';

export default function TopicsPage() {
  const [categories, setCategories] = useState<TopicCategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/topics').then(res => setCategories(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = categories.map(cat => ({
    ...cat,
    subjects: cat.subjects.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.subjects.length > 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Topics</h1>
          <p className="text-gray-400 text-sm mt-1">Discover your next challenge</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search for topics, skills, or subjects..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm text-black"
        />
      </div>

      {/* Topics by category */}
      {filtered.map(cat => (
        <div key={cat.category} className="mb-10">
          <h2 className="text-sm font-semibold text-purple-500 uppercase tracking-wider mb-4">
            {cat.category}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {cat.subjects.map(topic => (
              <Link key={topic.id} href={`/topics/${topic.id}`}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition group">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition">
                  <span>⚗️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{topic.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-purple-500 font-semibold uppercase tracking-wide">
                    View Chapters →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🔬</p>
          <p>No topics found for "{search}"</p>
        </div>
      )}
    </div>
  );
}