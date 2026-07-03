"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Lesson, Note } from "@/types";
import { getYoutubeEmbedUrl } from "@/lib/utils";

export default function LessonPage() {
  const { lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const summaryFetched = useRef(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noteSaving, setNoteSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("");
  const [summary, setSummary] = useState<{
    summary: string;
    keyPoints: string[];
  } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonRes, notesRes] = await Promise.all([
          api.get(`/lessons/single/${lessonId}`),
          api.get(`/notes/${lessonId}`),
        ]);
        setLesson(lessonRes.data);
        setNotes(notesRes.data);
        if (notesRes.data.length > 0) setNoteContent(notesRes.data[0].content);
        if (lessonRes.data.transcript && !summaryFetched.current) {
          setSummaryLoading(true);
          api
            .get(`/lessons/single/${lessonId}/summary`)
            .then((res) => setSummary(res.data))
            .finally(() => setSummaryLoading(false));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonId]);

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;
    setNoteSaving(true);
    try {
      if (notes.length > 0) {
        await api.put(`/notes/${notes[0]._id}`, { content: noteContent });
      } else {
        const { data } = await api.post("/notes", {
          lessonId,
          topicId: lesson?.topicId,
          content: noteContent,
          type: "personal",
        });
        setNotes([data]);
      }
      setLastSaved("Saved just now");
    } finally {
      setNoteSaving(false);
    }
  };

  const handleComplete = async () => {
    await api.post(`/lessons/${lessonId}/complete`);
    setCompleted(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!lesson)
    return (
      <div className="text-center py-20 text-gray-400">Lesson not found</div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Back
      </button>

      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        Chapter
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{lesson.title}</h1>

      <div className="flex gap-8">
        {/* Left */}
        <div className="flex-1">
          {/* Video */}
          <div className="rounded-2xl overflow-hidden bg-black aspect-video mb-6">
            <iframe
              src={getYoutubeEmbedUrl(lesson.youtubeUrl)}
              title={lesson.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* AI Study Summary */}
          <div className="bg-purple-50 rounded-2xl p-6 mb-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <span>✨</span>
              <h3 className="font-semibold text-gray-900">AI Study Summary</h3>
            </div>
            {summaryLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                Generating AI summary...
              </div>
            ) : summary ? (
              <>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {summary.summary}
                </p>
                <div className="flex flex-col gap-2">
                  {summary.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <p className="text-sm text-gray-600">{point}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {/* Complete button */}
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`w-full py-3 rounded-full font-semibold text-sm transition
              ${
                completed
                  ? "bg-green-100 text-green-600 cursor-default"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
          >
            {completed ? "✓ Lesson Completed" : "Mark as Complete"}
          </button>
        </div>

        {/* Right */}
        <div className="w-72 shrink-0 flex flex-col gap-4">
          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>📝</span>
                <h3 className="font-semibold text-gray-900 text-sm">
                  My Notes
                </h3>
              </div>
              {lastSaved && (
                <span className="text-xs text-gray-400">{lastSaved}</span>
              )}
            </div>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={`Type your notes here about the ${lesson.title}...`}
              rows={8}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none mb-3 text-black"
            />
            <button
              onClick={handleSaveNote}
              disabled={noteSaving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm font-medium transition disabled:opacity-60"
            >
              {noteSaving ? "Saving..." : "Save Note"}
            </button>
          </div>

          {/* Take Quiz */}
          <div className="bg-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span>📋</span>
              <h3 className="font-semibold">Ready for the Quiz?</h3>
            </div>
            <p className="text-purple-200 text-xs mb-4">
              Test your knowledge of the {lesson.title}
            </p>
            <button
              onClick={() => router.push(`/quiz/${lessonId}`)}
              className="w-full bg-white text-purple-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-purple-50 transition"
            >
              Take Quiz Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
