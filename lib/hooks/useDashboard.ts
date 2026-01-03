// hooks/useDashboard.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  fetchDashboardStats,
  fetchRideVolumeGraph,
  fetchDashboardData,
  setFilter,
  resetFilter,
  clearDashboardData,
  clearError,
  clearSuccess
} from '../store/slices/dashboardSlice';
import { DashboardFilter } from '../types/dashboard.types';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const { 
    stats, 
    rideVolumeGraph, 
    loading, 
    error, 
    success, 
    currentFilter 
  } = useSelector((state: RootState) => state.dashboard);

  return {
    // State
    stats,
    rideVolumeGraph,
    loading,
    error,
    success,
    currentFilter,
    
    // Actions
    fetchDashboardStats: (device: string, filter: DashboardFilter) => 
      dispatch(fetchDashboardStats({ device, filter }) as any),
    
    fetchRideVolumeGraph: (device: string, filter: DashboardFilter) => 
      dispatch(fetchRideVolumeGraph({ device, filter }) as any),
    
    fetchDashboardData: (device: string, filter: DashboardFilter) => 
      dispatch(fetchDashboardData({ device, filter }) as any),
    
    setFilter: (filter: DashboardFilter) => dispatch(setFilter(filter)),
    resetFilter: () => dispatch(resetFilter()),
    clearDashboardData: () => dispatch(clearDashboardData()),
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };
};