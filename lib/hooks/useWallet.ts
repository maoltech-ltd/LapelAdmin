// hooks/useWallet.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  createWallet,
  getWallet,
  getBalance,
  getSummary,
  creditWallet,
  debitWallet,
  getAllWallets,
  activateWallet,
  deactivateWallet,
  deleteWallet,
  getTotalWalletCount,
  getActiveWalletCount,
  clearError,
  clearSuccess
} from '../store/slices/walletSlice';
import { CreateWalletDTO, WalletSearchParams } from '../types/wallet.types';

export const useWallet = () => {
  const dispatch = useDispatch();
  const { 
    wallets, 
    currentWallet, 
    stats, 
    loading, 
    error, 
    success 
  } = useSelector((state: RootState) => state.wallets);

  return {
    // State
    wallets,
    currentWallet,
    stats,
    loading,
    error,
    success,
    
    // Actions
    createWallet: (device: string, userId: string, data: CreateWalletDTO) => 
      dispatch(createWallet({ device, userId, data }) as any),
    
    getWallet: (device: string, userId: string) => 
      dispatch(getWallet({ device, userId }) as any),
    
    getBalance: (device: string, userId: string) => 
      dispatch(getBalance({ device, userId }) as any),
    
    getSummary: (device: string, userId: string) => 
      dispatch(getSummary({ device, userId }) as any),
    
    creditWallet: (device: string, userId: string, amount: number) => 
      dispatch(creditWallet({ device, userId, amount }) as any),
    
    debitWallet: (device: string, userId: string, amount: number) => 
      dispatch(debitWallet({ device, userId, amount }) as any),
    
    getAllWallets: (device: string, params: WalletSearchParams) => 
      dispatch(getAllWallets({ device, params }) as any),
    
    activateWallet: (device: string, walletId: string) => 
      dispatch(activateWallet({ device, walletId }) as any),
    
    deactivateWallet: (device: string, walletId: string) => 
      dispatch(deactivateWallet({ device, walletId }) as any),
    
    deleteWallet: (device: string, walletId: string) => 
      dispatch(deleteWallet({ device, walletId }) as any),
    
    getTotalWalletCount: (device: string) => 
      dispatch(getTotalWalletCount(device) as any),
    
    getActiveWalletCount: (device: string) => 
      dispatch(getActiveWalletCount(device) as any),
    
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };
};