// slices/admin.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  User,
  PaginatedResponse 
} from '../../types/user.types';
import { UserSearchParams } from '../../types/admin.types';
import { adminService } from '../../api/services';

interface AdminState {
  admins: PaginatedResponse<User> | null;
  currentAdmin: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AdminState = {
  admins: null,
  currentAdmin: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const searchAdmins = createAsyncThunk(
  'admin/searchAdmins',
  async ({ device, params }: { device: string; params: UserSearchParams }) => {
    return await adminService.searchAdmins(device, params);
  }
);

export const getAdminById = createAsyncThunk(
  'admin/getAdminById',
  async ({ device, id }: { device: string; id: string }) => {
    return await adminService.getAdminById(device, id);
  }
);

export const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ device, data }: { device: string; data: Partial<User> }) => {
    return await adminService.updateAdmin(device, data);
  }
);

export const deleteAdmin = createAsyncThunk(
  'admin/deleteAdmin',
  async ({ device, id }: { device: string; id: string }) => {
    return await adminService.deleteAdmin(device, id);
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentAdmin: (state, action: PayloadAction<User | null>) => {
      state.currentAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Admins
      .addCase(searchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.data;
        state.success = true;
      })
      .addCase(searchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search admins';
      })
      
      // Get Admin by ID
      .addCase(getAdminById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload.data;
        state.success = true;
      })
      .addCase(getAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get admin';
      })
      
      // Update Admin
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload.data;
        // Update in list if exists
        if (state.admins && state.admins.content) {
          const index = state.admins.content.findIndex(a => a.id === action.payload.data.id);
          if (index !== -1) {
            state.admins.content[index] = action.payload.data;
          }
        }
        state.success = true;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update admin';
      })
      
      // Delete Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from list if exists
        if (state.admins && state.admins.content) {
          const index = state.admins.content.findIndex(a => a.id === action.meta.arg.id);
          if (index !== -1) {
            state.admins.content.splice(index, 1);
            state.admins.totalElements -= 1;
            state.admins.numberOfElements -= 1;
          }
        }
        if (state.currentAdmin?.id === action.meta.arg.id) {
          state.currentAdmin = null;
        }
        state.success = true;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete admin';
      });
  },
});

export const { clearError, clearSuccess, setCurrentAdmin } = adminSlice.actions;
export default adminSlice.reducer;