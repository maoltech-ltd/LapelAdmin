// hooks/useOrder.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  createOrder,
  getOrderById,
  getAllOrders,
  getPassengerOrders,
  getDriverOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getTotalOrders,
  getPaidOrders,
  getOrdersByStatus,
  clearError,
  clearSuccess
} from '../store/slices/orderSlice';
import { OrderRequestDto, OrderSearchParams, OrderStatus, PaymentStatus } from '../types/order.types';

export const useOrder = () => {
  const dispatch = useDispatch();
  const { 
    orders, 
    passengerOrders, 
    driverOrders, 
    currentOrder, 
    stats, 
    loading, 
    error, 
    success 
  } = useSelector((state: RootState) => state.orders);

  return {
    // State
    orders,
    passengerOrders,
    driverOrders,
    currentOrder,
    stats,
    loading,
    error,
    success,
    
    // Actions
    createOrder: (device: string, userId: string, data: OrderRequestDto) => 
      dispatch(createOrder({ device, userId, data }) as any),
    
    getOrderById: (device: string, orderId: string) => 
      dispatch(getOrderById({ device, orderId }) as any),
    
    getAllOrders: (device: string, params: OrderSearchParams) => 
      dispatch(getAllOrders({ device, params }) as any),
    
    getPassengerOrders: (device: string, userId: string) => 
      dispatch(getPassengerOrders({ device, userId }) as any),
    
    getDriverOrders: (device: string, userId: string) => 
      dispatch(getDriverOrders({ device, userId }) as any),
    
    updateOrderStatus: (device: string, orderId: string, status: OrderStatus, userId?: string) => 
      dispatch(updateOrderStatus({ device, orderId, status, userId }) as any),
    
    updatePaymentStatus: (device: string, orderId: string, payment: PaymentStatus) => 
      dispatch(updatePaymentStatus({ device, orderId, payment }) as any),
    
    getTotalOrders: (device: string) => 
      dispatch(getTotalOrders(device) as any),
    
    getPaidOrders: (device: string) => 
      dispatch(getPaidOrders(device) as any),
    
    getOrdersByStatus: (device: string, status: OrderStatus) => 
      dispatch(getOrdersByStatus({ device, status }) as any),
    
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };
};