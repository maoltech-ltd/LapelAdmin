import axiosInstance from '../../axios/axiosInstance';
import { 
    TransactionSearchParams, 
    ApiResponse, 
    PaginatedResponse, 
    Transaction
} from '../../types/transaction.type';


export const transactionService = {

  // Get paginated transactions
  getTransactions: async (
    device: string,
    params: TransactionSearchParams
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> => {

    const response = await axiosInstance.get(
      `/api/v1/${device}/transactions`,
      { params }
    );

    return response.data;
  },

  // Get single transaction by reference
  getTransactionByReference: async (
    device: string,
    reference: string
  ): Promise<ApiResponse<Transaction>> => {

    const response = await axiosInstance.get(
      `/api/v1/${device}/transactions/${reference}`
    );

    return response.data;
  }

};
