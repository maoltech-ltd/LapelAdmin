// services/order.service.ts
import axiosInstance from '../../axios/axiosInstance';
import { 
  OrderDto, 
  OrderRequestDto, 
  OrderStatus, 
  PaymentStatus,
  OrderSearchParams,
  ApiResponse,
  PaginatedResponse
} from '../../types/order.types';

const getHeaders = (userId?: string, orderId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (userId) {
    headers['X-USER-ID'] = userId;
  }

  if (orderId) {
    headers['X-ORDER-ID'] = orderId;
  }
  
  return { headers };
};

export const orderService = {
  // Create a new order
  createOrder: async (device: string, userId: string, data: OrderRequestDto): Promise<ApiResponse<OrderDto>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/admin/orders/book`,
      data,
      getHeaders(userId)
    );
    return response.data;
  },

  // Get order by ID
  getOrderById: async (device: string, orderId: string): Promise<ApiResponse<OrderDto>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/orders/details`,
      getHeaders(undefined, orderId)
    );
    return response.data;
  },

  // Get all orders with pagination and search
  getAllOrders: async (device: string, params: OrderSearchParams): Promise<ApiResponse<PaginatedResponse<OrderDto>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/orders`, {
      params,
      ...getHeaders()
    });
    return response.data;
  },

  // Get passenger's orders
  getPassengerOrders: async (device: string, userId: string): Promise<ApiResponse<OrderDto[]>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/orders/passenger`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Get driver's orders
  getDriverOrders: async (device: string, userId: string): Promise<ApiResponse<OrderDto[]>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/orders/driver`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (device: string, orderId: string, status: OrderStatus, userId?: string): Promise<ApiResponse<OrderDto>> => {
    const config = {
      params: { status },
      headers: userId ? getHeaders(userId, orderId).headers : getHeaders(undefined, orderId).headers
    };
    const response = userId
      ? await axiosInstance.put(`/api/v1/${device}/admin/orders/${orderId}/status`, null, config)
      : await axiosInstance.patch(`/api/v1/${device}/admin/orders/status`, null, config);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (device: string, orderId: string, payment: PaymentStatus): Promise<ApiResponse<OrderDto>> => {
    const response = await axiosInstance.put(
      `/api/v1/${device}/admin/orders/${orderId}/payment`,
      null,
      {
        params: { payment },
        headers: getHeaders(undefined, orderId).headers
      }
    );
    return response.data;
  },

  // Statistics
  getTotalOrders: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/orders/stats/total`
    );
    return response.data;
  },

  getPaidOrders: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/orders/stats/paid`
    );
    return response.data;
  },

  getOrdersByStatus: async (device: string, status: OrderStatus): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/orders/stats/status`,
      {
        params: { status }
      }
    );
    return response.data;
  }
};
