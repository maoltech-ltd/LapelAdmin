import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { transactionService } from '../../api/services';
import { PaginatedResponse, Transaction, TransactionVerifyResult } from '../../types/transaction.type';


interface TransactionState {
  transactions: PaginatedResponse<Transaction> | null;
  currentTransaction: Transaction | null;
  verifyResult: TransactionVerifyResult | null;
  verifying: boolean;
  loading: boolean;
  error: string | null | undefined;
  success: boolean;
}


const initialState: TransactionState = {
  transactions: null,
  currentTransaction: null,
  verifyResult: null,
  verifying: false,
  loading: false,
  error: null,
  success: false
};


export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async ({ device, params }: any) => {
    return await transactionService.getTransactions(device, params);
  }
);

export const fetchTransactionByRef = createAsyncThunk(
  'transactions/fetchOne',
  async ({ device, reference }: any) => {
    return await transactionService.getTransactionByReference(device, reference);
  }
);

export const retryTransaction = createAsyncThunk(
  'transactions/retry',
  async ({ device, reference }: any) => {
    return await transactionService.retryTransaction(device, reference);
  }
);

export const flagTransaction = createAsyncThunk(
  'transactions/flag',
  async ({ device, reference }: any) => {
    return await transactionService.flagTransaction(device, reference);
  }
);

export const verifyTransaction = createAsyncThunk(
  'transactions/verify',
  async ({ device, reference, force }: any) => {
    return await transactionService.verifyTransaction(device, reference, force);
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: initialState,
  reducers: {
    clearTransaction: (state) => {
      state.currentTransaction = null;
      state.verifyResult = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {

    builder

      // Fetch All
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })

      // Fetch One
      .addCase(fetchTransactionByRef.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionByRef.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload.data;
      })
      .addCase(fetchTransactionByRef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
      .addCase(retryTransaction.fulfilled, (state, action) => {
        if (!state.transactions) return;
        const index = state.transactions.content.findIndex(
          (tx) => tx.reference === action.payload.data.reference
        );
        if (index !== -1) state.transactions.content[index] = action.payload.data;
      })
      .addCase(flagTransaction.fulfilled, (state, action) => {
        if (!state.transactions) return;
        const index = state.transactions.content.findIndex(
          (tx) => tx.reference === action.payload.data.reference
        );
        if (index !== -1) state.transactions.content[index] = action.payload.data;
      })

      // Verify against payment provider
      .addCase(verifyTransaction.pending, (state) => {
        state.verifying = true;
      })
      .addCase(verifyTransaction.fulfilled, (state, action) => {
        state.verifying = false;
        state.verifyResult = action.payload.data;
        state.currentTransaction = action.payload.data.transaction;
        if (state.transactions) {
          const index = state.transactions.content.findIndex(
            (tx) => tx.reference === action.payload.data.transaction.reference
          );
          if (index !== -1) state.transactions.content[index] = action.payload.data.transaction;
        }
      })
      .addCase(verifyTransaction.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.error?.message;
      });

  }
});

export const {
  clearTransaction,
  clearError
} = transactionSlice.actions;

export default transactionSlice.reducer;
