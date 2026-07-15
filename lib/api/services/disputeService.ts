// services/dispute.service.ts
// Disputes aren't a separate entity in the backend — they're orders in
// OrderStatus.DISPUTED — so this mirrors orderService's request shape and
// only adds the resolve action.
import axiosInstance from '../../axios/axiosInstance';
import {
  ApiResponse,
  DisputeResolutionRequest,
  OrderDto,
  OrderSearchParams,
  PaginatedResponse,
} from '../../types/order.types';

export const disputeService = {
  getAllDisputes: async (
    device: string,
    params: Omit<OrderSearchParams, 'status'>,
  ): Promise<ApiResponse<PaginatedResponse<OrderDto>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/disputes`, { params });
    return response.data;
  },

  getDispute: async (device: string, orderId: string): Promise<ApiResponse<OrderDto>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/disputes/${orderId}`);
    return response.data;
  },

  resolveDispute: async (
    device: string,
    orderId: string,
    request: DisputeResolutionRequest,
  ): Promise<ApiResponse<OrderDto>> => {
    const response = await axiosInstance.post(`/api/v1/${device}/disputes/${orderId}/resolve`, request);
    return response.data;
  },
};
