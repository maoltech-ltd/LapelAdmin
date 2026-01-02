// data/roles.mock.ts
export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt?: string;
  userCount?: number;
};

export const permissions = [
  // User Management
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  'users.suspend',
  'users.activate',
  
  // Driver Management
  'drivers.view',
  'drivers.create',
  'drivers.edit',
  'drivers.delete',
  'drivers.verify',
  'drivers.suspend',
  'drivers.activate',
  
  // Ride Management
  'rides.view',
  'rides.create',
  'rides.edit',
  'rides.cancel',
  'rides.approve',
  'rides.schedule',
  
  // Payment Management
  'payments.view',
  'payments.process',
  'payments.approve',
  'payments.refund',
  'payments.verify',
  'payments.export',
  
  // Financial Reports
  'reports.view',
  'reports.generate',
  'reports.export',
  
  // Analytics & Dashboard
  'dashboard.view',
  'analytics.view',
  
  // Settings
  'settings.view',
  'settings.update',
  'settings.configure',
  
  // Support & Messaging
  'support.tickets.view',
  'support.tickets.create',
  'support.tickets.resolve',
  'messages.send',
  'notifications.send',
  
  // Content Management
  'content.view',
  'content.create',
  'content.edit',
  'content.delete',
  
  // Promotions & Discounts
  'promotions.create',
  'promotions.edit',
  'promotions.delete',
  'discounts.create',
  
  // System Administration
  'roles.manage',
  'permissions.manage',
  'logs.view',
  'backup.create',
  'system.configure',
];

export const roles: Role[] = [
  {
    id: 'ROLE-001',
    name: 'Super Admin',
    description: 'Full system access and control',
    permissions: permissions, // All permissions
    createdAt: '2023-01-01',
    userCount: 3
  },
  {
    id: 'ROLE-002',
    name: 'Admin',
    description: 'Full operational access with some restrictions',
    permissions: [
      'users.view',
      'users.edit',
      'users.suspend',
      'drivers.view',
      'drivers.edit',
      'drivers.verify',
      'drivers.suspend',
      'rides.view',
      'rides.cancel',
      'payments.view',
      'payments.approve',
      'payments.refund',
      'reports.view',
      'reports.generate',
      'reports.export',
      'dashboard.view',
      'analytics.view',
      'settings.view',
      'settings.update',
      'support.tickets.view',
      'support.tickets.resolve',
      'messages.send',
      'notifications.send',
      'promotions.create',
      'promotions.edit',
      'logs.view'
    ],
    createdAt: '2023-02-15',
    userCount: 8
  },
  {
    id: 'ROLE-003',
    name: 'Support Agent',
    description: 'Customer and driver support access',
    permissions: [
      'users.view',
      'drivers.view',
      'rides.view',
      'rides.cancel',
      'payments.view',
      'support.tickets.view',
      'support.tickets.create',
      'support.tickets.resolve',
      'messages.send',
      'notifications.send'
    ],
    createdAt: '2023-03-10',
    userCount: 15
  },
  {
    id: 'ROLE-004',
    name: 'Finance Manager',
    description: 'Financial operations and reporting',
    permissions: [
      'payments.view',
      'payments.process',
      'payments.approve',
      'payments.refund',
      'payments.verify',
      'payments.export',
      'reports.view',
      'reports.generate',
      'reports.export',
      'dashboard.view',
      'analytics.view'
    ],
    createdAt: '2023-04-05',
    userCount: 5
  },
  {
    id: 'ROLE-005',
    name: 'Ride Operations',
    description: 'Manage rides and driver operations',
    permissions: [
      'drivers.view',
      'drivers.edit',
      'drivers.verify',
      'rides.view',
      'rides.create',
      'rides.edit',
      'rides.cancel',
      'rides.schedule',
      'dashboard.view'
    ],
    createdAt: '2023-05-20',
    userCount: 12
  },
  {
    id: 'ROLE-006',
    name: 'Marketing Manager',
    description: 'Promotions and user engagement',
    permissions: [
      'users.view',
      'analytics.view',
      'promotions.create',
      'promotions.edit',
      'promotions.delete',
      'discounts.create',
      'notifications.send',
      'content.view',
      'content.create',
      'content.edit'
    ],
    createdAt: '2023-06-15',
    userCount: 6
  },
  {
    id: 'ROLE-007',
    name: 'View Only',
    description: 'Read-only access for auditors and observers',
    permissions: [
      'users.view',
      'drivers.view',
      'rides.view',
      'payments.view',
      'reports.view',
      'dashboard.view',
      'analytics.view',
      'logs.view'
    ],
    createdAt: '2023-07-01',
    userCount: 4
  },
  {
    id: 'ROLE-008',
    name: 'Driver Manager',
    description: 'Specific driver management and verification',
    permissions: [
      'drivers.view',
      'drivers.create',
      'drivers.edit',
      'drivers.verify',
      'drivers.suspend',
      'drivers.activate',
      'rides.view',
      'notifications.send'
    ],
    createdAt: '2023-08-12',
    userCount: 10
  },
  {
    id: 'ROLE-009',
    name: 'System Auditor',
    description: 'System monitoring and compliance checks',
    permissions: [
      'users.view',
      'drivers.view',
      'rides.view',
      'payments.view',
      'reports.view',
      'logs.view',
      'analytics.view'
    ],
    createdAt: '2023-09-25',
    userCount: 3
  },
  {
    id: 'ROLE-010',
    name: 'Content Manager',
    description: 'Manage platform content and announcements',
    permissions: [
      'content.view',
      'content.create',
      'content.edit',
      'content.delete',
      'notifications.send',
      'messages.send'
    ],
    createdAt: '2023-10-30',
    userCount: 4
  },
  {
    id: 'ROLE-011',
    name: 'Customer Service',
    description: 'Basic customer support access',
    permissions: [
      'users.view',
      'rides.view',
      'support.tickets.view',
      'support.tickets.create',
      'support.tickets.resolve',
      'messages.send'
    ],
    createdAt: '2023-11-08',
    userCount: 20
  },
  {
    id: 'ROLE-012',
    name: 'Payment Processor',
    description: 'Handle payment transactions and refunds',
    permissions: [
      'payments.view',
      'payments.process',
      'payments.refund',
      'payments.verify'
    ],
    createdAt: '2023-12-14',
    userCount: 7
  },
  {
    id: 'ROLE-013',
    name: 'Regional Manager',
    description: 'Manage operations for specific regions',
    permissions: [
      'users.view',
      'users.edit',
      'drivers.view',
      'drivers.edit',
      'drivers.verify',
      'rides.view',
      'rides.cancel',
      'reports.view',
      'dashboard.view',
      'analytics.view',
      'promotions.create'
    ],
    createdAt: '2024-01-10',
    userCount: 6
  },
  {
    id: 'ROLE-014',
    name: 'Technical Support',
    description: 'Technical and system troubleshooting',
    permissions: [
      'users.view',
      'drivers.view',
      'rides.view',
      'logs.view',
      'support.tickets.view',
      'support.tickets.create',
      'support.tickets.resolve',
      'settings.view'
    ],
    createdAt: '2024-02-22',
    userCount: 8
  },
  {
    id: 'ROLE-015',
    name: 'Data Analyst',
    description: 'Access to analytics and reporting tools',
    permissions: [
      'users.view',
      'drivers.view',
      'rides.view',
      'payments.view',
      'reports.view',
      'reports.generate',
      'reports.export',
      'analytics.view',
      'dashboard.view'
    ],
    createdAt: '2024-03-18',
    userCount: 5
  },
];