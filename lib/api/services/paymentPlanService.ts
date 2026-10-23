// services/paymentPlan.service.ts
import axiosInstance from '../../axios/axiosInstance';
import {
  RidePaymentPlanDto,
  RidePaymentPlanSearchParams,
  PlanStatus,
  ApiResponse,
  PaginatedResponse,
} from '../../types/paymentPlan.types';

export const paymentPlanService = {
  getAllPlans: async (
    device: string,
    params: RidePaymentPlanSearchParams,
  ): Promise<ApiResponse<PaginatedResponse<RidePaymentPlanDto>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/ride-payment-plans`, { params });
    return response.data;
  },

  getPlanById: async (device: string, planId: string): Promise<ApiResponse<RidePaymentPlanDto>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/ride-payment-plans/${planId}`);
    return response.data;
  },

  getTotalPlans: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/ride-payment-plans/stats/total`);
    return response.data;
  },

  getPlansByStatus: async (device: string, status: PlanStatus): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/ride-payment-plans/stats/status`, {
      params: { status },
    });
    return response.data;
  },
};
