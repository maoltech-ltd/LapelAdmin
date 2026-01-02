import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminService } from '../../api/services';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminState {
  admins: Admin[];
  currentAdmin: Admin | null;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: AdminState = {
  admins: [],
  currentAdmin: null,
  loading: false,
  error: null,
  total: 0,
};

export const fetchAdmins = createAsyncThunk(
  'admins/fetchAdmins',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await adminService.getAdmins(device, params);
    return response.data;
  }
);

export const fetchAdminById = createAsyncThunk(
  'admins/fetchAdminById',
  async ({ device, id }: { device: string; id: string }) => {
    const response = await adminService.getAdminById(device, id);
    return response.data;
  }
);

export const searchAdmins = createAsyncThunk(
  'admins/searchAdmins',
  async ({ device, query, params }: { device: string; query: string; params?: any }) => {
    const response = await adminService.searchAdmins(device, query, params);
    return response.data;
  }
);

export const updateAdmin = createAsyncThunk(
  'admins/updateAdmin',
  async ({ device, id, data }: { device: string; id: string; data: Partial<Admin> }) => {
    const response = await adminService.updateAdmin(device, id, data);
    return response.data;
  }
);

export const deleteAdmin = createAsyncThunk(
  'admins/deleteAdmin',
  async ({ device, id }: { device: string; id: string }) => {
    const response = await adminService.deleteAdmin(device, id);
    return { id, ...response.data };
  }
);

const adminSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    clearAdmins: (state) => {
      state.admins = [];
      state.total = 0;
    },
    setCurrentAdmin: (state, action: PayloadAction<Admin>) => {
      state.currentAdmin = action.payload;
    },
    clearCurrentAdmin: (state) => {
      state.currentAdmin = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.admins || action.payload.data || action.payload;
        state.total = action.payload.total || action.payload.count || state.admins.length;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch admins';
      })
      // Fetch admin by ID
      .addCase(fetchAdminById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch admin';
      })
      // Search admins
      .addCase(searchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(searchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search admins';
      })
      // Update admin
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAdmin = action.payload;
        const index = state.admins.findIndex(admin => admin.id === updatedAdmin.id);
        if (index !== -1) {
          state.admins[index] = updatedAdmin;
        }
        if (state.currentAdmin?.id === updatedAdmin.id) {
          state.currentAdmin = updatedAdmin;
        }
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update admin';
      })
      // Delete admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = state.admins.filter(admin => admin.id !== action.payload.id);
        state.total -= 1;
        if (state.currentAdmin?.id === action.payload.id) {
          state.currentAdmin = null;
        }
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete admin';
      });
  },
});

export const { clearAdmins, setCurrentAdmin, clearCurrentAdmin, clearError } = adminSlice.actions;
export default adminSlice.reducer;