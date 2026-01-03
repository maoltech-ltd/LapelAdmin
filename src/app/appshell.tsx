'use client';

import { usePathname } from 'next/navigation';
import Header from '@/component/layout/Header';
import Sidebar from '@/component/layout/Sidebar';
import Footer from '@/component/layout/Footer';
import AuthGuard from '@/component/guards/AuthGuard';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/forgot-password');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 px-4 py-6 md:px-6">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}
