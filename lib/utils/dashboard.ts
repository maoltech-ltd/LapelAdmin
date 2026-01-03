// utils/dashboard.utils.ts
import { DashboardFilter, DashboardStats, RideVolumeData } from '../types/dashboard.types';

export const dashboardUtils = {
  // Format date for display
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Format period label based on filter
  getPeriodLabel: (filter: DashboardFilter): string => {
    switch (filter.period) {
        case 'TODAY':
        return 'Today';
        case 'LAST_7_DAYS':
        return 'Last 7 Days';
        case 'LAST_30_DAYS':
        return 'Last 30 Days';
        case 'LAST_3_MONTHS':
        return 'Last 3 Months';
        case 'LAST_1_YEAR':
        return 'Last 1 Year';
        case 'CUSTOM':
        if (filter.startDate && filter.endDate) {
            return `Custom (${dashboardUtils.formatDate(filter.startDate)} - ${dashboardUtils.formatDate(filter.endDate)})`;
        }
        return 'Custom Period';
        default:
        return 'Today';
    }
  },


  // Calculate percentage change
  calculatePercentageChange: (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  // Format number with commas
  formatNumber: (num: number): string => {
    return num.toLocaleString('en-US');
  },

  // Prepare chart data for visualization libraries
  prepareChartData: (rideVolumeData: RideVolumeData[]): any => {
    return {
      labels: rideVolumeData.map(item => item.period),
      datasets: [
        {
          label: 'Ride Volume',
          data: rideVolumeData.map(item => item.count),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          tension: 0.4,
        }
      ]
    };
  },

  // Get chart options
  getChartOptions: (title: string) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return dashboardUtils.formatNumber(value);
          }
        }
      }
    }
  }),

  // Generate mock previous data for demonstration (remove in production)
  getMockPreviousStats: (currentStats: DashboardStats): DashboardStats => {
    return {
      totalUsers: Math.floor(currentStats.totalUsers * 0.85),
      activeUsers: Math.floor(currentStats.activeUsers * 0.8),
      totalRiders: Math.floor(currentStats.totalRiders * 0.9),
      availableRiders: Math.floor(currentStats.availableRiders * 0.85),
      totalVehicles: Math.floor(currentStats.totalVehicles * 0.88),
      totalRides: Math.floor(currentStats.totalRides * 0.75),
      activeRides: Math.floor(currentStats.activeRides * 0.7),
      completedRides: Math.floor(currentStats.completedRides * 0.8),
      cancelledRides: Math.floor(currentStats.cancelledRides * 0.9),
      totalOrders: Math.floor(currentStats.totalOrders * 0.78),
      paidOrders: Math.floor(currentStats.paidOrders * 0.82),
      pendingPayments: Math.floor(currentStats.pendingPayments * 0.85),
    };
  }
};