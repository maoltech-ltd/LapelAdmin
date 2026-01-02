export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type DriverStatus = 'active' | 'suspended';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  
  status: DriverStatus;
  verificationStatus: VerificationStatus;
  
  rating: number;
  totalTrips: number;
  earnings: number;
  
  vehicle: {
    type: string;
    plateNumber: string;
    color: string;
    year?: number;
  };
  
  documents: {
    license: string;
    vehiclePaper: string;
    insurance?: string;
  };
  
  joinedAt: string;
  lastActive?: string;
}

export const drivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Michael Ade',
    email: 'michael@lapel.com',
    phone: '+2348011111111',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.6,
    totalTrips: 120,
    earnings: 560000,
    joinedAt: '2024-03-12',
    lastActive: '2025-01-15',
    vehicle: {
      type: 'Toyota Corolla',
      plateNumber: 'ABC-123-LG',
      color: 'Black',
      year: 2020
    },
    documents: {
      license: '/docs/license-drv001.jpg',
      vehiclePaper: '/docs/vehicle-drv001.jpg',
      insurance: '/docs/insurance-drv001.jpg'
    },
  },
  {
    id: 'DRV-002',
    name: 'Chioma Okeke',
    email: 'chioma@lapel.com',
    phone: '+2348022222222',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.8,
    totalTrips: 245,
    earnings: 980000,
    joinedAt: '2023-11-05',
    lastActive: '2025-01-16',
    vehicle: {
      type: 'Honda Accord',
      plateNumber: 'XYZ-456-LA',
      color: 'White',
      year: 2022
    },
    documents: {
      license: '/docs/license-drv002.jpg',
      vehiclePaper: '/docs/vehicle-drv002.jpg',
      insurance: '/docs/insurance-drv002.jpg'
    },
  },
  {
    id: 'DRV-003',
    name: 'Ibrahim Sani',
    email: 'ibrahim@lapel.com',
    phone: '+2348033333333',
    status: 'suspended',
    verificationStatus: 'approved',
    rating: 4.2,
    totalTrips: 89,
    earnings: 320000,
    joinedAt: '2024-06-18',
    lastActive: '2024-12-20',
    vehicle: {
      type: 'Kia Rio',
      plateNumber: 'DEF-789-PH',
      color: 'Blue',
      year: 2019
    },
    documents: {
      license: '/docs/license-drv003.jpg',
      vehiclePaper: '/docs/vehicle-drv003.jpg'
    },
  },
  {
    id: 'DRV-004',
    name: 'Fatima Bello',
    email: 'fatima@lapel.com',
    phone: '+2348044444444',
    status: 'active',
    verificationStatus: 'pending',
    rating: 4.0,
    totalTrips: 15,
    earnings: 45000,
    joinedAt: '2024-12-01',
    lastActive: '2025-01-14',
    vehicle: {
      type: 'Toyota Camry',
      plateNumber: 'GHI-012-AB',
      color: 'Silver',
      year: 2021
    },
    documents: {
      license: '/docs/license-drv004.jpg',
      vehiclePaper: '/docs/vehicle-drv004.jpg',
      insurance: '/docs/insurance-drv004.jpg'
    },
  },
  {
    id: 'DRV-005',
    name: 'Chukwudi Eze',
    email: 'chukwudi@lapel.com',
    phone: '+2348055555555',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.9,
    totalTrips: 312,
    earnings: 1450000,
    joinedAt: '2023-08-22',
    lastActive: '2025-01-16',
    vehicle: {
      type: 'Mercedes-Benz C-Class',
      plateNumber: 'JKL-345-AB',
      color: 'Black',
      year: 2023
    },
    documents: {
      license: '/docs/license-drv005.jpg',
      vehiclePaper: '/docs/vehicle-drv005.jpg',
      insurance: '/docs/insurance-drv005.jpg'
    },
  },
  {
    id: 'DRV-006',
    name: 'Amina Yusuf',
    email: 'amina@lapel.com',
    phone: '+2348066666666',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.7,
    totalTrips: 178,
    earnings: 720000,
    joinedAt: '2024-02-14',
    lastActive: '2025-01-15',
    vehicle: {
      type: 'Hyundai Elantra',
      plateNumber: 'MNO-678-CD',
      color: 'Red',
      year: 2020
    },
    documents: {
      license: '/docs/license-drv006.jpg',
      vehiclePaper: '/docs/vehicle-drv006.jpg'
    },
  },
  {
    id: 'DRV-007',
    name: 'Samuel Johnson',
    email: 'samuel@lapel.com',
    phone: '+2348077777777',
    status: 'suspended',
    verificationStatus: 'rejected',
    rating: 3.5,
    totalTrips: 42,
    earnings: 150000,
    joinedAt: '2024-07-30',
    lastActive: '2024-11-10',
    vehicle: {
      type: 'Toyota Corolla',
      plateNumber: 'PQR-901-EF',
      color: 'Gray',
      year: 2018
    },
    documents: {
      license: '/docs/license-drv007.jpg',
      vehiclePaper: '/docs/vehicle-drv007.jpg'
    },
  },
  {
    id: 'DRV-008',
    name: 'Grace Okafor',
    email: 'grace@lapel.com',
    phone: '+2348088888888',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.8,
    totalTrips: 287,
    earnings: 1100000,
    joinedAt: '2023-10-05',
    lastActive: '2025-01-16',
    vehicle: {
      type: 'Lexus RX 350',
      plateNumber: 'STU-234-GH',
      color: 'White',
      year: 2022
    },
    documents: {
      license: '/docs/license-drv008.jpg',
      vehiclePaper: '/docs/vehicle-drv008.jpg',
      insurance: '/docs/insurance-drv008.jpg'
    },
  },
  {
    id: 'DRV-009',
    name: 'Musa Abdullahi',
    email: 'musa@lapel.com',
    phone: '+2348099999999',
    status: 'active',
    verificationStatus: 'pending',
    rating: 0,
    totalTrips: 0,
    earnings: 0,
    joinedAt: '2025-01-10',
    vehicle: {
      type: 'Honda Civic',
      plateNumber: 'VWX-567-IJ',
      color: 'Blue',
      year: 2020
    },
    documents: {
      license: '/docs/license-drv009.jpg',
      vehiclePaper: '/docs/vehicle-drv009.jpg'
    },
  },
  {
    id: 'DRV-010',
    name: 'Jennifer Adebayo',
    email: 'jennifer@lapel.com',
    phone: '+2348101010101',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.4,
    totalTrips: 96,
    earnings: 380000,
    joinedAt: '2024-05-20',
    lastActive: '2025-01-15',
    vehicle: {
      type: 'Toyota RAV4',
      plateNumber: 'YZA-890-KL',
      color: 'Black',
      year: 2021
    },
    documents: {
      license: '/docs/license-drv010.jpg',
      vehiclePaper: '/docs/vehicle-drv010.jpg',
      insurance: '/docs/insurance-drv010.jpg'
    },
  },
  {
    id: 'DRV-011',
    name: 'David Chukwu',
    email: 'david@lapel.com',
    phone: '+2348111111111',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.5,
    totalTrips: 134,
    earnings: 520000,
    joinedAt: '2024-01-15',
    lastActive: '2025-01-14',
    vehicle: {
      type: 'Ford Explorer',
      plateNumber: 'BCD-123-MN',
      color: 'Green',
      year: 2019
    },
    documents: {
      license: '/docs/license-drv011.jpg',
      vehiclePaper: '/docs/vehicle-drv011.jpg'
    },
  },
  {
    id: 'DRV-012',
    name: 'Binta Mohammed',
    email: 'binta@lapel.com',
    phone: '+2348121212121',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.9,
    totalTrips: 345,
    earnings: 1550000,
    joinedAt: '2023-06-08',
    lastActive: '2025-01-16',
    vehicle: {
      type: 'BMW X5',
      plateNumber: 'CDE-456-OP',
      color: 'Black',
      year: 2023
    },
    documents: {
      license: '/docs/license-drv012.jpg',
      vehiclePaper: '/docs/vehicle-drv012.jpg',
      insurance: '/docs/insurance-drv012.jpg'
    },
  },
  {
    id: 'DRV-013',
    name: 'Emeka Nwosu',
    email: 'emeka@lapel.com',
    phone: '+2348131313131',
    status: 'suspended',
    verificationStatus: 'approved',
    rating: 4.1,
    totalTrips: 67,
    earnings: 240000,
    joinedAt: '2024-09-12',
    lastActive: '2024-12-28',
    vehicle: {
      type: 'Hyundai Sonata',
      plateNumber: 'EFG-789-QR',
      color: 'Silver',
      year: 2020
    },
    documents: {
      license: '/docs/license-drv013.jpg',
      vehiclePaper: '/docs/vehicle-drv013.jpg'
    },
  },
  {
    id: 'DRV-014',
    name: 'Zainab Ibrahim',
    email: 'zainab@lapel.com',
    phone: '+2348141414141',
    status: 'active',
    verificationStatus: 'approved',
    rating: 4.7,
    totalTrips: 198,
    earnings: 850000,
    joinedAt: '2024-04-05',
    lastActive: '2025-01-16',
    vehicle: {
      type: 'Toyota Highlander',
      plateNumber: 'FGH-012-ST',
      color: 'White',
      year: 2022
    },
    documents: {
      license: '/docs/license-drv014.jpg',
      vehiclePaper: '/docs/vehicle-drv014.jpg',
      insurance: '/docs/insurance-drv014.jpg'
    },
  },
  {
    id: 'DRV-015',
    name: 'Tunde Lawal',
    email: 'tunde@lapel.com',
    phone: '+2348151515151',
    status: 'active',
    verificationStatus: 'pending',
    rating: 4.3,
    totalTrips: 23,
    earnings: 75000,
    joinedAt: '2024-11-25',
    lastActive: '2025-01-15',
    vehicle: {
      type: 'Nissan Altima',
      plateNumber: 'HIJ-345-UV',
      color: 'Blue',
      year: 2021
    },
    documents: {
      license: '/docs/license-drv015.jpg',
      vehiclePaper: '/docs/vehicle-drv015.jpg'
    },
  },
];