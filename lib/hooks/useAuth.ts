// hooks/useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
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
    isAuthenticated,
    authChecked 
  } = useSelector((state: RootState) => state.auth);

  const loginAdmin = useCallback((device: string, data: any) =>
    dispatch(login({ device, data }) as any), [dispatch]);
  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    // State
    user,
    token,
    role,
    loading,
    error,
    success,
    isAuthenticated,
    authChecked,
    
    // Actions
    login: loginAdmin,
    
    getCurrentAdmin: (device: string) => 
      dispatch(getCurrentAdmin(device) as any),
    
    requestPasswordReset: (device: string, identifier: string) => 
      dispatch(requestPasswordReset({ device, identifier }) as any),
    
    resetPassword: (device: string, data: any) => 
      dispatch(resetPassword({ device, data }) as any),
    
    changePassword: (device: string, data: any) => 
      dispatch(changePassword({ device, data }) as any),
    
    logout: () => dispatch(logout()),
    clearError: clearAuthError,
    clearSuccess: () => dispatch(clearSuccess()),
  };
};
