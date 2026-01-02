import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getCurrentAdmin, login, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector((state: any) => state.auth);

  const handleLogin = useCallback(
    async (email: string, password: string, device: string) => {
      return dispatch(login({ email, password, device }));
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const fetchCurrentAdmin = useCallback(
    async (device: string) => {
      return dispatch(getCurrentAdmin(device));
    },
    [dispatch]
  );

  return {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    getCurrentAdmin: fetchCurrentAdmin,
    isAuthenticated: !!token,
  };
};