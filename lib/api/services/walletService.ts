import axiosInstance from "../../axios/axiosInstance";

interface WalletData {
  // Define wallet data structure
  userId: string;
  currency: string;
  initialBalance?: number;


}

export const walletService = {
  getWallets: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/wallets`, { params }),

  getWallet: (device: string, walletId: string) =>
    axiosInstance.get(`/api/v1/${device}/wallets/wallet`, {
      params: { walletId },
    }),

  createWallet: (device: string, data: WalletData) =>
    axiosInstance.post(`/api/v1/${device}/wallets`, data),

  debitWallet: (device: string, data: any) =>
    axiosInstance.post(`/api/v1/${device}/wallets/debit`, data),

  creditWallet: (device: string, data: any) =>
    axiosInstance.post(`/api/v1/${device}/wallets/credit`, data),

  getWalletSummary: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/wallets/summary`),

  getWalletBalance: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/wallets/balance`),

  getWalletStatsCount: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/wallets/stats/count`),

  getActiveWalletCount: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/wallets/stats/active-count`),

  activateWallet: (device: string, walletId: string) =>
    axiosInstance.patch(`/api/v1/${device}/wallets/${walletId}/activate`, {}),

  deactivateWallet: (device: string, walletId: string) =>
    axiosInstance.patch(`/api/v1/${device}/wallets/${walletId}/deactivate`, {}),

  deleteWallet: (device: string, walletId: string) =>
    axiosInstance.delete(`/api/v1/${device}/wallets/${walletId}`),
};