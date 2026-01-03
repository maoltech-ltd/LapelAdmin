// hooks/useRider.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  registerRider, 
  getRiderProfile, 
  getRiderVehicle, 
  updateRiderAvailability,
  getAllRiders,
  getAllVehicles,
  activateRider,
  deactivateRider,
  deleteRider,
  getTotalRidersCount,
  getAvailableRidersCount,
  clearError,
  clearSuccess
} from '../store/slices/riderSlice';

export const useRider = () => {
  const dispatch = useDispatch();
  const { 
    riders, 
    vehicles, 
    currentRider, 
    currentVehicle, 
    stats, 
    loading, 
    error, 
    success 
  } = useSelector((state: RootState) => state.riders);

  return {
    // State
    riders,
    vehicles,
    currentRider,
    currentVehicle,
    stats,
    loading,
    error,
    success,
    
    // Actions
    registerRider: (device: string, userId: string, data: any) => 
      dispatch(registerRider({ device, userId, data }) as any),
    
    getRiderProfile: (device: string, userId: string) => 
      dispatch(getRiderProfile({ device, userId }) as any),
    
    getRiderVehicle: (device: string, userId: string) => 
      dispatch(getRiderVehicle({ device, userId }) as any),
    
    updateRiderAvailability: (device: string, userId: string, available: boolean) => 
      dispatch(updateRiderAvailability({ device, userId, available }) as any),
    
    getAllRiders: (device: string, params: any) => 
      dispatch(getAllRiders({ device, params }) as any),
    
    getAllVehicles: (device: string, params: any) => 
      dispatch(getAllVehicles({ device, params }) as any),
    
    activateRider: (device: string, riderId: string) => 
      dispatch(activateRider({ device, riderId }) as any),
    
    deactivateRider: (device: string, userId: string) => 
      dispatch(deactivateRider({ device, userId }) as any),
    
    deleteRider: (device: string, userId: string) => 
      dispatch(deleteRider({ device, userId }) as any),
    
    getTotalRidersCount: (device: string) => 
      dispatch(getTotalRidersCount(device) as any),
    
    getAvailableRidersCount: (device: string) => 
      dispatch(getAvailableRidersCount(device) as any),
    
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };
};