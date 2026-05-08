// services/dashboard.service.ts
import axiosInstance from '../../axios/axiosInstance';
import { 
  DashboardFilter,
  DashboardStats,
  AdvancedStats,
  RideVolumeData,
  StatsEntityType,
  ApiResponse 
} from '../../types/dashboard.types';

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (device: string, filter: DashboardFilter): Promise<ApiResponse<DashboardStats>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/dashboards/stats`, {
      params: filter
    });
    return response.data;
  },

  // Get ride volume graph data
  getRideVolumeGraph: async (device: string, filter: DashboardFilter): Promise<ApiResponse<RideVolumeData[]>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/dashboards/ride-volume-graph`, {
      params: filter
    });
    return response.data;
  },

  getAdvancedStats: async (device: string, filter: DashboardFilter): Promise<ApiResponse<AdvancedStats>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/dashboards/advanced-stats`, {
      params: filter
    });
    return response.data;
  },

  getEntityStats: async (
    device: string,
    entityType: StatsEntityType,
    entityId: string,
    filter: DashboardFilter
  ): Promise<ApiResponse<AdvancedStats>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/dashboards/entity-stats`, {
      params: { ...filter, entityType, entityId }
    });
    return response.data;
  }
};
