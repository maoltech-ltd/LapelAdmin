// slices/order.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { 
  OrderDto, 
  OrderRequestDto, 
  OrderStatus, 
  PaymentStatus,
  OrderSearchParams,
  ApiResponse,
  PaginatedResponse 
} from '../../types/order.types';
import { orderService } from '../../api/services';

interface OrderState {
  orders: PaginatedResponse<OrderDto> | null;
  passengerOrders: OrderDto[] | null;
  driverOrders: OrderDto[] | null;
  currentOrder: OrderDto | null;
  stats: {
    totalOrders: number | null;
    paidOrders: number | null;
    ordersByStatus: Record<OrderStatus, number>;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  orders: null,
  passengerOrders: null,
  driverOrders: null,
  currentOrder: null,
  stats: {
    totalOrders: null,
    paidOrders: null,
    ordersByStatus: {} as Record<OrderStatus, number>,
  },
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ device, userId, data }: { device: string; userId: string; data: OrderRequestDto }) => {
    return await orderService.createOrder(device, userId, data);
  }
);

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async ({ device, orderId }: { device: string; orderId: string }) => {
    return await orderService.getOrderById(device, orderId);
  }
);

export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async ({ device, params }: { device: string; params: OrderSearchParams }) => {
    return await orderService.getAllOrders(device, params);
  }
);

export const getPassengerOrders = createAsyncThunk(
  'order/getPassengerOrders',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await orderService.getPassengerOrders(device, userId);
  }
);

export const getDriverOrders = createAsyncThunk(
  'order/getDriverOrders',
  async ({ device, userId }: { device: string; userId: string }) => {
    return await orderService.getDriverOrders(device, userId);
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ device, orderId, status, userId }: { device: string; orderId: string; status: OrderStatus; userId?: string }) => {
    return await orderService.updateOrderStatus(device, orderId, status, userId);
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'order/updatePaymentStatus',
  async ({ device, orderId, payment }: { device: string; orderId: string; payment: PaymentStatus }) => {
    return await orderService.updatePaymentStatus(device, orderId, payment);
  }
);

export const getTotalOrders = createAsyncThunk(
  'order/getTotalOrders',
  async (device: string) => {
    return await orderService.getTotalOrders(device);
  }
);

export const getPaidOrders = createAsyncThunk(
  'order/getPaidOrders',
  async (device: string) => {
    return await orderService.getPaidOrders(device);
  }
);

export const getOrdersByStatus = createAsyncThunk(
  'order/getOrdersByStatus',
  async ({ device, status }: { device: string; status: OrderStatus }) => {
    return await orderService.getOrdersByStatus(device, status);
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentOrder: (state, action: PayloadAction<OrderDto | null>) => {
      state.currentOrder = action.payload;
    },
    updateOrderInList: (state, action: PayloadAction<OrderDto>) => {
      if (state.orders && state.orders.content) {
        const index = state.orders.content.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders.content[index] = action.payload;
        }
      }
      
      if (state.passengerOrders) {
        const index = state.passengerOrders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.passengerOrders[index] = action.payload;
        }
      }
      
      if (state.driverOrders) {
        const index = state.driverOrders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.driverOrders[index] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      
      // Get Order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
        state.success = true;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get order details';
      })
      
      // Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.success = true;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get orders';
      })
      
      // Get Passenger Orders
      .addCase(getPassengerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPassengerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.passengerOrders = action.payload.data;
        state.success = true;
      })
      .addCase(getPassengerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get passenger orders';
      })
      
      // Get Driver Orders
      .addCase(getDriverOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDriverOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.driverOrders = action.payload.data;
        state.success = true;
      })
      .addCase(getDriverOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get driver orders';
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
        state.success = true;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update order status';
      })
      
      // Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
        state.success = true;
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update payment status';
      })
      
      // Get Total Orders
      .addCase(getTotalOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.totalOrders = action.payload.data;
        state.success = true;
      })
      .addCase(getTotalOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get total orders';
      })
      
      // Get Paid Orders
      .addCase(getPaidOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaidOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.paidOrders = action.payload.data;
        state.success = true;
      })
      .addCase(getPaidOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get paid orders';
      })
      
      // Get Orders by Status
      .addCase(getOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { status } = action.meta.arg;
        state.stats.ordersByStatus[status] = action.payload.data;
        state.success = true;
      })
      .addCase(getOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get orders by status';
      });
  },
});

export const { clearError, clearSuccess, setCurrentOrder, updateOrderInList } = orderSlice.actions;
export default orderSlice.reducer;