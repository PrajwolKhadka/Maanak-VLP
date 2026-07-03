'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Question {
  question: string;
  options: string[];
}

interface RawQuestion extends Question {
  correctAnswer: string;
  explanation: string;
}

export default function QuizPage() {
  const { lessonId } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [rawQuestions, setRawQuestions] = useState<RawQuestion[]>([]);
  const [answers, setAnswers] = useState<{ userAnswer: string }[]>([]);
  const [current, setCurrent] = useState(0);
  const [lessonTitle, setLessonTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const[error, setError]= useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const lessonRes = await api.get(`/lessons/single/${lessonId}`);
        setLessonTitle(lessonRes.data.title);

        const quizRes = await api.get(`/quiz/generate/${lessonId}`);
        setQuestions(quizRes.data.questions);
        setRawQuestions(quizRes.data._raw);
        setAnswers(new Array(quizRes.data.questions.length).fill({ userAnswer: '' }));
        setTimeLeft(quizRes.data.questions.length * 60);
      }catch(err:any){
        setError(err.response?.data?.message || 'Failed to generate quiz');
      } 
      finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    const updated = [...answers];
    updated[current] = { userAnswer: option };
    setAnswers(updated);
  };

  const handleNext = () => {
    setSelectedOption(answers[current + 1]?.userAnswer || null);
    setCurrent(c => c + 1);
  };

  const handlePrev = () => {
    setSelectedOption(answers[current - 1]?.userAnswer || null);
    setCurrent(c => c - 1);
  };

  const handleSkip = () => {
    const updated = [...answers];
    updated[current] = { userAnswer: 'Skipped' };
    setAnswers(updated);
    if (current < questions.length - 1) {
      setSelectedOption(null);
      setCurrent(c => c + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const timeTaken = questions.length * 60 - timeLeft;
      const { data } = await api.post(`/quiz/submit/${lessonId}`, {
        answers,
        rawQuestions,
        timeTaken,
      });
      // store result in sessionStorage for result page
      sessionStorage.setItem('quizResult', JSON.stringify(data));
      router.push(`/quiz/${lessonId}/result`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Generating quiz questions with AI...</p>
    </div>
  );

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const answeredCount = answers.filter(a => a.userAnswer && a.userAnswer !== '').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <h1 className="font-bold text-gray-900 text-lg">Maanak Quiz</h1>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <button className="text-gray-400 hover:text-gray-600">?</button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Quiz Progress</p>
              <p className="font-semibold text-gray-900">{lessonTitle}</p>
            </div>
            <p className="text-purple-500 font-semibold text-sm">
              Question {current + 1} of {questions.length}
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
              {current + 1}
            </div>
            <p className="text-gray-900 font-medium text-lg leading-relaxed">{question.question}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, i) => {
              const letter = ['A', 'B', 'C', 'D'][i];
              const isSelected = selectedOption === option || answers[current]?.userAnswer === option;
              return (
                <button key={i} onClick={() => handleSelect(option)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition
                    ${isSelected
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50 text-gray-700'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                    ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {letter}
                  </div>
                  <span className="text-sm">{option.replace(/^[A-D]\.\s*/, '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={handlePrev} disabled={current === 0}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 transition">
            ← Previous
          </button>

          <div className="flex items-center gap-4">
            <button onClick={handleSkip}
              className="text-sm text-purple-500 hover:text-purple-700 font-medium transition">
              Skip Question
            </button>

            {current === questions.length - 1 ? (
              <button onClick={handleSubmit} disabled={submitting}
                className="bg-green-400 hover:bg-green-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition disabled:opacity-60">
                {submitting ? 'Submitting...' : `Submit (${answeredCount}/${questions.length})`}
              </button>
            ) : (
              <button onClick={handleNext}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
                Next Question →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}