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

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permissions: ['VIEW_DASHBOARD'],
  },
  {
    label: 'Users',
    href: '/users',
    icon: Users,
    permissions: ['USER_READ'],
  },
  {
    label: 'Drivers',
    href: '/drivers',
    icon: Car,
    permissions: ['DRIVER_READ'],
  },
  {
    label: 'Rides',
    href: '/rides',
    icon: Route,
    permissions: ['RIDE_READ'],
  },
  {
    label: 'Payments',
    href: '/payments',
    icon: Currency,
    permissions: ['TRANSACTION_READ'],
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: Currency,
    permissions: ['TRANSACTION_READ'],
  },
  {
    label: 'Roles & Permissions',
    href: '/roles-permissions',
    icon: ShieldCheck,
    permissions: ['ROLE_READ', 'PERMISSION_READ'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    permissions: ['EDIT_SETTINGS'],
  },
];

export default navItems;