'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { Lesson } from '@/types';

export default function ChapterDetailPage() {
  const { topicId, chapterId } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chapterName, setChapterName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, chaptersRes] = await Promise.all([
          api.get(`/lessons/chapter/${chapterId}`),
          api.get(`/chapters/${topicId}`),
        ]);
        setLessons(lessonsRes.data);
        const chapter = chaptersRes.data.find((c: any) => c._id === chapterId);
        if (chapter) setChapterName(chapter.name);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapterId, topicId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{chapterName}</h1>
      <p className="text-gray-400 text-sm mb-8">Select a lesson to begin</p>

      <div className="flex flex-col gap-4">
        {lessons.map((lesson, i) => (
          <Link key={lesson._id} href={`/lessons/${lesson._id}`}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 font-bold text-sm group-hover:bg-purple-100 transition">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{lesson.title}</p>
                {lesson.duration && (
                  <p className="text-xs text-gray-400 mt-0.5">⏱ {lesson.duration}</p>
                )}
              </div>
            </div>
            <span className="text-purple-400 group-hover:translate-x-1 transition">→</span>
          </Link>
        ))}

        {lessons.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">📭</p>
            <p>No lessons available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}