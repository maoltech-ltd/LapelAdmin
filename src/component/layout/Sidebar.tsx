'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Car,
  Route,
  Settings,
  ShieldCheck,
  Menu,
  Currency,
  X,
} from 'lucide-react';
import SidebarItem from './SidebarItem';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Drivers', href: '/drivers', icon: Car },
  { label: 'Rides', href: '/rides', icon: Route },
  { label: 'Payments', href: '/payments', icon: Currency },
  { label: 'Roles & Permissions', href: '/roles-permissions', icon: ShieldCheck },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Hide sidebar on login
  if (pathname === '/') return null;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-20 z-40 rounded-lg bg-gray-800 p-2 text-white md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 h-full w-64 transform bg-white shadow-lg transition-transform dark:bg-gray-900 md:static md:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-4 dark:border-gray-800">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Admin Menu
          </span>
          <button onClick={() => setOpen(false)} className="md:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              active={pathname === item.href}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
