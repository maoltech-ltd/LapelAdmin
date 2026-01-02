import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchWallets,
  fetchWalletById,
  createWallet,
  debitWallet,
  creditWallet,
  fetchWalletSummary,
  fetchWalletBalance,
  fetchWalletStats,
  activateWallet,
  deactivateWallet,
  deleteWallet,
  clearWallets,
  setCurrentWallet,
  clearCurrentWallet,
  clearWalletData,
  updateWalletBalance,
  addTransaction,
} from '../store/slices/walletSlice';

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const {
    wallets,
    currentWallet,
    walletBalance,
    walletSummary,
    walletStats,
    loading,
    error,
    totalWallets,
  } = useAppSelector((state) => state.wallets);

  const getWallets = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchWallets({ device, params }));
    },
    [dispatch]
  );

  const getWallet = useCallback(
    async (device: string, walletId: string) => {
      return dispatch(fetchWalletById({ device, walletId }));
    },
    [dispatch]
  );

  const create = useCallback(
    async (device: string, data: any) => {
      return dispatch(createWallet({ device, data }));
    },
    [dispatch]
  );

  const debit = useCallback(
    async (device: string, data: any) => {
      return dispatch(debitWallet({ device, data }));
    },
    [dispatch]
  );

  const credit = useCallback(
    async (device: string, data: any) => {
      return dispatch(creditWallet({ device, data }));
    },
    [dispatch]
  );

  const getSummary = useCallback(
    async (device: string) => {
      return dispatch(fetchWalletSummary(device));
    },
    [dispatch]
  );

  const getBalance = useCallback(
    async (device: string) => {
      return dispatch(fetchWalletBalance(device));
    },
    [dispatch]
  );

  const getStats = useCallback(
    async (device: string) => {
      return dispatch(fetchWalletStats(device));
    },
    [dispatch]
  );

  const activate = useCallback(
    async (device: string, walletId: string) => {
      return dispatch(activateWallet({ device, walletId }));
    },
    [dispatch]
  );

  const deactivate = useCallback(
    async (device: string, walletId: string) => {
      return dispatch(deactivateWallet({ device, walletId }));
    },
    [dispatch]
  );

  const remove = useCallback(
    async (device: string, walletId: string) => {
      return dispatch(deleteWallet({ device, walletId }));
    },
    [dispatch]
  );

  const clearAllWallets = useCallback(() => {
    dispatch(clearWallets());
  }, [dispatch]);

  const setWallet = useCallback(
    (wallet: any) => {
      dispatch(setCurrentWallet(wallet));
    },
    [dispatch]
  );

  const clearWallet = useCallback(() => {
    dispatch(clearCurrentWallet());
  }, [dispatch]);

  const clearData = useCallback(() => {
    dispatch(clearWalletData());
  }, [dispatch]);

  const updateBalance = useCallback(
    (walletId: string, balance: number) => {
      dispatch(updateWalletBalance({ walletId, balance }));
    },
    [dispatch]
  );

  const addNewTransaction = useCallback(
    (walletId: string, transaction: any) => {
      dispatch(addTransaction({ walletId, transaction }));
    },
    [dispatch]
  );

  return {
    // State
    wallets,
    currentWallet,
    walletBalance,
    walletSummary,
    walletStats,
    loading,
    error,
    totalWallets,

    // Actions
    getWallets,
    getWallet,
    createWallet: create,
    debitWallet: debit,
    creditWallet: credit,
    getWalletSummary: getSummary,
    getWalletBalance: getBalance,
    getWalletStats: getStats,
    activateWallet: activate,
    deactivateWallet: deactivate,
    deleteWallet: remove,
    clearWallets: clearAllWallets,
    setCurrentWallet: setWallet,
    clearCurrentWallet: clearWallet,
    clearWalletData: clearData,
    updateWalletBalance: updateBalance,
    addTransaction: addNewTransaction,
  };
};