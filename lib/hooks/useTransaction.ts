import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchTransactions,
  fetchTransactionByRef,
  retryTransaction,
  flagTransaction,
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

  const getTransactions = useCallback((device: string, params: any) =>
    dispatch(fetchTransactions({ device, params }) as any), [dispatch]);
  const getTransactionByReference = useCallback((device: string, reference: string) =>
    dispatch(fetchTransactionByRef({ device, reference }) as any), [dispatch]);
  const clearCurrentTransaction = useCallback(() => dispatch(clearTransaction()), [dispatch]);
  const clearTransactionError = useCallback(() => dispatch(clearError()), [dispatch]);
  const retry = useCallback((device: string, reference: string) =>
    dispatch(retryTransaction({ device, reference }) as any), [dispatch]);
  const flag = useCallback((device: string, reference: string) =>
    dispatch(flagTransaction({ device, reference }) as any), [dispatch]);

  return {

    // State
    transactions,
    currentTransaction,
    loading,
    error,

    // Actions
    getTransactions,
    getTransactionByReference,
    clearTransaction: clearCurrentTransaction,
    clearError: clearTransactionError,
    retryTransaction: retry,
    flagTransaction: flag
  };
};
