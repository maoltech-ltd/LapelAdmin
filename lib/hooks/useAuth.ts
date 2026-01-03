// hooks/useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  login,
  getCurrentAdmin,
  requestPasswordReset,
  resetPassword,
  changePassword,
  logout,
  clearError,
  clearSuccess
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { 
    user, 
    token, 
    role, 
    loading, 
    error, 
    success, 
    isAuthenticated 
  } = useSelector((state: RootState) => state.auth);

  return {
    // State
    user,
    token,
    role,
    loading,
    error,
    success,
    isAuthenticated,
    
    // Actions
    login: (device: string, data: any) => 
      dispatch(login({ device, data }) as any),
    
    getCurrentAdmin: (device: string) => 
      dispatch(getCurrentAdmin(device) as any),
    
    requestPasswordReset: (device: string, identifier: string) => 
      dispatch(requestPasswordReset({ device, identifier }) as any),
    
    resetPassword: (device: string, data: any) => 
      dispatch(resetPassword({ device, data }) as any),
    
    changePassword: (device: string, data: any) => 
      dispatch(changePassword({ device, data }) as any),
    
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };
};