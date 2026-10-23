export type BroadcastAudience =
  | 'ALL_USERS'
  | 'PASSENGERS'
  | 'DRIVERS'
  | 'VERIFIED_DRIVERS'
  | 'UNVERIFIED_DRIVERS'
  | 'SELECTED_USERS';

export type BroadcastChannel = 'IN_APP' | 'PUSH' | 'EMAIL' | 'SMS';

export type BroadcastCategory = 'ANNOUNCEMENT' | 'PROMOTION' | 'SERVICE_UPDATE' | 'SAFETY';

export type BroadcastStatus = 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'CANCELLED';

export interface BroadcastAudienceRequest {
  audience: BroadcastAudience;
  userIds?: string[];
  /** yyyy-MM-dd, inclusive */
  signedUpFrom?: string;
  signedUpTo?: string;
}

export interface CreateBroadcastRequest extends BroadcastAudienceRequest {
  title: string;
  body: string;
  smsBody?: string;
  emailSubject?: string;
  imageUrl?: string;
  actionUrl?: string;
  actionLabel?: string;
  category: BroadcastCategory;
  channels: BroadcastChannel[];
  /** ISO-8601 with offset; omit to send now */
  scheduledAt?: string;
}

export interface BroadcastAudiencePreview {
  totalUsers: number;
  withPushToken: number;
  withEmail: number;
  withPhoneNumber: number;
}

export interface AdminBroadcast {
  id: string;
  title: string;
  body: string;
  smsBody?: string;
  emailSubject?: string;
  imageUrl?: string;
  actionUrl?: string;
  actionLabel?: string;
  category: BroadcastCategory;
  channels: BroadcastChannel[];
  audience: BroadcastAudience;
  userIds?: string[];
  signedUpFrom?: string;
  signedUpTo?: string;
  status: BroadcastStatus;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelRequested?: boolean;
  createdByAdminId?: string;
  createdByAdminName?: string;
  createdAt?: string;
  totalRecipients: number;
  processedRecipients: number;
  inAppSent: number;
  pushQueued: number;
  emailQueued: number;
  smsQueued: number;
  pushSkipped: number;
  emailSkipped: number;
  smsSkipped: number;
  failedRecipients: number;
  lastError?: string;
}

/** Lapel's response envelope, passed through unchanged by Lapel-Admin. */
export interface BroadcastApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface BroadcastPage {
  content: AdminBroadcast[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export const AUDIENCE_LABELS: Record<BroadcastAudience, string> = {
  ALL_USERS: 'All users',
  PASSENGERS: 'Customers (passengers)',
  DRIVERS: 'All drivers',
  VERIFIED_DRIVERS: 'Approved drivers',
  UNVERIFIED_DRIVERS: 'Drivers pending approval',
  SELECTED_USERS: 'Selected users',
};

export const CHANNEL_LABELS: Record<BroadcastChannel, string> = {
  IN_APP: 'In-app',
  PUSH: 'Push',
  EMAIL: 'Email',
  SMS: 'SMS',
};

export const CATEGORY_LABELS: Record<BroadcastCategory, string> = {
  ANNOUNCEMENT: 'Announcement',
  PROMOTION: 'Promotion',
  SERVICE_UPDATE: 'Service update',
  SAFETY: 'Safety',
};
