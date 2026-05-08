'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();

  // Hide header on login page
  if (pathname === '/') return null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-lg font-semibold text-slate-900 transition hover:text-blue-700 dark:text-slate-100 dark:hover:text-blue-300"
        >
          Lapel <span className="text-sm text-slate-500 dark:text-slate-400">Admin</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
