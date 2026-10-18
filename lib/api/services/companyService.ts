// services/company.service.ts
import axiosInstance from '../../axios/axiosInstance';
import {
  ApiResponse,
  CompanyDiscountRequest,
  CompanyDto,
  CompanyInviteDto,
  CompanyMemberDto,
  CompanyRideDto,
  CompanySearchParams,
  CompanyStatusActionRequest,
  CompanyStatusCounts,
  PaginatedResponse,
} from '../../types/company.types';

export type CompanyStatusAction = 'approve' | 'reject' | 'suspend' | 'reactivate';

export const companyService = {
  getAllCompanies: async (
    device: string,
    params: CompanySearchParams,
  ): Promise<ApiResponse<PaginatedResponse<CompanyDto>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/companies`, { params });
    return response.data;
  },

  getStatusCounts: async (device: string): Promise<ApiResponse<CompanyStatusCounts>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/companies/stats/status`);
    return response.data;
  },

  getCompany: async (device: string, companyId: string): Promise<ApiResponse<CompanyDto>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/companies/${companyId}`);
    return response.data;
  },

  getMembers: async (device: string, companyId: string): Promise<ApiResponse<CompanyMemberDto[]>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/companies/${companyId}/members`);
    return response.data;
  },

  getInvites: async (device: string, companyId: string): Promise<ApiResponse<CompanyInviteDto[]>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/companies/${companyId}/invites`);
    return response.data;
  },

  getRides: async (
    device: string,
    companyId: string,
    params: { page?: number; size?: number },
  ): Promise<ApiResponse<PaginatedResponse<CompanyRideDto>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/companies/${companyId}/rides`, { params });
    return response.data;
  },

  // approve / reject / suspend / reactivate. reason is required for reject and suspend.
  changeStatus: async (
    device: string,
    companyId: string,
    action: CompanyStatusAction,
    request: CompanyStatusActionRequest = {},
  ): Promise<ApiResponse<CompanyDto>> => {
    const response = await axiosInstance.post(`/api/v1/${device}/companies/${companyId}/${action}`, request);
    return response.data;
  },

  updateDiscount: async (
    device: string,
    companyId: string,
    request: CompanyDiscountRequest,
  ): Promise<ApiResponse<CompanyDto>> => {
    const response = await axiosInstance.put(`/api/v1/${device}/companies/${companyId}/discount`, request);
    return response.data;
  },
};
