// 'use client';

// import StatCard from '@/component/utils/StatCard';
// import DateRangeFilter from '@/component/utils/DateRangeFilter';
// import ActivityFeed from '@/component/dashboards/ActivityFeed';
// import LineChart from '@/component/charts/LineChart';
// import BarChart from '@/component/charts/BarChart';
// import { useAuth } from '../../../lib/hooks/useAuth';

// export default function Dashboard() {
//   const { user } = useAuth();
//   return (
//     <div className="space-y-6 p-6">
      
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Dashboard | {user?.firstName} {user?.lastName}
//         </h1>

//         <DateRangeFilter
//           onExport={() => console.log('Export CSV')}
//           onChange={(range) => console.log(range)}
//         />
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//         <StatCard title="Total Users" value="12,450" />
//         <StatCard title="Active Drivers" value="2,140" />
//         <StatCard title="Active Rides Today" value="320" />
//         <StatCard title="Completed Rides" value="10,980" />
//         <StatCard title="Cancellations" value="210" variant="danger" />
//         <StatCard title="Revenue" value="₦4.2M" variant="success" />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow">
//           <h3 className="mb-4 text-sm font-medium text-gray-600">
//             Ride Volume
//           </h3>
//           <LineChart />
//         </div>

//         <div className="rounded-xl bg-white p-4 shadow">
//           <h3 className="mb-4 text-sm font-medium text-gray-600">
//             Peak Hours
//           </h3>
//           <BarChart />
//         </div>
//       </div>

//       {/* Activity Feed */}
//       <div className="rounded-xl bg-white p-4 shadow">
//         <h3 className="mb-4 text-sm font-medium text-gray-600">
//           Live Activity
//         </h3>
//         <ActivityFeed />
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect } from 'react';
import StatCard from '@/component/utils/StatCard';
import DateRangeFilter from '@/component/utils/DateRangeFilter';
import ActivityFeed from '@/component/dashboards/ActivityFeed';
import LineChart from '@/component/charts/LineChart';
import BarChart from '@/component/charts/BarChart';

import { useAuth } from '../../../lib/hooks/useAuth';
import { useDashboard } from '../../../lib/hooks/useDashboard';
import { dashboardUtils } from '../../../lib/utils/dashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    stats,
    rideVolumeGraph,
    loading,
    currentFilter,
    fetchDashboardData,
    setFilter,
  } = useDashboard();

  // Fetch dashboard data on load & filter change
  useEffect(() => {
    fetchDashboardData('web', currentFilter);
  }, [currentFilter]);

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard | {user?.firstName} {user?.lastName}
        </h1>

        <DateRangeFilter
          onExport={() => console.log('Export CSV')}
          onChange={(filter) =>
            setFilter({
              ...currentFilter,
              ...filter,
            })
          }
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Users"
          value={dashboardUtils.formatNumber(stats?.totalUsers ?? 0)}
        />

        <StatCard
          title="Active Users"
          value={dashboardUtils.formatNumber(stats?.activeUsers ?? 0)}
          variant="success"
        />

        <StatCard
          title="Active Rides"
          value={dashboardUtils.formatNumber(stats?.activeRides ?? 0)}
        />

        <StatCard
          title="Completed Rides"
          value={dashboardUtils.formatNumber(stats?.completedRides ?? 0)}
          variant="success"
        />

        <StatCard
          title="Cancelled Rides"
          value={dashboardUtils.formatNumber(stats?.cancelledRides ?? 0)}
          variant="danger"
        />

        <StatCard
          title="Total Vehicles"
          value={dashboardUtils.formatNumber(stats?.totalVehicles ?? 0)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow">
          <h3 className="mb-4 text-sm font-medium text-gray-600">
            Ride Volume ({dashboardUtils.getPeriodLabel(currentFilter)})
          </h3>

          <LineChart
            data={dashboardUtils.prepareChartData(rideVolumeGraph ?? [])}
            options={dashboardUtils.getChartOptions('Ride Volume')}
            loading={loading}
          />
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

