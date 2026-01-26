export interface Transaction {
  id: number;
  method: string;
  userId: string;
  reference: string;
  amount: number;
  fee: number;
  totalAmount: number;
  currency: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  metadata: string | null;
  paymentMethod: string;
  paymentProvider: string;
  ipAddress: string;
  userAgent: string;
  direction: 'credit' | 'debit';
  recipientName: string;
  recipientId: string;
  senderId: string;
  recipientAccount: string;
  recipientBank: string;
  preBalance: string;
  postBalance: string;
  createdAt: string;
}

export interface TransactionSearchParams {
  page?: number;
  size?: number;
  status?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  reference?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  code: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
