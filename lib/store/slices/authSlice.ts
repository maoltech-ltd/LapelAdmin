// slices/auth.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  LoginDto, 
  ResetPasswordDto, 
  AdminChangePasswordDto,
} from '../../types/auth.types';
import axiosInstance from '../../axios/axiosInstance';
import { authService } from '../../api/services';
import { User } from '../../types/user.types';

interface AuthState {
  user: User | null;
  token: string | null;
  role: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  isAuthenticated: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
  authChecked: false,
};

// Check for existing token in localStorage on initial load
// if (typeof window !== 'undefined') {
//   const savedToken = localStorage.getItem('adminToken');
//   const savedUser = localStorage.getItem('adminUser');
//   if (savedToken && savedUser) {
//     initialState.token = savedToken;
//     initialState.user = JSON.parse(savedUser);
//     initialState.isAuthenticated = true;
//     // Set default axios header
//     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
//   }
// }

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ device, data }: { device: string; data: LoginDto }) => {
    return await authService.login(device, data);
  }
);

export const getCurrentAdmin = createAsyncThunk(
  'auth/getCurrentAdmin',
  async (device: string) => {
    return await authService.getCurrentAdmin(device);
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async ({ device, identifier }: { device: string; identifier: string }) => {
    return await authService.requestPasswordReset(device, identifier);
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ device, data }: { device: string; data: ResetPasswordDto }) => {
    return await authService.resetPassword(device, data);
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ device, data }: { device: string; data: AdminChangePasswordDto }) => {
    return await authService.changePassword(device, data);
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
      
      // Remove axios header
      delete axiosInstance.defaults.headers.common['Authorization'];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setAuthState: (state, action: PayloadAction<{ token: string; user: User; role: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.authChecked = true;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', action.payload.token);
        localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
      }
      
      // Set axios header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.user = action.payload.data.user;
        state.role = action.payload.data.role;
        state.isAuthenticated = true;
        state.success = true;
        state.authChecked = true;
        
        // Save to localStorage
        // if (typeof window !== 'undefined') {
        //   localStorage.setItem('adminToken', action.payload.data.token);
        //   localStorage.setItem('adminUser', JSON.stringify(action.payload.data.user));
        // }
        
        // Set axios header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${action.payload.data.token}`;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      })
      
      // Get Current Admin
      .addCase(getCurrentAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.success = true;
        state.authChecked = true;
      })
      .addCase(getCurrentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get admin profile';
        // Don't set isAuthenticated to false here - let logout handle that
      })
      
      // Request Password Reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to request password reset';
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reset password';
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to change password';
      });
  },
});

export const { logout, clearError, clearSuccess, setAuthState } = authSlice.actions;
export default authSlice.reducer;