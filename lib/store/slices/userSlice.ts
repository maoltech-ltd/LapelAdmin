// slices/user.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserSearchParams, ApiResponse, PaginatedResponse } from '../../types/user.types';
import { userService } from '../../api/services';

export interface UserState {
  users: PaginatedResponse<User> | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  users: null,
  currentUser: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async ({ device, params }: { device: string; params: UserSearchParams }) => {
    return await userService.searchUsers(device, params);
  }
);

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await userService.getUserById(device, userId);
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ device, userId, data }: { device: string; userId: string; data: any }) => {
    return await userService.updateUser(device, userId, data);
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await userService.deleteUser(device, userId);
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ device, userId, data }: { device: string; userId: string; data: any }) => {
    return await userService.changePassword(device, userId, data);
  }
);

export const updateProfilePicture = createAsyncThunk(
  'user/updateProfilePicture',
  async ({ device, userId, imageUrl }: { device: string; userId: string; imageUrl: string }) => {
    return await userService.updateProfilePicture(device, userId, imageUrl);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.success = true;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search users';
      })
      
      // Get User by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data;
        state.success = true;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get user';
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data;
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
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
      })
      
      // Update Profile Picture
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser.profilePicture = action.payload.data;
        }
        state.success = true;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile picture';
      });
  },
});

export const { clearError, clearSuccess, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;