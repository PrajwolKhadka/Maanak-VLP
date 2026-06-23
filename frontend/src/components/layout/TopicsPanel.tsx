'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { TopicCategory } from '@/types';

interface TopicsPanelProps {
  categories: TopicCategory[];
  onClose: () => void;
}

export default function TopicsPanel({ categories, onClose }: TopicsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div ref={panelRef}
        className="absolute top-[72px] left-0 right-0 bg-white shadow-2xl border-b border-gray-100 px-10 py-8 z-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">+2 Chemistry Topics</h2>
              <p className="text-sm text-gray-400 mt-1">Browse all topics available on Maanak</p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
              ✕
            </button>
          </div>

          {/* Categories */}
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">Loading topics...</div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {categories.map(cat => (
                <div key={cat.category}>
                  <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-3">
                    {cat.category}
                  </p>
                  <div className="flex flex-col gap-1">
                    {cat.subjects.map(topic => (
                      <Link key={topic.id} href="/login"
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition text-sm group">
                        <span className="group-hover:text-purple-500">⚗️</span>
                        {topic.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-400">Login to access all topics and start learning</p>
            <Link href="/register" onClick={onClose}
              className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold transition">
              Get Started →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}