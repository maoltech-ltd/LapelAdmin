import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, searchUsers, updateUser } from '../store/slices/userSlice';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, currentUser, loading, error, total } = useAppSelector(
    (state: any) => state.users
  );

  const getUsers = useCallback(
    async (device: string, params?: any) => {
      return dispatch(fetchUsers({ device, params }));
    },
    [dispatch]
  );

  const search = useCallback(
    async (device: string, query: string) => {
      return dispatch(searchUsers({ device, query }));
    },
    [dispatch]
  );

  const update = useCallback(
    async (device: string, userId: string, data: any) => {
      return dispatch(updateUser({ device, userId, data }));
    },
    [dispatch]
  );

  return {
    users,
    currentUser,
    loading,
    error,
    total,
    getUsers,
    searchUsers: search,
    updateUser: update,
  };
};