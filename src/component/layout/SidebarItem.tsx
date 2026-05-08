'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
        ${
          active
            ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-200'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
        }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}
