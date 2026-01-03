// slices/rider.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Rider, 
  Vehicle,
  BecomeARiderDto,
  RiderSearchParams,
  VehicleSearchParams,
  ApiResponse,
  PaginatedResponse 
} from '../../types/rider.types';
import { riderService } from '../../api/services';

interface RiderState {
  riders: PaginatedResponse<Rider> | null;
  vehicles: PaginatedResponse<Vehicle> | null;
  currentRider: Rider | null;
  currentVehicle: Vehicle | null;
  stats: {
    totalRiders: number | null;
    availableRiders: number | null;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RiderState = {
  riders: null,
  vehicles: null,
  currentRider: null,
  currentVehicle: null,
  stats: {
    totalRiders: null,
    availableRiders: null,
  },
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const registerRider = createAsyncThunk(
  'rider/registerRider',
  async ({ device, userId, data }: { device: string; userId: string; data: BecomeARiderDto }) => {
    return await riderService.registerRider(device, userId, data);
  }
);

export const getRiderProfile = createAsyncThunk(
  'rider/getRiderProfile',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await riderService.getRiderProfile(device, userId);
  }
);

export const getRiderVehicle = createAsyncThunk(
  'rider/getRiderVehicle',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await riderService.getRiderVehicle(device, userId);
  }
);

export const updateRiderAvailability = createAsyncThunk(
  'rider/updateRiderAvailability',
  async ({ device, userId, available }: { device: string; userId: string; available: boolean }) => {
    return await riderService.updateRiderAvailability(device, userId, available);
  }
);

export const getAllRiders = createAsyncThunk(
  'rider/getAllRiders',
  async ({ device, params }: { device: string; params: RiderSearchParams }) => {
    return await riderService.getAllRiders(device, params);
  }
);

export const getAllVehicles = createAsyncThunk(
  'rider/getAllVehicles',
  async ({ device, params }: { device: string; params: VehicleSearchParams }) => {
    return await riderService.getAllVehicles(device, params);
  }
);

export const activateRider = createAsyncThunk(
  'rider/activateRider',
  async ({ device, riderId }: { device: string; riderId: string }) => {
    return await riderService.activateRider(device, riderId);
  }
);

export const deactivateRider = createAsyncThunk(
  'rider/deactivateRider',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await riderService.deactivateRider(device, userId);
  }
);

export const deleteRider = createAsyncThunk(
  'rider/deleteRider',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await riderService.deleteRider(device, userId);
  }
);

export const getTotalRidersCount = createAsyncThunk(
  'rider/getTotalRidersCount',
  async (device: string) => {
    return await riderService.getTotalRidersCount(device);
  }
);

export const getAvailableRidersCount = createAsyncThunk(
  'rider/getAvailableRidersCount',
  async (device: string) => {
    return await riderService.getAvailableRidersCount(device);
  }
);

const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentRider: (state, action: PayloadAction<Rider | null>) => {
      state.currentRider = action.payload;
    },
    setCurrentVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.currentVehicle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Rider
      .addCase(registerRider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerRider.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRider = action.payload.data;
        state.success = true;
      })
      .addCase(registerRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register as rider';
      })
      
      // Get Rider Profile
      .addCase(getRiderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRiderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRider = action.payload.data;
        state.success = true;
      })
      .addCase(getRiderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get rider profile';
      })
      
      // Get Rider Vehicle
      .addCase(getRiderVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRiderVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload.data;
        state.success = true;
      })
      .addCase(getRiderVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get rider vehicle';
      })
      
      // Update Availability
      .addCase(updateRiderAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRiderAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRider = action.payload.data;
        state.success = true;
      })
      .addCase(updateRiderAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update availability';
      })
      
      // Get All Riders
      .addCase(getAllRiders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.riders = action.payload.data;
        state.success = true;
      })
      .addCase(getAllRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get riders';
      })
      
      // Get All Vehicles
      .addCase(getAllVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.data;
        state.success = true;
      })
      .addCase(getAllVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get vehicles';
      })
      
      // Activate Rider
      .addCase(activateRider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateRider.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific rider in the list if exists
        if (state.riders && state.riders.content) {
          const index = state.riders.content.findIndex(r => r.id === action.payload.data.id);
          if (index !== -1) {
            state.riders.content[index] = action.payload.data;
          }
        }
        state.success = true;
      })
      .addCase(activateRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to activate rider';
      })
      
      // Deactivate Rider
      .addCase(deactivateRider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateRider.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific rider in the list if exists
        if (state.riders && state.riders.content) {
          const index = state.riders.content.findIndex(r => r.id === action.payload.data.id);
          if (index !== -1) {
            state.riders.content[index] = action.payload.data;
          }
        }
        state.success = true;
      })
      .addCase(deactivateRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to deactivate rider';
      })
      
      // Delete Rider
      .addCase(deleteRider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRider.fulfilled, (state) => {
        state.loading = false;
        state.currentRider = null;
        state.success = true;
      })
      .addCase(deleteRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete rider';
      })
      
      // Get Total Riders Count
      .addCase(getTotalRidersCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalRidersCount.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.totalRiders = action.payload.data;
        state.success = true;
      })
      .addCase(getTotalRidersCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get total riders count';
      })
      
      // Get Available Riders Count
      .addCase(getAvailableRidersCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableRidersCount.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.availableRiders = action.payload.data;
        state.success = true;
      })
      .addCase(getAvailableRidersCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get available riders count';
      });
  },
});

export const { clearError, clearSuccess, setCurrentRider, setCurrentVehicle } = riderSlice.actions;
export default riderSlice.reducer;