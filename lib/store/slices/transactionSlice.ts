import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { transactionService } from '../../api/services';
import { PaginatedResponse, Transaction } from '../../types/transaction.type';


interface TransactionState {
  transactions: PaginatedResponse<Transaction> | null;
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null | undefined;
  success: boolean;
}


const initialState: TransactionState = {
  transactions: null,
  currentTransaction: null,
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

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: initialState,
  reducers: {
    clearTransaction: (state) => {
      state.currentTransaction = null;
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
      });

  }
});

export const {
  clearTransaction,
  clearError
} = transactionSlice.actions;

export default transactionSlice.reducer;
