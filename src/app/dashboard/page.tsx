'use client';

import { useEffect } from 'react';
import StatCard from '@/component/utils/StatCard';
import DateRangeFilter from '@/component/utils/DateRangeFilter';
import LineChart from '@/component/charts/LineChart';
import { useAuth } from '../../../lib/hooks/useAuth';
import { useDashboard } from '../../../lib/hooks/useDashboard';
import { dashboardUtils } from '../../../lib/utils/dashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, rideVolumeGraph, loading, currentFilter, fetchDashboardData, setFilter } = useDashboard();

  useEffect(() => {
    fetchDashboardData('web', currentFilter);
  }, [currentFilter, fetchDashboardData]);

  const exportRideVolume = () => {
    const rows = [['Period', 'Ride count'], ...(rideVolumeGraph || []).map((item) => [item.period, item.count])];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lapel-ride-volume.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Dashboard | {user?.firstName} {user?.lastName}
        </h1>

        <DateRangeFilter
          value={currentFilter}
          onExport={exportRideVolume}
          onChange={(filter) => setFilter({ ...currentFilter, ...filter })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Users" value={dashboardUtils.formatNumber(stats?.totalUsers ?? 0)} />
        <StatCard title="Active Users" value={dashboardUtils.formatNumber(stats?.activeUsers ?? 0)} variant="success" />
        <StatCard title="Active Rides" value={dashboardUtils.formatNumber(stats?.activeRides ?? 0)} />
        <StatCard title="Completed Rides" value={dashboardUtils.formatNumber(stats?.completedRides ?? 0)} variant="success" />
        <StatCard title="Cancelled Rides" value={dashboardUtils.formatNumber(stats?.cancelledRides ?? 0)} variant="danger" />
        <StatCard title="Total Vehicles" value={dashboardUtils.formatNumber(stats?.totalVehicles ?? 0)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="surface p-4 lg:col-span-2">
          <h3 className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            Ride Volume ({dashboardUtils.getPeriodLabel(currentFilter)})
          </h3>
          <LineChart
            data={dashboardUtils.prepareChartData(rideVolumeGraph ?? [])}
            options={dashboardUtils.getChartOptions('Ride Volume')}
            loading={loading}
          />
        </div>

        <div className="surface p-4">
          <h3 className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-300">Current Period</h3>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Active rides</span>
              <strong>{dashboardUtils.formatNumber(stats?.activeRides ?? 0)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Completed rides</span>
              <strong>{dashboardUtils.formatNumber(stats?.completedRides ?? 0)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Cancelled rides</span>
              <strong>{dashboardUtils.formatNumber(stats?.cancelledRides ?? 0)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
