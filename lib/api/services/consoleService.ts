import axiosInstance from '../../axios/axiosInstance';
import {
  ApiCatalogService,
  ApiLogEntry,
  ApiResponse,
  ConsoleExecuteRequest,
  ConsoleExecuteResult,
  PaginatedResponse,
} from '../../types/console.types';

export const consoleService = {

  getCatalog: async (device: string): Promise<ApiResponse<ApiCatalogService[]>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/console/catalog`);
    return response.data;
  },

  execute: async (
    device: string,
    request: ConsoleExecuteRequest
  ): Promise<ApiResponse<ConsoleExecuteResult>> => {
    const response = await axiosInstance.post(`/api/v1/${device}/console/execute`, request);
    return response.data;
  },

  getLogs: async (
    device: string,
    page: number,
    size: number
  ): Promise<ApiResponse<PaginatedResponse<ApiLogEntry>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/console/logs`, {
      params: { page, size },
    });
    return response.data;
  },

};
