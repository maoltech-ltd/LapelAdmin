import { Currency, PayoutStatus } from "./enum";

;

export interface Payout {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  currency: Currency;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  transactionId?: string;
  notes?: string;
}

export const payouts: Payout[] = [
  {
    id: 'po_001',
    driverId: 'DRV-001',
    driverName: 'Michael Ade',
    amount: 32000,
    currency: 'NGN',
    bankName: 'GTBank',
    accountNumber: '0123456789',
    accountName: 'MICHAEL ADE',
    status: 'pending',
    requestedAt: '2025-01-02T09:00:00Z',
    notes: 'Weekly earnings payout'
  },
  {
    id: 'po_002',
    driverId: 'DRV-002',
    driverName: 'Chioma Okeke',
    amount: 45000,
    currency: 'NGN',
    bankName: 'Access Bank',
    accountNumber: '0987654321',
    accountName: 'CHIOMA OKEKE',
    status: 'processing',
    requestedAt: '2025-01-01T14:20:00Z',
    transactionId: 'tx_005'
  },
  {
    id: 'po_003',
    driverId: 'DRV-003',
    driverName: 'Ibrahim Sani',
    amount: 18000,
    currency: 'NGN',
    bankName: 'UBA',
    accountNumber: '1122334455',
    accountName: 'IBRAHIM SANI',
    status: 'paid',
    requestedAt: '2024-12-31T18:00:00Z',
    processedAt: '2025-01-01T10:00:00Z',
    transactionId: 'BANK-00123'
  },
  {
    id: 'po_004',
    driverId: 'DRV-004',
    driverName: 'Fatima Bello',
    amount: 15000,
    currency: 'NGN',
    bankName: 'First Bank',
    accountNumber: '5566778899',
    accountName: 'FATIMA BELLO',
    status: 'pending',
    requestedAt: '2025-01-03T11:30:00Z',
    notes: 'First payout request'
  },
  {
    id: 'po_005',
    driverId: 'DRV-005',
    driverName: 'Chukwudi Eze',
    amount: 85000,
    currency: 'NGN',
    bankName: 'Zenith Bank',
    accountNumber: '6677889900',
    accountName: 'CHUKWUDI EZE',
    status: 'processing',
    requestedAt: '2025-01-04T09:15:00Z',
    transactionId: 'tx_012'
  },
  {
    id: 'po_006',
    driverId: 'DRV-006',
    driverName: 'Amina Yusuf',
    amount: 32000,
    currency: 'NGN',
    bankName: 'Access Bank',
    accountNumber: '7788990011',
    accountName: 'AMINA YUSUF',
    status: 'paid',
    requestedAt: '2025-01-05T08:45:00Z',
    processedAt: '2025-01-05T14:30:00Z',
    transactionId: 'BANK-00124'
  },
  {
    id: 'po_007',
    driverId: 'DRV-007',
    driverName: 'Samuel Johnson',
    amount: 9500,
    currency: 'NGN',
    bankName: 'GTBank',
    accountNumber: '8899001122',
    accountName: 'SAMUEL JOHNSON',
    status: 'failed',
    requestedAt: '2025-01-06T10:20:00Z',
    notes: 'Account verification failed'
  },
  {
    id: 'po_008',
    driverId: 'DRV-008',
    driverName: 'Grace Okafor',
    amount: 120000,
    currency: 'NGN',
    bankName: 'UBA',
    accountNumber: '9900112233',
    accountName: 'GRACE OKAFOR',
    status: 'processing',
    requestedAt: '2025-01-07T13:45:00Z',
    transactionId: 'tx_015'
  },
  {
    id: 'po_009',
    driverId: 'DRV-009',
    driverName: 'Musa Abdullahi',
    amount: 5000,
    currency: 'NGN',
    bankName: 'First Bank',
    accountNumber: '0011223344',
    accountName: 'MUSA ABDULLAHI',
    status: 'pending',
    requestedAt: '2025-01-08T15:30:00Z',
    notes: 'Initial payout for new driver'
  },
  {
    id: 'po_010',
    driverId: 'DRV-010',
    driverName: 'Jennifer Adebayo',
    amount: 42000,
    currency: 'NGN',
    bankName: 'Zenith Bank',
    accountNumber: '2233445566',
    accountName: 'JENNIFER ADEBAYO',
    status: 'processing',
    requestedAt: '2025-01-09T11:20:00Z',
    transactionId: 'tx_022'
  },
  {
    id: 'po_011',
    driverId: 'DRV-011',
    driverName: 'David Chukwu',
    amount: 38000,
    currency: 'NGN',
    bankName: 'First Bank',
    accountNumber: '3344556677',
    accountName: 'DAVID CHUKWU',
    status: 'processing',
    requestedAt: '2025-01-07T11:45:00Z',
    notes: 'Account under review'
  },
  {
    id: 'po_012',
    driverId: 'DRV-012',
    driverName: 'Binta Mohammed',
    amount: 95000,
    currency: 'NGN',
    bankName: 'GTBank',
    accountNumber: '4455667788',
    accountName: 'BINTA MOHAMMED',
    status: 'paid',
    requestedAt: '2025-01-10T09:00:00Z',
    processedAt: '2025-01-10T16:45:00Z',
    transactionId: 'BANK-00125'
  },
  {
    id: 'po_013',
    driverId: 'DRV-013',
    driverName: 'Emeka Nwosu',
    amount: 28000,
    currency: 'NGN',
    bankName: 'Access Bank',
    accountNumber: '5566778890',
    accountName: 'EMEKA NWOSU',
    status: 'pending',
    requestedAt: '2025-01-11T14:15:00Z'
  },
  {
    id: 'po_014',
    driverId: 'DRV-014',
    driverName: 'Zainab Ibrahim',
    amount: 67000,
    currency: 'NGN',
    bankName: 'UBA',
    accountNumber: '6677889901',
    accountName: 'ZAINAB IBRAHIM',
    status: 'processing',
    requestedAt: '2025-01-12T10:30:00Z',
    transactionId: 'tx_020'
  },
  {
    id: 'po_015',
    driverId: 'DRV-015',
    driverName: 'Tunde Lawal',
    amount: 25000,
    currency: 'NGN',
    bankName: 'Zenith Bank',
    accountNumber: '7788990012',
    accountName: 'TUNDE LAWAL',
    status: 'paid',
    requestedAt: '2025-01-13T08:45:00Z',
    processedAt: '2025-01-13T12:15:00Z',
    transactionId: 'BANK-00126'
  },
  {
    id: 'po_016',
    driverId: 'DRV-001',
    driverName: 'Michael Ade',
    amount: 28000,
    currency: 'NGN',
    bankName: 'GTBank',
    accountNumber: '0123456789',
    accountName: 'MICHAEL ADE',
    status: 'pending',
    requestedAt: '2025-01-15T09:30:00Z',
    notes: 'Second weekly payout'
  },
  {
    id: 'po_017',
    driverId: 'DRV-002',
    driverName: 'Chioma Okeke',
    amount: 52000,
    currency: 'NGN',
    bankName: 'Access Bank',
    accountNumber: '0987654321',
    accountName: 'CHIOMA OKEKE',
    status: 'processing',
    requestedAt: '2025-01-14T16:20:00Z',
    transactionId: 'tx_025'
  },
  {
    id: 'po_018',
    driverId: 'DRV-005',
    driverName: 'Chukwudi Eze',
    amount: 105000,
    currency: 'NGN',
    bankName: 'Zenith Bank',
    accountNumber: '6677889900',
    accountName: 'CHUKWUDI EZE',
    status: 'pending',
    requestedAt: '2025-01-16T11:45:00Z',
    notes: 'Monthly high earner payout'
  },
  {
    id: 'po_019',
    driverId: 'DRV-008',
    driverName: 'Grace Okafor',
    amount: 98000,
    currency: 'NGN',
    bankName: 'UBA',
    accountNumber: '9900112233',
    accountName: 'GRACE OKAFOR',
    status: 'processing',
    requestedAt: '2025-01-17T13:30:00Z',
    transactionId: 'tx_028'
  },
  {
    id: 'po_020',
    driverId: 'DRV-012',
    driverName: 'Binta Mohammed',
    amount: 115000,
    currency: 'NGN',
    bankName: 'GTBank',
    accountNumber: '4455667788',
    accountName: 'BINTA MOHAMMED',
    status: 'pending',
    requestedAt: '2025-01-18T10:15:00Z',
    notes: 'Premium driver monthly payout'
  },
];