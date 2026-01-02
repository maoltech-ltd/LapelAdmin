import axiosInstance from "../../axios/axiosInstance";

interface OrderData {
  // Define order data structure
    userId: string;
}

export const orderService = {
  getOrders: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/orders`, { params }),

  getOrderDetails: (device: string, orderId: string) =>
    axiosInstance.get(`/api/v1/${device}/orders/details`, {
      params: { orderId },
    }),

  bookOrder: (device: string, data: OrderData) =>
    axiosInstance.post(`/api/v1/${device}/orders/book`, data),

  updateOrderStatus: (device: string, orderId: string, status: string) =>
    axiosInstance.put(`/api/v1/${device}/orders/${orderId}/status`, {
      status,
    }),

  updateOrderPayment: (device: string, orderId: string, paymentData: any) =>
    axiosInstance.put(`/api/v1/${device}/orders/${orderId}/payment`, paymentData),

  updateOrderStatusBulk: (device: string, data: { orderIds: string[]; status: string }) =>
    axiosInstance.patch(`/api/v1/${device}/orders/status`, data),

  getOrderStatsTotal: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/orders/stats/total`),

  getOrderStatsStatus: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/orders/stats/status`),

  getOrderStatsPaid: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/orders/stats/paid`),

  getPassengerOrders: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/orders/passenger`, { params }),

  getDriverOrders: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/orders/driver`, { params }),
};