import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { riderService } from '../../api/services';

interface Rider {
  id: string;
  userId: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
  vehicleType: string;
  licenseNumber: string;
  vehiclePlateNumber: string;
  isAvailable: boolean;
  status: string;
  rating?: number;
  totalRides?: number;
  createdAt: string;
  updatedAt: string;
}

interface RiderState {
  riders: Rider[];
  currentRider: Rider | null;
  riderProfile: Rider | null;
  loading: boolean;
  error: string | null;
  total: number;
  availableCount: number;
  totalCount: number;
}

const initialState: RiderState = {
  riders: [],
  currentRider: null,
  riderProfile: null,
  loading: false,
  error: null,
  total: 0,
  availableCount: 0,
  totalCount: 0,
};

export const fetchRiders = createAsyncThunk(
  'riders/fetchRiders',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await riderService.getRiders(device, params);
    return response.data;
  }
);

export const fetchRiderProfile = createAsyncThunk(
  'riders/fetchRiderProfile',
  async (device: string) => {
    const response = await riderService.getRiderProfile(device);
    return response.data;
  }
);

export const registerRider = createAsyncThunk(
  'riders/registerRider',
  async (data: {
    userId: string;
    vehicleType: string;
    licenseNumber: string;
    vehiclePlateNumber: string;
    device: string;
  }) => {
    const response = await riderService.registerRider(data);
    return response.data;
  }
);

export const updateRiderAvailability = createAsyncThunk(
  'riders/updateAvailability',
  async (data: { isAvailable: boolean; device: string }) => {
    const response = await riderService.updateAvailability(data);
    return response.data;
  }
);

export const activateRider = createAsyncThunk(
  'riders/activateRider',
  async ({ device, riderId }: { device: string; riderId: string }) => {
    const response = await riderService.activateRider(device, riderId);
    return response.data;
  }
);

export const deactivateRider = createAsyncThunk(
  'riders/deactivateRider',
  async ({ device, riderId }: { device: string; riderId: string }) => {
    const response = await riderService.deactivateRider(device, riderId);
    return response.data;
  }
);

export const deleteRider = createAsyncThunk(
  'riders/deleteRider',
  async ({ device, riderId }: { device: string; riderId: string }) => {
    const response = await riderService.deleteRider(device, riderId);
    return { riderId, ...response.data };
  }
);

export const fetchRiderStats = createAsyncThunk(
  'riders/fetchStats',
  async (device: string) => {
    const [countResponse, availableResponse] = await Promise.all([
      riderService.getRiderStatsCount(device),
      riderService.getAvailableRidersCount(device),
    ]);
    return {
      totalCount: countResponse.data.count || countResponse.data.total,
      availableCount: availableResponse.data.count || availableResponse.data.available,
    };
  }
);

const riderSlice = createSlice({
  name: 'riders',
  initialState,
  reducers: {
    clearRiders: (state) => {
      state.riders = [];
      state.total = 0;
    },
    setCurrentRider: (state, action: PayloadAction<Rider>) => {
      state.currentRider = action.payload;
    },
    clearCurrentRider: (state) => {
      state.currentRider = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch riders
      .addCase(fetchRiders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.riders = action.payload.riders || action.payload.data || action.payload;
        state.total = action.payload.total || action.payload.count || state.riders.length;
      })
      .addCase(fetchRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch riders';
      })
      // Fetch rider profile
      .addCase(fetchRiderProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRiderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.riderProfile = action.payload;
      })
      .addCase(fetchRiderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rider profile';
      })
      // Register rider
      .addCase(registerRider.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerRider.fulfilled, (state, action) => {
        state.loading = false;
        state.riders.push(action.payload);
        state.total += 1;
      })
      .addCase(registerRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register rider';
      })
      // Update availability
      .addCase(updateRiderAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRiderAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRider = action.payload;
        const index = state.riders.findIndex(rider => rider.id === updatedRider.id);
        if (index !== -1) {
          state.riders[index] = updatedRider;
        }
        if (state.currentRider?.id === updatedRider.id) {
          state.currentRider = updatedRider;
        }
        if (state.riderProfile?.id === updatedRider.id) {
          state.riderProfile = updatedRider;
        }
      })
      .addCase(updateRiderAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update availability';
      })
      // Activate rider
      .addCase(activateRider.fulfilled, (state, action) => {
        const updatedRider = action.payload;
        const index = state.riders.findIndex(rider => rider.id === updatedRider.id);
        if (index !== -1) {
          state.riders[index] = updatedRider;
        }
      })
      // Deactivate rider
      .addCase(deactivateRider.fulfilled, (state, action) => {
        const updatedRider = action.payload;
        const index = state.riders.findIndex(rider => rider.id === updatedRider.id);
        if (index !== -1) {
          state.riders[index] = updatedRider;
        }
      })
      // Delete rider
      .addCase(deleteRider.fulfilled, (state, action) => {
        state.riders = state.riders.filter(rider => rider.id !== action.payload.riderId);
        state.total -= 1;
      })
      // Fetch stats
      .addCase(fetchRiderStats.fulfilled, (state, action) => {
        state.totalCount = action.payload.totalCount;
        state.availableCount = action.payload.availableCount;
      });
  },
});

export const { clearRiders, setCurrentRider, clearCurrentRider, clearError } = riderSlice.actions;
export default riderSlice.reducer;