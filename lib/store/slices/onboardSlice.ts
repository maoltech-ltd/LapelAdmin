import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { onboardService } from '../../api/services';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  address?: string;
  dateOfBirth?: string;
  isVerified: boolean;
  onboardingCompleted: boolean;
  userType: 'customer' | 'rider' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface OnboardState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  onboardingComplete: boolean;
}

const initialState: OnboardState = {
  profile: null,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  onboardingComplete: false,
};

export const getUserProfile = createAsyncThunk(
  'onboard/getUserProfile',
  async ({ device, userId }: { device: string; userId: string }) => {
    const response = await onboardService.getUserProfile({ device, userId });
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'onboard/updateProfile',
  async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    address?: string;
    dateOfBirth?: string;
    device: string;
  }) => {
    const response = await onboardService.updateProfile(data);
    return response.data;
  }
);

export const updateProfilePicture = createAsyncThunk(
  'onboard/updateProfilePicture',
  async ({ device, image }: { device: string; image: File }) => {
    const response = await onboardService.updateProfilePicture({ device, image });
    return response.data;
  }
);

export const verifySecondOTP = createAsyncThunk(
  'onboard/verifySecondOTP',
  async ({ device, otp, userId }: { device: string; otp: string; userId: string }) => {
    const response = await onboardService.secondOTPVerification({ device, otp, userId });
    return response.data;
  }
);

export const resendVerificationOTP = createAsyncThunk(
  'onboard/resendVerificationOTP',
  async ({ device, userId }: { device: string; userId: string }) => {
    const response = await onboardService.resendVerificationOTP(device, userId);
    return response.data;
  }
);

export const completeOnboarding = createAsyncThunk(
  'onboard/completeOnboarding',
  async ({ device, userId, data }: { device: string; userId: string; data?: any }) => {
    const response = await onboardService.completeOnboarding(device, userId, data);
    return response.data;
  }
);

export const becomeARider = createAsyncThunk(
  'onboard/becomeARider',
  async (data: {
    userId: string;
    vehicleType: string;
    licenseNumber: string;
    vehiclePlateNumber: string;
    device: string;
  }) => {
    const response = await onboardService.becomeARider(data);
    return response.data;
  }
);

const onboardSlice = createSlice({
  name: 'onboard',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    clearOtpStatus: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetOnboarding: (state) => {
      state.onboardingComplete = false;
      state.otpVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get user profile';
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // Update profile picture
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) {
          state.profile.profilePicture = action.payload.profilePicture;
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile picture';
      })
      // Verify second OTP
      .addCase(verifySecondOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifySecondOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
        if (state.profile) {
          state.profile.isVerified = true;
        }
      })
      .addCase(verifySecondOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to verify OTP';
      })
      // Resend verification OTP
      .addCase(resendVerificationOTP.fulfilled, (state) => {
        state.otpSent = true;
      })
      // Complete onboarding
      .addCase(completeOnboarding.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.loading = false;
        state.onboardingComplete = true;
        if (state.profile) {
          state.profile.onboardingCompleted = true;
        }
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to complete onboarding';
      })
      // Become a rider
      .addCase(becomeARider.pending, (state) => {
        state.loading = true;
      })
      .addCase(becomeARider.fulfilled, (state) => {
        state.loading = false;
        if (state.profile) {
          state.profile.userType = 'rider';
        }
      })
      .addCase(becomeARider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register as rider';
      });
  },
});

export const { clearProfile, clearOtpStatus, clearError, resetOnboarding } = onboardSlice.actions;
export default onboardSlice.reducer;