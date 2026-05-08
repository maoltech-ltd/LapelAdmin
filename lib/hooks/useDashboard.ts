// hooks/useDashboard.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '../store/store';
import { 
  fetchDashboardStats,
  fetchRideVolumeGraph,
  fetchDashboardData,
  fetchAdvancedStats,
  fetchEntityStats,
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
    advancedStats,
    entityStats,
    rideVolumeGraph, 
    loading, 
    error, 
    success, 
    currentFilter 
  } = useSelector((state: RootState) => state.dashboard);

  const fetchStats = useCallback((device: string, filter: DashboardFilter) =>
    dispatch(fetchDashboardStats({ device, filter }) as any), [dispatch]);
  const fetchGraph = useCallback((device: string, filter: DashboardFilter) =>
    dispatch(fetchRideVolumeGraph({ device, filter }) as any), [dispatch]);
  const fetchAllDashboardData = useCallback((device: string, filter: DashboardFilter) =>
    dispatch(fetchDashboardData({ device, filter }) as any), [dispatch]);
  const fetchAllStats = useCallback((device: string, filter: DashboardFilter) =>
    dispatch(fetchAdvancedStats({ device, filter }) as any), [dispatch]);
  const fetchStatsForEntity = useCallback((
    device: string,
    entityType: 'USER' | 'RIDER' | 'VEHICLE',
    entityId: string,
    filter: DashboardFilter
  ) => dispatch(fetchEntityStats({ device, entityType, entityId, filter }) as any), [dispatch]);
  const updateFilter = useCallback((filter: DashboardFilter) => dispatch(setFilter(filter)), [dispatch]);
  const resetCurrentFilter = useCallback(() => dispatch(resetFilter()), [dispatch]);
  const clearData = useCallback(() => dispatch(clearDashboardData()), [dispatch]);
  const clearDashboardError = useCallback(() => dispatch(clearError()), [dispatch]);
  const clearDashboardSuccess = useCallback(() => dispatch(clearSuccess()), [dispatch]);

  return {
    // State
    stats,
    advancedStats,
    entityStats,
    rideVolumeGraph,
    loading,
    error,
    success,
    currentFilter,
    
    // Actions
    fetchDashboardStats: fetchStats,
    fetchRideVolumeGraph: fetchGraph,
    fetchDashboardData: fetchAllDashboardData,
    fetchAdvancedStats: fetchAllStats,
    fetchEntityStats: fetchStatsForEntity,
    setFilter: updateFilter,
    resetFilter: resetCurrentFilter,
    clearDashboardData: clearData,
    clearError: clearDashboardError,
    clearSuccess: clearDashboardSuccess,
  };
};
