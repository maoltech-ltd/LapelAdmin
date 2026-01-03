// types/dashboard.types.ts
export interface DashboardFilter {
  period?: 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_3_MONTHS' | 'LAST_1_YEAR' | 'CUSTOM';
  startDate?: string;
  endDate?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRiders: number;
  availableRiders: number;
  totalVehicles: number;
  totalRides: number;
  activeRides: number;
  completedRides: number;
  cancelledRides: number;
  totalOrders: number;
  paidOrders: number;
  pendingPayments: number;
}

export interface RideVolumeData {
  period: string;
  count: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
  timestamp: string;
}