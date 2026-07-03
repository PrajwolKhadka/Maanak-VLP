// import Link from 'next/link';
// import Image from 'next/image';
// import { TopicCategory } from '@/types';
// import TopicsPanel from '@/components/layout/TopicsPanel';
// import { useState, useEffect } from 'react';
// import api from '@/lib/axios';

// export default function LandingPage() {
//   const [topicsOpen, setTopicOpen] = useState(false);
//   const [categories, setCategories] = useState<TopicCategory[]>([]);

//   return (
//     <main className="min-h-screen bg-white overflow-hidden">
//       {/* Navbar */}
//       <nav className="flex items-center justify-between px-10 py-5 max-w-7xl mx-auto">
//         <Image src="/Frame7.png" alt="Maanak" width={150} height={45} style={{ width: '150px', height: 'auto' }} />
//         <div className="flex items-center gap-8">
//           <Link href="/topics-preview" className="text-gray-600 hover:text-gray-900 font-medium">Topics</Link>
//           <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
//           <Link href="/register" className="bg-green-400 hover:bg-green-500 text-white px-7 py-2.5 rounded-full font-semibold transition">Register</Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="flex items-center justify-between pl-10 max-w-7xl mx-auto min-h-[85vh]">
//         {/* Left */}
//         <div className="max-w-xl shrink-0">
//           <h2 className="text-6xl font-extrabold text-gray-900 leading-tight mb-5">
//             Crack Chemistry<br />
//             with <span className="text-purple-500">AI</span> by your side
//           </h2>
//           <p className="text-gray-500 text-lg mb-10">
//             A journey towards <span className="text-purple-400 font-medium">excellence</span>
//           </p>
//           <Link href="/register"
//             className="bg-green-400 hover:bg-green-500 text-white px-10 py-4 rounded-full font-semibold text-lg transition inline-block">
//             Get Started →
//           </Link>

//           {/* Why Maanak */}
//           <div className="mt-20">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Maanak?</h3>
//             <div className="flex gap-10">
//               <div>
//                 <p className="font-bold text-gray-800">🤖 AI-Powered</p>
//                 <p className="text-sm text-gray-500 mt-1 max-w-30">Personalized learning experience</p>
//               </div>
//               <div>
//                 <p className="font-bold text-gray-800">📘 Exam-Focused</p>
//                 <p className="text-sm text-gray-500 mt-1 max-w-30">Target what matters, ace with confidence</p>
//               </div>
//               <div>
//                 <p className="font-bold text-gray-800">📈 Track & Improve</p>
//                 <p className="text-sm text-gray-500 mt-1 max-w-30">Smart analytics to boost your performance</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right - Hero Image */}
//         <div className="hidden lg:block flex-1 relative h-[85vh]">
//           <Image
//             src="/hero-image.png"
//             alt="Maanak Platform"
//             fill
//             sizes="50vw"
//             className="object-contain object-right"
//             loading="eager"
//           />
//         </div>
//       </section>
//     </main>
//   );
// }
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
        <Image src="/logo.png" alt="Maanak" width={150} height={45} style={{ width: '150px', height: 'auto' }} />
        <div className="flex items-center gap-8">
          <button onClick={() => setTopicsOpen(!topicsOpen)}
            className={`font-medium transition ${topicsOpen ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}>
            Topics {topicsOpen ? '' : ''}
          </button>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
          <Link href="/register" className="bg-green-400 hover:bg-green-500 text-white px-7 py-2.5 rounded-full font-semibold transition">Register</Link>
        </div>
      </nav>

      {/* Topics Panel */}
      {topicsOpen && (
        <TopicsPanel categories={categories} onClose={() => setTopicsOpen(false)} />
      )}

      {/* Hero */}
      <section className="flex items-center justify-between pl-10 max-w-7xl mx-auto min-h-[85vh]">
        <div className="max-w-xl shrink-0">
          <h2 className="text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Crack Chemistry<br />
            with <span className="text-purple-500">AI</span> by your side
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            A journey towards <span className="text-purple-400 font-medium">excellence</span>
          </p>
          <Link href="/register"
            className="bg-green-400 hover:bg-green-500 text-white px-10 py-4 rounded-full font-semibold text-lg transition inline-block">
            Get Started →
          </Link>

          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Maanak?</h3>
            <div className="flex gap-10">
              <div>
                <p className="font-bold text-gray-800">🤖 AI-Powered</p>
                <p className="text-sm text-gray-500 mt-1 max-w-[120px]">Personalized learning experience</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">📘 Exam-Focused</p>
                <p className="text-sm text-gray-500 mt-1 max-w-[120px]">Target what matters, ace with confidence</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">📈 Track & Improve</p>
                <p className="text-sm text-gray-500 mt-1 max-w-[120px]">Smart analytics to boost your performance</p>
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
    </main>
  );
}