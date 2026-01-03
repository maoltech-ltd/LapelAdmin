// slices/wallet.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  CreateWalletDTO,
  WalletDTO,
  WalletSearchParams,
  ApiResponse,
  PaginatedResponse 
} from '../../types/wallet.types';
import { walletService } from '../../api/services';

interface WalletState {
  wallets: PaginatedResponse<WalletDTO> | null;
  currentWallet: WalletDTO | null;
  stats: {
    totalWallets: number | null;
    activeWallets: number | null;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: WalletState = {
  wallets: null,
  currentWallet: null,
  stats: {
    totalWallets: null,
    activeWallets: null,
  },
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const createWallet = createAsyncThunk(
  'wallet/createWallet',
  async ({ device, userId, data }: { device: string; userId: string; data: CreateWalletDTO }) => {
    return await walletService.createWallet(device, userId, data);
  }
);

export const getWallet = createAsyncThunk(
  'wallet/getWallet',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await walletService.getWallet(device, userId);
  }
);

export const getBalance = createAsyncThunk(
  'wallet/getBalance',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await walletService.getBalance(device, userId);
  }
);

export const getSummary = createAsyncThunk(
  'wallet/getSummary',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await walletService.getSummary(device, userId);
  }
);

export const creditWallet = createAsyncThunk(
  'wallet/creditWallet',
  async ({ device, userId, amount }: { device: string; userId: string; amount: number }) => {
    return await walletService.creditWallet(device, userId, amount);
  }
);

export const debitWallet = createAsyncThunk(
  'wallet/debitWallet',
  async ({ device, userId, amount }: { device: string; userId: string; amount: number }) => {
    return await walletService.debitWallet(device, userId, amount);
  }
);

export const getAllWallets = createAsyncThunk(
  'wallet/getAllWallets',
  async ({ device, params }: { device: string; params: WalletSearchParams }) => {
    return await walletService.getAllWallets(device, params);
  }
);

export const activateWallet = createAsyncThunk(
  'wallet/activateWallet',
  async ({ device, walletId }: { device: string; walletId: string }) => {
    return await walletService.activateWallet(device, walletId);
  }
);

export const deactivateWallet = createAsyncThunk(
  'wallet/deactivateWallet',
  async ({ device, walletId }: { device: string; walletId: string }) => {
    return await walletService.deactivateWallet(device, walletId);
  }
);

export const deleteWallet = createAsyncThunk(
  'wallet/deleteWallet',
  async ({ device, walletId }: { device: string; walletId: string }) => {
    return await walletService.deleteWallet(device, walletId);
  }
);

export const getTotalWalletCount = createAsyncThunk(
  'wallet/getTotalWalletCount',
  async (device: string) => {
    return await walletService.getTotalWalletCount(device);
  }
);

export const getActiveWalletCount = createAsyncThunk(
  'wallet/getActiveWalletCount',
  async (device: string) => {
    return await walletService.getActiveWalletCount(device);
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentWallet: (state, action: PayloadAction<WalletDTO | null>) => {
      state.currentWallet = action.payload;
    },
    updateWalletInList: (state, action: PayloadAction<WalletDTO>) => {
      if (state.wallets && state.wallets.content) {
        const index = state.wallets.content.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.wallets.content[index] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Wallet
      .addCase(createWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWallet = action.payload.data;
        state.success = true;
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create wallet';
      })
      
      // Get Wallet
      .addCase(getWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWallet = action.payload.data;
        state.success = true;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get wallet';
      })
      
      // Get Balance
      .addCase(getBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentWallet) {
          state.currentWallet.balance = action.payload.data;
        }
        state.success = true;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get balance';
      })
      
      // Get Summary
      .addCase(getSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSummary.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get wallet summary';
      })
      
      // Credit Wallet
      .addCase(creditWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(creditWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWallet = action.payload.data;
        state.success = true;
      })
      .addCase(creditWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to credit wallet';
      })
      
      // Debit Wallet
      .addCase(debitWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(debitWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWallet = action.payload.data;
        state.success = true;
      })
      .addCase(debitWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to debit wallet';
      })
      
      // Get All Wallets
      .addCase(getAllWallets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWallets.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets = action.payload.data;
        state.success = true;
      })
      .addCase(getAllWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get wallets';
      })
      
      // Activate Wallet
      .addCase(activateWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateWallet.fulfilled, (state, action) => {
        state.loading = false;
        // Update wallet in list if exists
        if (state.wallets && state.wallets.content) {
          const index = state.wallets.content.findIndex(w => w.id === action.payload.data.id);
          if (index !== -1) {
            state.wallets.content[index] = action.payload.data;
          }
        }
        state.success = true;
      })
      .addCase(activateWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to activate wallet';
      })
      
      // Deactivate Wallet
      .addCase(deactivateWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateWallet.fulfilled, (state, action) => {
        state.loading = false;
        // Update wallet in list if exists
        if (state.wallets && state.wallets.content) {
          const index = state.wallets.content.findIndex(w => w.id === action.payload.data.id);
          if (index !== -1) {
            state.wallets.content[index] = action.payload.data;
          }
        }
        state.success = true;
      })
      .addCase(deactivateWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to deactivate wallet';
      })
      
      // Delete Wallet
      .addCase(deleteWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWallet.fulfilled, (state) => {
        state.loading = false;
        state.currentWallet = null;
        state.success = true;
      })
      .addCase(deleteWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete wallet';
      })
      
      // Get Total Wallet Count
      .addCase(getTotalWalletCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalWalletCount.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.totalWallets = action.payload.data;
        state.success = true;
      })
      .addCase(getTotalWalletCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get total wallet count';
      })
      
      // Get Active Wallet Count
      .addCase(getActiveWalletCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveWalletCount.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.activeWallets = action.payload.data;
        state.success = true;
      })
      .addCase(getActiveWalletCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get active wallet count';
      });
  },
});

export const { clearError, clearSuccess, setCurrentWallet, updateWalletInList } = walletSlice.actions;
export default walletSlice.reducer;