// types/wallet.types.ts
export interface CreateWalletDTO {
  userId: string;
  currency: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  walletReference: string;
  minimumBalance?: number;
}

export interface WalletDTO {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  walletReference: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  totalTransactions: number;
  totalTransactionAmount: number;
  totalCredits: number;
  totalCreditAmount: number;
  totalDebits: number;
  totalDebitAmount: number;
  highestTransactionAmount: number;
  averageTransactionAmount: number;
  lastTransactionType: string;
  lastTransactionId: string;
  lastTransactionTime: string;
  lastTransactionReference: string;
  dailyTransactionLimit: number;
  singleTransactionLimit: number;
  minimumBalance: number;
}

export interface WalletSearchParams {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  active?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  code: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}