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
            ? 'bg-gray-200 font-medium text-gray-900 dark:bg-gray-800 dark:text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}
