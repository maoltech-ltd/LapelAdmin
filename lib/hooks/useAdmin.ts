// hooks/useAdmin.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  searchAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  clearError,
  clearSuccess
} from '../store/slices/adminSlice';

export const useAdmin = () => {
  const dispatch = useDispatch();
  const { 
    admins, 
    currentAdmin, 
    loading, 
    error, 
    success 
  } = useSelector((state: RootState) => state.admins);

  return {
    // State
    admins,
    currentAdmin,
    loading,
    error,
    success,
    
    // Actions
    searchAdmins: (device: string, params: any) => 
      dispatch(searchAdmins({ device, params }) as any),
    
    getAdminById: (device: string, id: string) => 
      dispatch(getAdminById({ device, id }) as any),
    
    updateAdmin: (device: string, data: any) => 
      dispatch(updateAdmin({ device, data }) as any),
    
    deleteAdmin: (device: string, id: string) => 
      dispatch(deleteAdmin({ device, id }) as any),
    
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };
};