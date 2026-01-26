import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTransactions,
  fetchTransactionByRef,
  clearTransaction,
  clearError
} from '../store/slices/transactionSlice';
import { RootState } from '../store/store';

export const useTransaction = () => {

  const dispatch = useDispatch();

  const {
    transactions,
    currentTransaction,
    loading,
    error
  } = useSelector((state: RootState) => state.transactions);

  return {

    // State
    transactions,
    currentTransaction,
    loading,
    error,

    // Actions
    getTransactions: (device: string, params: any) =>
      dispatch(fetchTransactions({ device, params }) as any),

    getTransactionByReference: (device: string, reference: string) =>
      dispatch(fetchTransactionByRef({ device, reference }) as any),

    clearTransaction: () => dispatch(clearTransaction()),

    clearError: () => dispatch(clearError())
  };
};
