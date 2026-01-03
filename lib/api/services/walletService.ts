// services/wallet.service.ts
import axiosInstance from '../../axios/axiosInstance';
import { 
  CreateWalletDTO,
  WalletDTO,
  WalletSearchParams,
  ApiResponse,
  PaginatedResponse
} from '../../types/wallet.types';

const getHeaders = (userId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (userId) {
    headers['USER-ID'] = userId;
  }
  
  return { headers };
};

export const walletService = {
  // Create a new wallet
  createWallet: async (device: string, userId: string, data: CreateWalletDTO): Promise<ApiResponse<WalletDTO>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/wallets`,
      data,
      getHeaders(userId)
    );
    return response.data;
  },

  // Get wallet by user ID
  getWallet: async (device: string, userId: string): Promise<ApiResponse<WalletDTO>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/wallets/wallet`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Get wallet balance
  getBalance: async (device: string, userId: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/wallets/balance`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Get wallet summary
  getSummary: async (device: string, userId: string): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/wallets/summary`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Credit wallet (Super Admin/Management only)
  creditWallet: async (device: string, userId: string, amount: number): Promise<ApiResponse<WalletDTO>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/wallets/credit`,
      null,
      {
        params: { amount },
        headers: getHeaders(userId).headers
      }
    );
    return response.data;
  },

  // Debit wallet (Super Admin/Management only)
  debitWallet: async (device: string, userId: string, amount: number): Promise<ApiResponse<WalletDTO>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/wallets/debit`,
      null,
      {
        params: { amount },
        headers: getHeaders(userId).headers
      }
    );
    return response.data;
  },

  // Get all wallets with pagination and search
  getAllWallets: async (device: string, params: WalletSearchParams): Promise<ApiResponse<PaginatedResponse<WalletDTO>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/wallets`, {
      params,
      ...getHeaders()
    });
    return response.data;
  },

  // Activate wallet
  activateWallet: async (device: string, walletId: string): Promise<ApiResponse<WalletDTO>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/wallets/${walletId}/activate`
    );
    return response.data;
  },

  // Deactivate wallet
  deactivateWallet: async (device: string, walletId: string): Promise<ApiResponse<WalletDTO>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/wallets/${walletId}/deactivate`
    );
    return response.data;
  },

  // Delete wallet
  deleteWallet: async (device: string, walletId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(
      `/api/v1/${device}/wallets/${walletId}`
    );
    return response.data;
  },

  // Statistics
  getTotalWalletCount: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/wallets/stats/count`
    );
    return response.data;
  },

  getActiveWalletCount: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/wallets/stats/active-count`
    );
    return response.data;
  }
};