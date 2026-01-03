// slices/dashboard.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  DashboardFilter,
  DashboardStats,
  RideVolumeData,
  ApiResponse 
} from '../../types/dashboard.types';
import { dashboardService } from '../../api/services';

interface DashboardState {
  stats: DashboardStats | null;
  rideVolumeGraph: RideVolumeData[] | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  currentFilter: DashboardFilter;
}

const initialState: DashboardState = {
  stats: null,
  rideVolumeGraph: null,
  loading: false,
  error: null,
  success: false,
  currentFilter: {
    period: 'TODAY'
  },
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async ({ device, filter }: { device: string; filter: DashboardFilter }) => {
    return await dashboardService.getDashboardStats(device, filter);
  }
);

export const fetchRideVolumeGraph = createAsyncThunk(
  'dashboard/fetchRideVolumeGraph',
  async ({ device, filter }: { device: string; filter: DashboardFilter }) => {
    return await dashboardService.getRideVolumeGraph(device, filter);
  }
);

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async ({ device, filter }: { device: string; filter: DashboardFilter }, { dispatch }) => {
    // Fetch both stats and graph data in parallel
    await Promise.all([
      dispatch(fetchDashboardStats({ device, filter })),
      dispatch(fetchRideVolumeGraph({ device, filter }))
    ]);
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setFilter: (state, action: PayloadAction<DashboardFilter>) => {
      state.currentFilter = { ...state.currentFilter, ...action.payload };
    },
    resetFilter: (state) => {
      state.currentFilter = { period: 'TODAY' };
    },
    clearDashboardData: (state) => {
      state.stats = null;
      state.rideVolumeGraph = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
        state.success = true;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard statistics';
      })
      
      // Fetch Ride Volume Graph
      .addCase(fetchRideVolumeGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRideVolumeGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.rideVolumeGraph = action.payload.data;
        state.success = true;
      })
      .addCase(fetchRideVolumeGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ride volume graph';
      })
      
      // Fetch All Dashboard Data (combined)
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  setFilter, 
  resetFilter, 
  clearDashboardData 
} = dashboardSlice.actions;
export default dashboardSlice.reducer;