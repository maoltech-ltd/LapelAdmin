'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
// import {
//   LayoutDashboard,
//   Users,
//   Car,
//   Route,
//   Settings,
//   ShieldCheck,
//   Menu,
//   Currency,
//   X,
// } from 'lucide-react';
import {
  Menu,
  X,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import navItems from '../../../lib/utils/navItems';
import { useAuth } from '../../../lib/hooks/useAuth';
import { hasAnyPermission } from '../../../lib/utils/permiisions';

// const navItems = [
//   { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permissions: ['VIEW_DASHBOARD'] },
//   { label: 'Users', href: '/users', icon: Users, permissions: ['USER_READ'] },
//   { label: 'Drivers', href: '/drivers', icon: Car, permissions: ['DRIVER_READ'] },
//   { label: 'Rides', href: '/rides', icon: Route, permissions: ['RIDE_READ'] },
//   { label: 'Payments', href: '/payments', icon: Currency, permissions: ['TRANSACTION_READ'] },
//   { label: 'Roles & Permissions', href: '/roles-permissions', icon: ShieldCheck, permissions: ['ROLE_READ', 'PERMISSION_READ'], },
//   { label: 'Settings', href: '/settings', icon: Settings, permissions: ['EDIT_SETTINGS'], },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   // Hide sidebar on login
//   if (pathname === '/') return null;

//   return (
//     <>
//       {/* Mobile toggle */}
//       <button
//         onClick={() => setOpen(true)}
//         className="fixed left-4 top-20 z-40 rounded-lg bg-gray-800 p-2 text-white md:hidden"
//       >
//         <Menu size={20} />
//       </button>

//       {/* Overlay (mobile) */}
//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 md:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed z-50 h-full w-64 transform bg-white shadow-lg transition-transform dark:bg-gray-900 md:static md:translate-x-0
//         ${open ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-4 py-4 dark:border-gray-800">
//           <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
//             Admin Menu
//           </span>
//           <button onClick={() => setOpen(false)} className="md:hidden">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="space-y-1 p-3">
//           {navItems.map((item) => (
//             <SidebarItem
//               key={item.href}
//               {...item}
//               active={pathname === item.href}
//               onClick={() => setOpen(false)}
//             />
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// }
export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
      <nav className="space-y-1 p-3">
        {navItems
          .filter(item => hasAnyPermission(role, item.permissions))
          .map(item => (
            <SidebarItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
      </nav>
    </aside>
  );
}
