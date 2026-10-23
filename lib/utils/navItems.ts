import {
  LayoutDashboard,
  Users,
  Car,
  Route,
  ClipboardList,
  Settings,
  ShieldCheck,
  ChartNoAxesCombined,
  Menu,
  Currency,
  Repeat,
  AlertTriangle,
  MapPin,
  Terminal,
  Megaphone,
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
    label: 'Stats',
    href: '/stats',
    icon: ChartNoAxesCombined,
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
    label: 'Orders',
    href: '/orders',
    icon: ClipboardList,
    permissions: ['ORDER_READ'],
  },
  {
    label: 'Live Map',
    href: '/rides/live-map',
    icon: MapPin,
    permissions: ['ORDER_READ'],
  },
  {
    label: 'Ride Payment Plans',
    href: '/ride-payment-plans',
    icon: Repeat,
    permissions: ['PLAN_READ'],
  },
  {
    label: 'Disputes',
    href: '/disputes',
    icon: AlertTriangle,
    permissions: ['ORDER_READ'],
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
    label: 'Notifications',
    href: '/notifications',
    icon: Megaphone,
    permissions: ['NOTIFICATION_READ', 'NOTIFICATION_SEND'],
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
  {
    label: 'Dev Console',
    href: '/dev-console',
    icon: Terminal,
    permissions: ['CONSOLE_ACCESS'],
  },
];

export default navItems;
