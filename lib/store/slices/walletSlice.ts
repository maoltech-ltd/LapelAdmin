import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { walletService } from '../../api/services';

interface Transaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, any>;
  createdAt: string;
}

interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'suspended';
  isActive: boolean;
  lastTransactionAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
  recentTransactions?: Transaction[];
}

interface WalletSummary {
  totalBalance: number;
  activeWallets: number;
  inactiveWallets: number;
  totalTransactions: number;
  totalCredits: number;
  totalDebits: number;
}

interface WalletStats {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  suspendedCount: number;
}

interface WalletState {
  wallets: Wallet[];
  currentWallet: Wallet | null;
  walletBalance: number | null;
  walletSummary: WalletSummary | null;
  walletStats: WalletStats | null;
  loading: boolean;
  error: string | null;
  totalWallets: number;
}

const initialState: WalletState = {
  wallets: [],
  currentWallet: null,
  walletBalance: null,
  walletSummary: null,
  walletStats: null,
  loading: false,
  error: null,
  totalWallets: 0,
};

// Async Thunks
export const fetchWallets = createAsyncThunk(
  'wallets/fetchWallets',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await walletService.getWallets(device, params);
    return response.data;
  }
);

export const fetchWalletById = createAsyncThunk(
  'wallets/fetchWalletById',
  async ({ device, walletId }: { device: string; walletId: string }) => {
    const response = await walletService.getWallet(device, walletId);
    return response.data;
  }
);

export const createWallet = createAsyncThunk(
  'wallets/createWallet',
  async ({ device, data }: { device: string; data: any }) => {
    const response = await walletService.createWallet(device, data);
    return response.data;
  }
);

export const debitWallet = createAsyncThunk(
  'wallets/debitWallet',
  async ({ device, data }: { device: string; data: any }) => {
    const response = await walletService.debitWallet(device, data);
    return response.data;
  }
);

export const creditWallet = createAsyncThunk(
  'wallets/creditWallet',
  async ({ device, data }: { device: string; data: any }) => {
    const response = await walletService.creditWallet(device, data);
    return response.data;
  }
);

export const fetchWalletSummary = createAsyncThunk(
  'wallets/fetchSummary',
  async (device: string) => {
    const response = await walletService.getWalletSummary(device);
    return response.data;
  }
);

export const fetchWalletBalance = createAsyncThunk(
  'wallets/fetchBalance',
  async (device: string) => {
    const response = await walletService.getWalletBalance(device);
    return response.data;
  }
);

export const fetchWalletStats = createAsyncThunk(
  'wallets/fetchStats',
  async (device: string) => {
    const [countResponse, activeResponse] = await Promise.all([
      walletService.getWalletStatsCount(device),
      walletService.getActiveWalletCount(device),
    ]);
    
    return {
      totalCount: countResponse.data.count || countResponse.data.total,
      activeCount: activeResponse.data.count || activeResponse.data.active,
    };
  }
);

export const activateWallet = createAsyncThunk(
  'wallets/activateWallet',
  async ({ device, walletId }: { device: string; walletId: string }) => {
    const response = await walletService.activateWallet(device, walletId);
    return response.data;
  }
);

export const deactivateWallet = createAsyncThunk(
  'wallets/deactivateWallet',
  async ({ device, walletId }: { device: string; walletId: string }) => {
    const response = await walletService.deactivateWallet(device, walletId);
    return response.data;
  }
);

export const deleteWallet = createAsyncThunk(
  'wallets/deleteWallet',
  async ({ device, walletId }: { device: string; walletId: string }) => {
    const response = await walletService.deleteWallet(device, walletId);
    return { walletId, ...response.data };
  }
);

// Slice
const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    clearWallets: (state) => {
      state.wallets = [];
      state.totalWallets = 0;
    },
    setCurrentWallet: (state, action: PayloadAction<Wallet>) => {
      state.currentWallet = action.payload;
    },
    clearCurrentWallet: (state) => {
      state.currentWallet = null;
    },
    clearWalletData: (state) => {
      state.walletBalance = null;
      state.walletSummary = null;
      state.walletStats = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateWalletBalance: (state, action: PayloadAction<{ walletId: string; balance: number }>) => {
      const { walletId, balance } = action.payload;
      
      // Update in wallets array
      state.wallets = state.wallets.map(wallet =>
        wallet.id === walletId ? { ...wallet, balance } : wallet
      );
      
      // Update current wallet if it's the same
      if (state.currentWallet?.id === walletId) {
        state.currentWallet = { ...state.currentWallet, balance };
      }
      
      // Update wallet balance if it's for the current user
      if (state.currentWallet?.id === walletId) {
        state.walletBalance = balance;
      }
    },
    addTransaction: (state, action: PayloadAction<{ walletId: string; transaction: Transaction }>) => {
      const { walletId, transaction } = action.payload;
      
      // Find the wallet and add transaction
      state.wallets = state.wallets.map(wallet => {
        if (wallet.id === walletId) {
          const recentTransactions = wallet.recentTransactions || [];
          return {
            ...wallet,
            balance: transaction.type === 'credit' 
              ? wallet.balance + transaction.amount 
              : wallet.balance - transaction.amount,
            recentTransactions: [transaction, ...recentTransactions.slice(0, 9)],
          };
        }
        return wallet;
      });
      
      // Update current wallet if it's the same
      if (state.currentWallet?.id === walletId) {
        const recentTransactions = state.currentWallet.recentTransactions || [];
        state.currentWallet = {
          ...state.currentWallet,
          balance: transaction.type === 'credit' 
            ? state.currentWallet.balance + transaction.amount 
            : state.currentWallet.balance - transaction.amount,
          recentTransactions: [transaction, ...recentTransactions.slice(0, 9)],
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wallets
      .addCase(fetchWallets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets = action.payload.wallets || action.payload.data || action.payload;
        state.totalWallets = action.payload.total || action.payload.count || state.wallets.length;
      })
      .addCase(fetchWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wallets';
      })
      // Fetch wallet by ID
      .addCase(fetchWalletById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWalletById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWallet = action.payload;
      })
      .addCase(fetchWalletById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wallet';
      })
      // Create wallet
      .addCase(createWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets.push(action.payload);
        state.totalWallets += 1;
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create wallet';
      })
      // Debit wallet
      .addCase(debitWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(debitWallet.fulfilled, (state, action) => {
        state.loading = false;
        const { wallet, transaction } = action.payload;
        
        // Update wallet balance
        state.wallets = state.wallets.map(w =>
          w.id === wallet.id ? { ...w, balance: wallet.balance } : w
        );
        
        // Update current wallet
        if (state.currentWallet?.id === wallet.id) {
          state.currentWallet = state.currentWallet;
        }
        
        // Add transaction to current wallet
        // if (state.currentWallet?.id === wallet.id) {
        //   const recentTransactions = state.currentWallet.recentTransactions || [];
        //   state.currentWallet.recentTransactions = [transaction, ...recentTransactions.slice(0, 9)];
        // }
      })
      .addCase(debitWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to debit wallet';
      })
      // Credit wallet
      .addCase(creditWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(creditWallet.fulfilled, (state, action) => {
        state.loading = false;
        const { wallet, transaction } = action.payload;
        
        // Update wallet balance
        state.wallets = state.wallets.map(w =>
          w.id === wallet.id ? { ...w, balance: wallet.balance } : w
        );
        
        // Update current wallet
        if (state.currentWallet?.id === wallet.id) {
          state.currentWallet = state.currentWallet;
        }
        
        // Add transaction to current wallet
        // if (state.currentWallet?.id === wallet.id) {
        //   const recentTransactions = state.currentWallet.recentTransactions || [];
        //   state.currentWallet.recentTransactions = [transaction, ...recentTransactions.slice(0, 9)];
        // }
      })
      .addCase(creditWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to credit wallet';
      })
      // Fetch wallet summary
      .addCase(fetchWalletSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWalletSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.walletSummary = action.payload;
      })
      .addCase(fetchWalletSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wallet summary';
      })
      // Fetch wallet balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.walletBalance = action.payload.balance || action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wallet balance';
      })
      // Fetch wallet stats
      .addCase(fetchWalletStats.fulfilled, (state, action) => {
        state.walletStats = {
          totalCount: action.payload.totalCount,
          activeCount: action.payload.activeCount,
          inactiveCount: action.payload.totalCount - action.payload.activeCount,
          suspendedCount: 0, // You might need to fetch this separately
        };
      })
      // Activate wallet
      .addCase(activateWallet.fulfilled, (state, action) => {
        const updatedWallet = action.payload;
        
        // Update in wallets array
        state.wallets = state.wallets.map(wallet =>
          wallet.id === updatedWallet.id ? updatedWallet : wallet
        );
        
        // Update current wallet
        if (state.currentWallet?.id === updatedWallet.id) {
          state.currentWallet = updatedWallet;
        }
        
        // Update stats
        if (state.walletStats) {
          state.walletStats.activeCount += 1;
          state.walletStats.inactiveCount = Math.max(0, state.walletStats.inactiveCount - 1);
        }
      })
      // Deactivate wallet
      .addCase(deactivateWallet.fulfilled, (state, action) => {
        const updatedWallet = action.payload;
        
        // Update in wallets array
        state.wallets = state.wallets.map(wallet =>
          wallet.id === updatedWallet.id ? updatedWallet : wallet
        );
        
        // Update current wallet
        if (state.currentWallet?.id === updatedWallet.id) {
          state.currentWallet = updatedWallet;
        }
        
        // Update stats
        if (state.walletStats) {
          state.walletStats.activeCount = Math.max(0, state.walletStats.activeCount - 1);
          state.walletStats.inactiveCount += 1;
        }
      })
      // Delete wallet
      .addCase(deleteWallet.fulfilled, (state, action) => {
        state.wallets = state.wallets.filter(wallet => wallet.id !== action.payload.walletId);
        state.totalWallets -= 1;
        
        // Update stats
        if (state.walletStats) {
          state.walletStats.totalCount -= 1;
          // You might need to adjust active/inactive counts based on the deleted wallet's status
        }
      });
  },
});

export const {
  clearWallets,
  setCurrentWallet,
  clearCurrentWallet,
  clearWalletData,
  clearError,
  updateWalletBalance,
  addTransaction,
} = walletSlice.actions;

export default walletSlice.reducer;