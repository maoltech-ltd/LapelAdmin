export type Currency = 'NGN' | 'USD';

export type TransactionStatus =
  | 'pending'
  | 'success'
  | 'failed'
  | 'reversed'
  | 'cancelled'
  | 'processing'
  | 'flagged';

export type TransactionType =
  | 'wallet_funding'
  | 'ride_payment'
  | 'commission'
  | 'payout_request'
  | 'commission_refund'
  | 'refund'
  | 'payout';

export type PayoutStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed';
