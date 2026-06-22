'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Topics', href: '/topics', icon: '📖' },
  { label: 'Quizzes', href: '/quizzes', icon: '📝' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-4 fixed left-0 top-0">
      {/* Logo */}
      <div className="mb-8 px-2">
        <Image src="/logo.png" alt="Maanak" width={120} height={50} style={{ width: '180px', height: '80px' }} />
      </div>

      {/* User */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm overflow-hidden">
          {user?.avatar?(
            <Image src={user.avatar} alt="avatar" width = {36} height={36} className="w-full h-full object-cover" />
          ):( user?.username?.[0]?.toUpperCase() || 'U')}
        </div>
        <span className="text-sm font-medium text-gray-700 truncate">{user?.username || 'User'}</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
              ${pathname === item.href
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
        <span>↪</span> Logout
      </button>
    </aside>
  );
}