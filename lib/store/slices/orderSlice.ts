import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '../../api/services';
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  riderId?: string;
  rideId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryAddress: string;
  deliveryInstructions?: string;
  scheduledDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    phone: string;
    email: string;
  };
  rider?: {
    name: string;
    phone: string;
  };
}

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  in_delivery: number;
  delivered: number;
  cancelled: number;
  paid: number;
  unpaid: number;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  passengerOrders: Order[];
  driverOrders: Order[];
  orderDetails: Order | null;
  loading: boolean;
  error: string | null;
  totalOrders: number;
  totalPassengerOrders: number;
  totalDriverOrders: number;
  stats: OrderStats | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  passengerOrders: [],
  driverOrders: [],
  orderDetails: null,
  loading: false,
  error: null,
  totalOrders: 0,
  totalPassengerOrders: 0,
  totalDriverOrders: 0,
  stats: null,
};

// Async Thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await orderService.getOrders(device, params);
    return response.data;
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async ({ device, orderId }: { device: string; orderId: string }) => {
    const response = await orderService.getOrderDetails(device, orderId);
    return response.data;
  }
);

export const bookOrder = createAsyncThunk(
  'orders/bookOrder',
  async ({ device, data }: { device: string; data: any }) => {
    const response = await orderService.bookOrder(device, data);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ device, orderId, status }: { device: string; orderId: string; status: string }) => {
    const response = await orderService.updateOrderStatus(device, orderId, status);
    return response.data;
  }
);

export const updateOrderPayment = createAsyncThunk(
  'orders/updatePayment',
  async ({ device, orderId, paymentData }: { device: string; orderId: string; paymentData: any }) => {
    const response = await orderService.updateOrderPayment(device, orderId, paymentData);
    return response.data;
  }
);

export const updateOrderStatusBulk = createAsyncThunk(
  'orders/updateStatusBulk',
  async ({ device, data }: { device: string; data: { orderIds: string[]; status: string } }) => {
    const response = await orderService.updateOrderStatusBulk(device, data);
    return response.data;
  }
);

export const fetchOrderStats = createAsyncThunk(
  'orders/fetchStats',
  async (device: string) => {
    const [totalResponse, statusResponse, paidResponse] = await Promise.all([
      orderService.getOrderStatsTotal(device),
      orderService.getOrderStatsStatus(device),
      orderService.getOrderStatsPaid(device),
    ]);
    
    return {
      total: totalResponse.data,
      status: statusResponse.data,
      paid: paidResponse.data,
    };
  }
);

export const fetchPassengerOrders = createAsyncThunk(
  'orders/fetchPassengerOrders',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await orderService.getPassengerOrders(device, params);
    return response.data;
  }
);

export const fetchDriverOrders = createAsyncThunk(
  'orders/fetchDriverOrders',
  async ({ device, params }: { device: string; params?: any }) => {
    const response = await orderService.getDriverOrders(device, params);
    return response.data;
  }
);

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.passengerOrders = [];
      state.driverOrders = [];
      state.totalOrders = 0;
      state.totalPassengerOrders = 0;
      state.totalDriverOrders = 0;
    },
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.totalOrders += 1;
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
      state.totalOrders -= 1;
    },
    updateOrderLocal: (state, action: PayloadAction<{ id: string; updates: Partial<Order> }>) => {
      const { id, updates } = action.payload;
      
      // Update in orders array
      state.orders = state.orders.map(order =>
        order.id === id ? { ...order, ...updates } : order
      );
      
      // Update in passenger orders array
      state.passengerOrders = state.passengerOrders.map(order =>
        order.id === id ? { ...order, ...updates } : order
      );
      
      // Update in driver orders array
      state.driverOrders = state.driverOrders.map(order =>
        order.id === id ? { ...order, ...updates } : order
      );
      
      // Update current order if it's the same
      if (state.currentOrder?.id === id) {
        state.currentOrder = { ...state.currentOrder, ...updates };
      }
      
      // Update order details if it's the same
      if (state.orderDetails?.id === id) {
        state.orderDetails = { ...state.orderDetails, ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || action.payload.data || action.payload;
        state.totalOrders = action.payload.total || action.payload.count || state.orders.length;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order details';
      })
      // Book order
      .addCase(bookOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.totalOrders += 1;
      })
      .addCase(bookOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to book order';
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        
        // Update in all arrays
        state.orders = state.orders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        state.passengerOrders = state.passengerOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        state.driverOrders = state.driverOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        
        // Update current order and order details
        if (state.currentOrder?.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
        if (state.orderDetails?.id === updatedOrder.id) {
          state.orderDetails = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update order status';
      })
      // Update order payment
      .addCase(updateOrderPayment.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        
        // Update in all arrays
        state.orders = state.orders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        state.passengerOrders = state.passengerOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        state.driverOrders = state.driverOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        
        // Update current order and order details
        if (state.currentOrder?.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
        if (state.orderDetails?.id === updatedOrder.id) {
          state.orderDetails = updatedOrder;
        }
      })
      // Update order status bulk
      .addCase(updateOrderStatusBulk.fulfilled, (state, action) => {
        const updatedOrders = action.payload;
        
        // Create a map of updated orders for quick lookup
        const updatedOrdersMap = new Map();
        updatedOrders.forEach((order: { id: any; }) => {
          updatedOrdersMap.set(order.id, order);
        });
        
        // Update orders array
        state.orders = state.orders.map(order =>
          updatedOrdersMap.has(order.id) ? updatedOrdersMap.get(order.id) : order
        );
        
        // Update passenger orders array
        state.passengerOrders = state.passengerOrders.map(order =>
          updatedOrdersMap.has(order.id) ? updatedOrdersMap.get(order.id) : order
        );
        
        // Update driver orders array
        state.driverOrders = state.driverOrders.map(order =>
          updatedOrdersMap.has(order.id) ? updatedOrdersMap.get(order.id) : order
        );
      })
      // Fetch order stats
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        const { total, status, paid } = action.payload;
        state.stats = {
          total: total?.total || 0,
          pending: status?.pending || 0,
          confirmed: status?.confirmed || 0,
          preparing: status?.preparing || 0,
          ready: status?.ready || 0,
          in_delivery: status?.in_delivery || 0,
          delivered: status?.delivered || 0,
          cancelled: status?.cancelled || 0,
          paid: paid?.paid || 0,
          unpaid: paid?.unpaid || 0,
        };
      })
      // Fetch passenger orders
      .addCase(fetchPassengerOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPassengerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.passengerOrders = action.payload.orders || action.payload.data || action.payload;
        state.totalPassengerOrders = action.payload.total || action.payload.count || state.passengerOrders.length;
      })
      .addCase(fetchPassengerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch passenger orders';
      })
      // Fetch driver orders
      .addCase(fetchDriverOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDriverOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.driverOrders = action.payload.orders || action.payload.data || action.payload;
        state.totalDriverOrders = action.payload.total || action.payload.count || state.driverOrders.length;
      })
      .addCase(fetchDriverOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch driver orders';
      });
  },
});

export const {
  clearOrders,
  setCurrentOrder,
  clearCurrentOrder,
  clearOrderDetails,
  clearError,
  addOrder,
  removeOrder,
  updateOrderLocal,
} = orderSlice.actions;

export default orderSlice.reducer;