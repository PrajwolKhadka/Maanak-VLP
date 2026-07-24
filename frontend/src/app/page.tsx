'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { TopicCategory } from '@/types';
import TopicsPanel from '@/components/layout/TopicsPanel';

export default function LandingPage() {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [categories, setCategories] = useState<TopicCategory[]>([]);

  useEffect(() => {
    api.get('/topics').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 max-w-7xl mx-auto relative z-50">
        <Image
          src="/frame7.png"
          alt="Maanak"
          width={150}
          height={45}
          style={{ width: '150px', height: 'auto' }}
        />

        <div className="flex items-center gap-8">
          <button
            onClick={() => setTopicsOpen(!topicsOpen)}
            className={`font-medium transition ${
              topicsOpen ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Topics
          </button>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-green-400 hover:bg-green-500 text-white px-7 py-2.5 rounded-full font-semibold transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Topics Panel */}
      {topicsOpen && (
        <TopicsPanel categories={categories} onClose={() => setTopicsOpen(false)} />
      )}

      {/* Hero */}
      <section className="flex items-center justify-between pl-10 max-w-8xl mx-auto min-h-[85vh]">
        <div className="max-w-xl shrink-0">
          <h2 className="text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Crack Chemistry
            <br />
            with <span className="text-purple-500">AI</span> by your side
          </h2>

          <p className="text-gray-500 text-lg mb-10">
            A journey towards <span className="text-purple-400 font-medium">excellence</span>
          </p>

          <Link
            href="/register"
            className="bg-green-400 hover:bg-green-500 text-white px-10 py-4 rounded-full font-semibold text-lg transition inline-block"
          >
            Get Started →
          </Link>

          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Maanak?</h3>
            <div className="flex gap-10">
              <div>
                <p className="font-bold text-gray-800">🤖 AI-Powered</p>
                <p className="text-sm text-gray-500 mt-1 max-w-[120px]">
                  Personalized learning experience
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-800">📘 Exam-Focused</p>
                <p className="text-sm text-gray-500 mt-1 max-w-[120px]">
                  Target what matters, ace with confidence
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-800">📈 Track & Improve</p>
                <p className="text-sm text-gray-500 mt-1 max-w-[120px]">
                  Smart analytics to boost your performance
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1 relative h-[85vh]">
          <Image
            src="/hero-image.png"
            alt="Maanak Platform"
            fill
            sizes="50vw"
            className="object-contain object-right"
            loading="eager"
          />
        </div>
      </section>

      {/* Learning features */}
      <section className="bg-purple-50 py-24 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-purple-500 font-semibold mb-3">LEARN SMARTER</p>
            <h2 className="text-4xl font-extrabold text-gray-900">
              Everything you need to master +2 Chemistry
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              Learn concepts clearly, revise faster, and test yourself with tools built for your exam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl mb-6">
                🎥
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Video Lessons</h3>
              <p className="text-gray-500 leading-relaxed">
                Watch simple, focused lessons for every chapter and understand difficult concepts at your own pace.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl mb-6">
                ✨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Study Summaries</h3>
              <p className="text-gray-500 leading-relaxed">
                Turn lengthy topics into quick, easy-to-revise summaries with key formulas and important points.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-3xl mb-6">
                🧠
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Generated Quizzes</h3>
              <p className="text-gray-500 leading-relaxed">
                Practice chapter-wise questions made for your level and get instant feedback on every attempt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <p className="text-green-500 font-semibold mb-3">YOUR DAILY STUDY PARTNER</p>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                A better way to prepare for Chemistry
              </h2>
              <p className="text-gray-500 text-lg mt-5">
                Maanak guides you from your first lesson to your final revision, making your preparation focused and measurable.
              </p>

              <div className="mt-9 space-y-6">
                {[
                  ['01', 'Choose your chapter', 'Start from the topics you want to improve.'],
                  ['02', 'Learn and revise', 'Watch lessons and use AI-powered summaries.'],
                  ['03', 'Practice with confidence', 'Take quizzes and identify your weak areas.'],
                ].map(([number, title, description]) => (
                  <div key={number} className="flex gap-5">
                    <span className="shrink-0 w-11 h-11 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                      <p className="text-gray-500 mt-1">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl">
              <p className="text-purple-200 font-medium">TODAY&apos;S PROGRESS</p>
              <h3 className="text-3xl font-bold mt-2">You&apos;re getting better every day.</h3>

              <div className="bg-white/15 rounded-2xl mt-10 p-6 backdrop-blur-sm">
                <div className="flex justify-between text-sm mb-3">
                  <span>Electrochemistry</span>
                  <span>75% complete</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className="bg-green-400 h-3 rounded-full w-3/4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/15 rounded-2xl p-5">
                  <p className="text-purple-200 text-sm">Quizzes completed</p>
                  <p className="text-3xl font-bold mt-2">24</p>
                </div>
                <div className="bg-white/15 rounded-2xl p-5">
                  <p className="text-purple-200 text-sm">Average score</p>
                  <p className="text-3xl font-bold mt-2">86%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="px-10 pb-24">
        <div className="max-w-7xl mx-auto bg-indigo-400 rounded-[2.5rem] px-8 py-14 md:p-16 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="max-w-2xl">
            <p className="font-semibold text-white mb-3">READY TO BEGIN?</p>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Your next Chemistry breakthrough starts here.
            </h2>
            <p className="text-slate-950/75 mt-4 text-lg">
              Join Maanak and make every study session count.
            </p>
          </div>

          <Link
            href="/register"
            className="shrink-0 bg-white hover:bg-gray-50 text-purple-600 px-9 py-4 rounded-full font-bold text-lg transition"
          >
            Start Learning Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-10 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Maanak. Learn chemistry with confidence.</p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-purple-600">Login</Link>
            <Link href="/register" className="hover:text-purple-600">Register</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}