import Link from 'next/link';

interface ContinueCardProps {
  chapterName: string;
  lessonTitle: string;
  percentage: number;
  completedLessons: number;
  totalLessons: number;
  lessonId: string;
  topicId: string;
}

export default function ContinueCard({
  chapterName, lessonTitle, percentage,
  completedLessons, totalLessons, lessonId, topicId
}: ContinueCardProps) {
  const initials = chapterName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{chapterName}</p>
          <p className="text-xs text-gray-400">{lessonTitle}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{percentage}% Completed</span>
          <span>{completedLessons}/{totalLessons} Lessons</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <Link href={`/lessons/${lessonId}`}
        className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-full transition">
        Resume Lesson →
      </Link>
    </div>
  );
}