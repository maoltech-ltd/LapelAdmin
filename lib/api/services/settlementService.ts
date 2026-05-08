import axiosInstance from '../../axios/axiosInstance';

export interface WalletSettlement {
  id: number;
  transactionId: string;
  userId: string;
  amount: number;
  type: string;
  createdAt: string;
}

export const settlementService = {
  getSettlements: async (device: string, params?: { page?: number; size?: number }) => {
    const response = await axiosInstance.get(`/api/v1/${device}/settlements`, { params });
    return response.data;
  },
};
