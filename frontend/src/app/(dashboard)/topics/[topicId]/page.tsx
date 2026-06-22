'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { Chapter, Note } from '@/types';

export default function TopicDetailPage() {
  const { topicId } = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topicName, setTopicName] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeNoteTab, setActiveNoteTab] = useState<'personal' | 'class' | 'review'>('personal');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicRes, chaptersRes] = await Promise.all([
          api.get(`/topics/${topicId}`),
          api.get(`/chapters/${topicId}`),
        ]);
        setTopicName(topicRes.data.name);
        setChapters(chaptersRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [topicId]);

  const filteredChapters = chapters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const { data } = await api.post('/notes', {
      topicId, content: newNote, type: activeNoteTab,
    });
    setNotes([data, ...notes]);
    setNewNote('');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 transition">
        ← Back
      </button>

      <div className="flex gap-8">
        {/* Left — Chapters */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{topicName}</h1>
          <p className="text-gray-400 text-sm mb-6">Study the concept of {topicName} in depth with AI</p>

          {/* Search */}
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search chapter or topic..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm text-black"
            />
          </div>

          {/* Chapters grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredChapters.map((chapter, i) => (
              <Link key={chapter._id} href={`/topics/${topicId}/chapters/${chapter._id}`}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition group">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition text-purple-500 font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{chapter.name}</h3>
                {chapter.description && (
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{chapter.description}</p>
                )}
                <span className="text-xs text-purple-500 font-semibold">View Lessons →</span>
              </Link>
            ))}
          </div>

          {filteredChapters.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-4">📭</p>
              <p>No chapters found</p>
            </div>
          )}
        </div>

        {/* Right — Notes panel */}
        <div className="w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">My Notes</h3>

            {/* Tabs */}
            <div className="flex gap-3 mb-4 border-b border-gray-100 pb-3 text-black">
              {(['personal', 'class', 'review'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveNoteTab(tab)}
                  className={`text-xs font-medium capitalize pb-1 transition ${activeNoteTab === tab
                    ? 'text-purple-600 border-b-2 border-purple-500'
                    : 'text-black hover:text-gray-600'}`}>
                  {tab === 'class' ? 'Class Notes' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Notes list */}
            <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto text-black">
              {notes.filter(n => n.type === activeNoteTab).map(note => (
                <div key={note._id} className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-black">{note.content}</p>
                </div>
              ))}
              {notes.filter(n => n.type === activeNoteTab).length === 0 && (
                <p className="text-xs text-black text-center py-4">No notes yet</p>
              )}
            </div>

            {/* Add note */}
            <textarea
              value={newNote} onChange={e => setNewNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none mb-3 text-black"
            />
            <button onClick={handleAddNote}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              + Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}