import axiosInstance from "../../axios/axiosInstance";

interface OnboardProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  device: string;
}

interface ProfilePictureData {
  image: File;
  device: string;
}

interface OTPVerificationData {
  otp: string;
  userId: string;
  device: string;
}

interface BecomeRiderData {
  userId: string;
  vehicleType: string;
  licenseNumber: string;
  vehiclePlateNumber: string;
  device: string;
}

interface UserProfileData {
  userId: string;
  device: string;
}

export const onboardService = {
  // Profile management
  updateProfile: (data: OnboardProfileData) =>
    axiosInstance.post(`/api/v1/${data.device}/onboard/update-profile`, data),

  updateProfilePicture: (data: ProfilePictureData) => {
    const formData = new FormData();
    formData.append('image', data.image);
    return axiosInstance.post(
      `/api/v1/${data.device}/onboard/update-profile-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  getUserProfile: (data: UserProfileData) =>
    axiosInstance.post(`/api/v1/${data.device}/onboard/get-user-profile`, {
      userId: data.userId,
    }),

  // OTP verification
  secondOTPVerification: (data: OTPVerificationData) =>
    axiosInstance.post(`/api/v1/${data.device}/onboard/second-otp-verification`, {
      otp: data.otp,
      userId: data.userId,
    }),

  resendVerificationOTP: (device: string, userId: string) =>
    axiosInstance.post(`/api/v1/${device}/onboard/resend-verification-otp`, {
      userId,
    }),

  // Onboarding completion
  completeOnboarding: (device: string, userId: string, data?: any) =>
    axiosInstance.post(`/api/v1/${device}/onboard/complete-onboarding`, {
      userId,
      ...data,
    }),

  // Rider onboarding
  becomeARider: (data: BecomeRiderData) =>
    axiosInstance.post(`/api/v1/${data.device}/onboard/become-a-rider`, data),
};