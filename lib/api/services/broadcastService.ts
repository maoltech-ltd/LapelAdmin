import axiosInstance from '../../axios/axiosInstance';
import {
  AdminBroadcast,
  BroadcastApiResponse,
  BroadcastAudiencePreview,
  BroadcastAudienceRequest,
  BroadcastPage,
  BroadcastStatus,
  CreateBroadcastRequest,
} from '../../types/broadcast.types';

export const broadcastService = {
  previewAudience: async (
    device: string,
    audience: BroadcastAudienceRequest,
  ): Promise<BroadcastApiResponse<BroadcastAudiencePreview>> => {
    const response = await axiosInstance.post(`/api/v1/${device}/admin/broadcasts/audience-preview`, audience);
    return response.data;
  },

  create: async (device: string, request: CreateBroadcastRequest): Promise<BroadcastApiResponse<AdminBroadcast>> => {
    const response = await axiosInstance.post(`/api/v1/${device}/admin/broadcasts`, request);
    return response.data;
  },

  list: async (
    device: string,
    params: { page: number; size: number; status?: BroadcastStatus },
  ): Promise<BroadcastApiResponse<BroadcastPage>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/broadcasts`, { params });
    return response.data;
  },

  get: async (device: string, id: string): Promise<BroadcastApiResponse<AdminBroadcast>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/broadcasts/${encodeURIComponent(id)}`);
    return response.data;
  },

  cancel: async (device: string, id: string): Promise<BroadcastApiResponse<AdminBroadcast>> => {
    const response = await axiosInstance.post(`/api/v1/${device}/admin/broadcasts/${encodeURIComponent(id)}/cancel`);
    return response.data;
  },
};
