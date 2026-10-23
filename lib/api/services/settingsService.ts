import axiosInstance from '../../axios/axiosInstance';

export interface PlatformSettings {
  commissionPercentage: number;
  maxSeatsPerRide: number;
  rideMatchingEnabled: boolean;
  scheduledRidesEnabled: boolean;
  driverAutoApprovalEnabled: boolean;
  notificationsEnabled: boolean;
  transactionNotificationEmailCharge: number;
  transactionNotificationSmsCharge: number;
  transactionNotificationPushCharge: number;
  rideNotificationEmailCharge: number;
  rideNotificationSmsCharge: number;
  rideNotificationPushCharge: number;
  smsTransactionTemplate: string;
  emailTransactionTemplate: string;
  pushTransactionTemplate: string;
  smsRideTemplate: string;
  emailRideTemplate: string;
  pushRideTemplate: string;
  referralEnabled: boolean;
  referralRewardType: 'WALLET' | 'FREE_RIDE';
  referralRewardAmount: number;
  referralFreeRideCount: number;
  firstRideFreeEnabled: boolean;
  iosWalletFundingCharge: number;
  androidWalletFundingCharge: number;
  iosWithdrawalCharge: number;
  androidWithdrawalCharge: number;
  rideChargeType: 'FIXED' | 'PERCENTAGE';
  iosRideCharge: number;
  androidRideCharge: number;
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxDiscountAmount: number;
  usageLimit: number;
  usageCount?: number;
  active: boolean;
  expiresAt?: string;
  issuedBy?: string;
}

export const settingsService = {
  getSettings: async (device: string) => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/settings`);
    return response.data;
  },

  updateSettings: async (device: string, data: PlatformSettings) => {
    const response = await axiosInstance.put(`/api/v1/${device}/admin/settings`, data);
    return response.data;
  },

  getCoupons: async (device: string) => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/coupons`);
    return response.data;
  },

  issueCoupon: async (device: string, data: Coupon) => {
    const response = await axiosInstance.post(`/api/v1/${device}/admin/coupons`, data);
    return response.data;
  },
};
