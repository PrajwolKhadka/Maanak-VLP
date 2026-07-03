// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { QuizResult } from '@/types';

// export default function QuizResultPage() {
//   const router = useRouter();
//   const { lessonId } = useParams();
//   const [result, setResult] = useState<QuizResult | null>(null);

//   useEffect(() => {
//     const stored = sessionStorage.getItem('quizResult');
//     if (!stored) { router.push('/dashboard'); return; }
//     setResult(JSON.parse(stored));
//   }, []);

//   if (!result) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   const { score, totalQuestions, percentage, questions, aiInsights } = result;

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-5xl mx-auto flex gap-8">
//         {/* Left */}
//         <div className="flex-1">
//           {/* Score card */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 flex items-center gap-8">
//             {/* Circle */}
//             <div className="relative w-28 h-28 shrink-0">
//               <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
//                 <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
//                 <circle cx="50" cy="50" r="40" fill="none" stroke="#7c3aed" strokeWidth="10"
//                   strokeDasharray={`${2 * Math.PI * 40}`}
//                   strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
//                   strokeLinecap="round" />
//               </svg>
//               <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <span className="text-xl font-bold text-gray-900">{percentage}%</span>
//                 <span className="text-xs text-gray-400">{score}/{totalQuestions} Correct</span>
//               </div>
//             </div>

//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <span className="text-2xl">🏆</span>
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {percentage >= 80 ? 'Great Job' : percentage >= 60 ? 'Good Effort' : 'Keep Practicing'}, User!
//                 </h2>
//               </div>
//               <p className="text-gray-500 text-sm mb-6">{aiInsights?.summary}</p>
//               <div className="flex gap-3">
//                 <button onClick={() => router.push('/dashboard')}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition">
//                   Back to Dashboard
//                 </button>
//                 <button onClick={() => router.push(`/lessons/${lessonId}`)}
//                   className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2.5 rounded-full text-sm font-medium transition">
//                   Review Chapter Content
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Question breakdown */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-semibold text-gray-900">Question Breakdown</h3>
//               <div className="flex items-center gap-4 text-xs text-gray-500">
//                 <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full" /> Correct</span>
//                 <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" /> Incorrect</span>
//               </div>
//             </div>

//             <div className="flex flex-col gap-4">
//               {questions.map((q, i) => (
//                 <div key={i} className={`rounded-xl border p-4 ${q.isCorrect ? 'border-gray-100' : 'border-red-100 bg-red-50/30'}`}>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-xs font-semibold text-gray-400">{i + 1}</span>
//                     {q.isCorrect
//                       ? <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">CORRECT</span>
//                       : <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">INCORRECT</span>}
//                   </div>
//                   <p className="text-sm text-gray-700 mb-3">{q.question}</p>
//                   <div className="grid grid-cols-2 gap-2">
//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <p className="text-xs text-gray-400 mb-1">YOUR ANSWER</p>
//                       <p className={`text-sm font-medium ${q.isCorrect ? 'text-gray-700' : 'text-red-500'}`}>
//                         {q.userAnswer}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <p className="text-xs text-gray-400 mb-1">CORRECT ANSWER</p>
//                       <p className="text-sm font-medium text-gray-700">{q.correctAnswer}</p>
//                     </div>
//                   </div>
//                   {!q.isCorrect && q.explanation && (
//                     <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
//                       <p className="text-xs text-gray-600">{q.explanation}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right — AI Insights */}
//         <div className="w-72 shrink-0">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
//             <div className="flex items-center gap-2 mb-6">
//               <span>✨</span>
//               <h3 className="font-semibold text-gray-900">AI Performance Insights</h3>
//             </div>

//             {/* Strong areas */}
//             {aiInsights?.strongAreas?.length > 0 && (
//               <div className="mb-5">
//                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//                   Strong Understanding
//                 </p>
//                 {aiInsights.strongAreas.map((area, i) => (
//                   <div key={i} className="mb-3">
//                     <div className="flex items-center justify-between mb-1">
//                       <p className="text-sm font-medium text-gray-800">{area.topic}</p>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
//                       <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '100%' }} />
//                     </div>
//                     <p className="text-xs text-gray-400">{area.detail}</p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Weak areas */}
//             {aiInsights?.weakAreas?.length > 0 && (
//               <div className="mb-5">
//                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//                   Area for Growth
//                 </p>
//                 {aiInsights.weakAreas.map((area, i) => (
//                   <div key={i} className="mb-3">
//                     <p className="text-sm font-medium text-gray-800">{area.topic}</p>
//                     <div className="w-full bg-gray-100 rounded-full h-1.5 my-1">
//                       <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '40%' }} />
//                     </div>
//                     <p className="text-xs text-gray-400">{area.detail}</p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Recommended study */}
//             {aiInsights?.recommendedStudy?.length > 0 && (
//               <div>
//                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//                   Recommended Study
//                 </p>
//                 {aiInsights.recommendedStudy.map((item, i) => (
//                   <div key={i}
//                     className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 cursor-pointer transition mb-2">
//                     <div className="flex items-center gap-2">
//                       <span>{item.type === 'video' ? '▶️' : '📖'}</span>
//                       <span className="text-sm text-gray-700">{item.label}</span>
//                     </div>
//                     <span className="text-gray-400">→</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { QuizResult } from '@/types';
import Image from 'next/image';

export default function QuizResultPage() {
  const router = useRouter();
  const { lessonId } = useParams();
  const [result, setResult] = useState<QuizResult | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult');
    if (!stored) { router.push('/dashboard'); return; }
    setResult(JSON.parse(stored));
  }, []);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const { score, totalQuestions, percentage, questions, aiInsights } = result;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-print, #report-print * { visibility: visible; }
          #report-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 24px;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Download button */}
        <div className="flex justify-end mb-4 no-print">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition"
          >
            ⬇ Download Report
          </button>
        </div>

        {/* Report content */}
        <div ref={reportRef} id="report-print" className="bg-gray-50 p-6">

          {/* Logo header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <Image
              src="/logo.png"
              alt="Maanak"
              width={120}
              height={40}
              style={{ objectFit: 'contain' }}
            />
            <span className="ml-auto text-xs text-gray-400">
              Quiz Performance Report
            </span>
          </div>

          <div className="flex gap-8">
            {/* Left */}
            <div className="flex-1">
              {/* Score card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 flex items-center gap-8">
                <div className="relative w-28 h-28 shrink-0">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="40" fill="none" stroke="#7c3aed" strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{percentage}%</span>
                    <span className="text-xs text-gray-400">{score}/{totalQuestions} Correct</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🏆</span>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {percentage >= 80 ? 'Great Job' : percentage >= 60 ? 'Good Effort' : 'Keep Practicing'}, User!
                    </h2>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">{aiInsights?.summary}</p>
                  <div className="flex gap-3 no-print">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition"
                    >
                      Back to Dashboard
                    </button>
                    <button
                      onClick={() => router.push(`/lessons/${lessonId}`)}
                      className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2.5 rounded-full text-sm font-medium transition"
                    >
                      Review Chapter Content
                    </button>
                  </div>
                </div>
              </div>

              {/* Question breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Question Breakdown</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-400 rounded-full inline-block" /> Correct
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-400 rounded-full inline-block" /> Incorrect
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {questions.map((q, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 ${q.isCorrect ? 'border-gray-100' : 'border-red-100 bg-red-50/30'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">{i + 1}</span>
                        {q.isCorrect
                          ? <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">CORRECT</span>
                          : <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">INCORRECT</span>
                        }
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-400 mb-1">YOUR ANSWER</p>
                          <p className={`text-sm font-medium ${q.isCorrect ? 'text-gray-700' : 'text-red-500'}`}>
                            {q.userAnswer}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-400 mb-1">CORRECT ANSWER</p>
                          <p className="text-sm font-medium text-gray-700">{q.correctAnswer}</p>
                        </div>
                      </div>
                      {!q.isCorrect && q.explanation && (
                        <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                          <p className="text-xs text-gray-600">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — AI Insights */}
            <div className="w-72 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span>✨</span>
                  <h3 className="font-semibold text-gray-900">AI Performance Insights</h3>
                </div>

                {aiInsights?.strongAreas?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Strong Understanding
                    </p>
                    {aiInsights.strongAreas.map((area, i) => (
                      <div key={i} className="mb-3">
                        <p className="text-sm font-medium text-gray-800">{area.topic}</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '100%' }} />
                        </div>
                        <p className="text-xs text-gray-400">{area.detail}</p>
                      </div>
                    ))}
                  </div>
                )}

                {aiInsights?.weakAreas?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Area for Growth
                    </p>
                    {aiInsights.weakAreas.map((area, i) => (
                      <div key={i} className="mb-3">
                        <p className="text-sm font-medium text-gray-800">{area.topic}</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 my-1">
                          <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '40%' }} />
                        </div>
                        <p className="text-xs text-gray-400">{area.detail}</p>
                      </div>
                    ))}
                  </div>
                )}

                {aiInsights?.recommendedStudy?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Recommended Study
                    </p>
                    {aiInsights.recommendedStudy.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 mb-2">
                        <div className="flex items-center gap-2">
                          <span>{item.type === 'video' ? '▶️' : '📖'}</span>
                          <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}