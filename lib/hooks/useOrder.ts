import { useCallback } from 'react';
import {
  fetchOrders,
  fetchOrderDetails,
  bookOrder,
  updateOrderStatus,
  updateOrderPayment,
  updateOrderStatusBulk,
  fetchOrderStats,
  fetchPassengerOrders,
  fetchDriverOrders,
  clearOrders,
  setCurrentOrder,
  clearCurrentOrder,
  clearOrderDetails,
  updateOrderLocal,
} from '../store/slices/orderSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const useOrder = () => {
  const dispatch = useAppDispatch();
  const {
    orders,
    currentOrder,
    passengerOrders,
    driverOrders,
    orderDetails,
    loading,
    error,
    totalOrders,
    totalPassengerOrders,
    totalDriverOrders,
    stats,
  } = useAppSelector((state:any) => state.orders);

  const getOrders = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchOrders({ device, params }));
    },
    [dispatch]
  );

  const getOrderDetails = useCallback(
    async (device: string, orderId: string) => {
      return dispatch(fetchOrderDetails({ device, orderId }));
    },
    [dispatch]
  );

  const book = useCallback(
    async (device: string, data: any) => {
      return dispatch(bookOrder({ device, data }));
    },
    [dispatch]
  );

  const updateStatus = useCallback(
    async (device: string, orderId: string, status: string) => {
      return dispatch(updateOrderStatus({ device, orderId, status }));
    },
    [dispatch]
  );

  const updatePayment = useCallback(
    async (device: string, orderId: string, paymentData: any) => {
      return dispatch(updateOrderPayment({ device, orderId, paymentData }));
    },
    [dispatch]
  );

  const updateStatusBulk = useCallback(
    async (device: string, orderIds: string[], status: string) => {
      return dispatch(updateOrderStatusBulk({ device, data: { orderIds, status } }));
    },
    [dispatch]
  );

  const getStats = useCallback(
    async (device: string) => {
      return dispatch(fetchOrderStats(device));
    },
    [dispatch]
  );

  const getPassengerOrders = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchPassengerOrders({ device, params }));
    },
    [dispatch]
  );

  const getDriverOrders = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchDriverOrders({ device, params }));
    },
    [dispatch]
  );

  const clearAllOrders = useCallback(() => {
    dispatch(clearOrders());
  }, [dispatch]);

  const setOrder = useCallback(
    (order: any) => {
      dispatch(setCurrentOrder(order));
    },
    [dispatch]
  );

  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearOrderDetails());
  }, [dispatch]);

  const updateLocalOrder = useCallback(
    (id: string, updates: any) => {
      dispatch(updateOrderLocal({ id, updates }));
    },
    [dispatch]
  );

  return {
    // State
    orders,
    currentOrder,
    passengerOrders,
    driverOrders,
    orderDetails,
    loading,
    error,
    totalOrders,
    totalPassengerOrders,
    totalDriverOrders,
    stats,

    // Actions
    getOrders,
    getOrderDetails,
    bookOrder: book,
    updateOrderStatus: updateStatus,
    updateOrderPayment: updatePayment,
    updateOrderStatusBulk,
    getOrderStats: getStats,
    getPassengerOrders,
    getDriverOrders,
    clearOrders: clearAllOrders,
    setCurrentOrder: setOrder,
    clearCurrentOrder: clearOrder,
    clearOrderDetails: clearDetails,
    updateOrderLocal: updateLocalOrder,
  };
};