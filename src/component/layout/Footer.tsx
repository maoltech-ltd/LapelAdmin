'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <footer className="border-t bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Lapel. All rights reserved.
      </div>
    </footer>
  );
}
