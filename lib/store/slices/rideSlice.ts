import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { rideService } from '../../api/services';

interface RideLocation {
  address: string;
  latitude: number;
  longitude: number;
}

interface Ride {
  id: string;
  userId: string;
  riderId?: string;
  pickupLocation: RideLocation;
  dropoffLocation: RideLocation;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare?: number;
  distance?: number;
  estimatedDuration?: number;
  scheduledTime?: string;
  actualPickupTime?: string;
  actualDropoffTime?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    phone: string;
  };
  rider?: {
    name: string;
    vehiclePlateNumber: string;
  };
}

interface RideState {
  rides: Ride[];
  currentRide: Ride | null;
  availableRides: Ride[];
  rideHistory: Ride[];
  riderHistory: Ride[];
  customerHistory: Ride[];
  loading: boolean;
  error: string | null;
  totalRides: number;
  totalHistory: number;
}

const initialState: RideState = {
  rides: [],
  currentRide: null,
  availableRides: [],
  rideHistory: [],
  riderHistory: [],
  customerHistory: [],
  loading: false,
  error: null,
  totalRides: 0,
  totalHistory: 0,
};

// Async Thunks
export const fetchRideById = createAsyncThunk(
  'rides/fetchRideById',
  async ({ device, rideId }: { device: string; rideId: string }) => {
    const response = await rideService.getRideById(device, rideId);
    return response.data;
  }
);

export const updateRideStatus = createAsyncThunk(
  'rides/updateStatus',
  async ({ device, rideId, status }: { device: string; rideId: string; status: string }) => {
    const response = await rideService.updateRideStatus(device, rideId, status);
    return response.data;
  }
);

export const persistRide = createAsyncThunk(
  'rides/persistRide',
  async ({ device, data }: { device: string; data: any }) => {
    const response = await rideService.persistRide(device, data);
    return response.data;
  }
);

export const offerRide = createAsyncThunk(
  'rides/offerRide',
  async ({ device, data }: { device: string; data: any }) => {
    const response = await rideService.offerRide(device, data);
    return response.data;
  }
);

export const fetchAvailableRides = createAsyncThunk(
  'rides/fetchAvailableRides',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await rideService.getAvailableRides(device, params);
    return response.data;
  }
);

export const fetchRideHistory = createAsyncThunk(
  'rides/fetchHistory',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await rideService.getRideHistory(device, params);
    return response.data;
  }
);

export const fetchRiderHistory = createAsyncThunk(
  'rides/fetchRiderHistory',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await rideService.getRiderHistory(device, params);
    return response.data;
  }
);

export const fetchCustomerHistory = createAsyncThunk(
  'rides/fetchCustomerHistory',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await rideService.getCustomerHistory(device, params);
    return response.data;
  }
);

// Slice
const rideSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    clearRides: (state) => {
      state.rides = [];
      state.availableRides = [];
      state.totalRides = 0;
    },
    clearHistory: (state) => {
      state.rideHistory = [];
      state.riderHistory = [];
      state.customerHistory = [];
      state.totalHistory = 0;
    },
    setCurrentRide: (state, action: PayloadAction<Ride>) => {
      state.currentRide = action.payload;
    },
    clearCurrentRide: (state) => {
      state.currentRide = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addRide: (state, action: PayloadAction<Ride>) => {
      state.rides.unshift(action.payload);
      state.totalRides += 1;
    },
    removeRide: (state, action: PayloadAction<string>) => {
      state.rides = state.rides.filter(ride => ride.id !== action.payload);
      state.totalRides -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ride by ID
      .addCase(fetchRideById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRideById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRide = action.payload;
      })
      .addCase(fetchRideById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ride';
      })
      // Update ride status
      .addCase(updateRideStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRideStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRide = action.payload;
        
        // Update in rides array
        const rideIndex = state.rides.findIndex(ride => ride.id === updatedRide.id);
        if (rideIndex !== -1) {
          state.rides[rideIndex] = updatedRide;
        }
        
        // Update in available rides array
        const availableIndex = state.availableRides.findIndex(ride => ride.id === updatedRide.id);
        if (availableIndex !== -1) {
          state.availableRides[availableIndex] = updatedRide;
        }
        
        // Update in history arrays
        state.rideHistory = state.rideHistory.map(ride => 
          ride.id === updatedRide.id ? updatedRide : ride
        );
        state.riderHistory = state.riderHistory.map(ride => 
          ride.id === updatedRide.id ? updatedRide : ride
        );
        state.customerHistory = state.customerHistory.map(ride => 
          ride.id === updatedRide.id ? updatedRide : ride
        );
        
        // Update current ride if it's the same
        if (state.currentRide?.id === updatedRide.id) {
          state.currentRide = updatedRide;
        }
      })
      .addCase(updateRideStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update ride status';
      })
      // Persist ride
      .addCase(persistRide.pending, (state) => {
        state.loading = true;
      })
      .addCase(persistRide.fulfilled, (state, action) => {
        state.loading = false;
        state.rides.unshift(action.payload);
        state.totalRides += 1;
      })
      .addCase(persistRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to persist ride';
      })
      // Offer ride
      .addCase(offerRide.pending, (state) => {
        state.loading = true;
      })
      .addCase(offerRide.fulfilled, (state, action) => {
        state.loading = false;
        state.availableRides.push(action.payload);
      })
      .addCase(offerRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to offer ride';
      })
      // Fetch available rides
      .addCase(fetchAvailableRides.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableRides.fulfilled, (state, action) => {
        state.loading = false;
        state.availableRides = action.payload.rides || action.payload.data || action.payload;
      })
      .addCase(fetchAvailableRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch available rides';
      })
      // Fetch ride history
      .addCase(fetchRideHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRideHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.rideHistory = action.payload.rides || action.payload.data || action.payload;
        state.totalHistory = action.payload.total || action.payload.count || state.rideHistory.length;
      })
      .addCase(fetchRideHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ride history';
      })
      // Fetch rider history
      .addCase(fetchRiderHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRiderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.riderHistory = action.payload.rides || action.payload.data || action.payload;
      })
      .addCase(fetchRiderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rider history';
      })
      // Fetch customer history
      .addCase(fetchCustomerHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.customerHistory = action.payload.rides || action.payload.data || action.payload;
      })
      .addCase(fetchCustomerHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customer history';
      });
  },
});

export const {
  clearRides,
  clearHistory,
  setCurrentRide,
  clearCurrentRide,
  clearError,
  addRide,
  removeRide,
} = rideSlice.actions;

export default rideSlice.reducer;