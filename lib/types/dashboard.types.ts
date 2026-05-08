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

export type StatsEntityType = 'USER' | 'RIDER' | 'VEHICLE';

export interface StatsMetric {
  key: string;
  label: string;
  value: number;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat' | string;
  unit: 'count' | 'currency' | string;
}

export interface StatsTrendPoint {
  period: string;
  users: number;
  riders: number;
  vehicles: number;
  rides: number;
  completedRides: number;
  cancelledRides: number;
  orders: number;
  transactions: number;
  paidOrders: number;
  pendingPayments: number;
  revenue: number;
  transactionVolume: number;
  seatsBooked: number;
}

export interface StatsBreakdown {
  label: string;
  value: number;
  percent: number;
}

export interface AdvancedStats {
  title: string;
  entityType?: StatsEntityType;
  entityId?: string;
  startDate: string;
  endDate: string;
  metrics: StatsMetric[];
  trends: Record<'daily' | 'weekly' | 'monthly' | 'yearly', StatsTrendPoint[]>;
  breakdowns: Record<string, StatsBreakdown[]>;
  averages: Record<string, number>;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
  timestamp: string;
}
