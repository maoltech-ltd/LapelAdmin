'use client';

import StatCard from '@/component/utils/StatCard';
import DateRangeFilter from '@/component/utils/DateRangeFilter';
import ActivityFeed from '@/component/dashboards/ActivityFeed';
import LineChart from '@/component/charts/LineChart';
import BarChart from '@/component/charts/BarChart';

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>

        <DateRangeFilter
          onExport={() => console.log('Export CSV')}
          onChange={(range) => console.log(range)}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Users" value="12,450" />
        <StatCard title="Active Drivers" value="2,140" />
        <StatCard title="Active Rides Today" value="320" />
        <StatCard title="Completed Rides" value="10,980" />
        <StatCard title="Cancellations" value="210" variant="danger" />
        <StatCard title="Revenue" value="₦4.2M" variant="success" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow">
          <h3 className="mb-4 text-sm font-medium text-gray-600">
            Ride Volume
          </h3>
          <LineChart />
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="mb-4 text-sm font-medium text-gray-600">
            Peak Hours
          </h3>
          <BarChart />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-4 text-sm font-medium text-gray-600">
          Live Activity
        </h3>
        <ActivityFeed />
      </div>
    </div>
  );
}
