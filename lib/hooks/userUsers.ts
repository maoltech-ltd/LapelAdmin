// hooks/useUser.ts (custom hook for React components)
import { useDispatch, useSelector } from 'react-redux';
import { 
  searchUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  changePassword, 
  updateProfilePicture,
  clearError,
  clearSuccess,
  setCurrentUser
} from '../store/slices/userSlice';
import { RootState } from '../store/store';

export const useUser = () => {
  const dispatch = useDispatch();
  const { users, currentUser, loading, error, success } = useSelector(
    (state: RootState) => state.users
  );

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    success,
    
    // Actions
    searchUsers: (device: string, params: any) => 
      dispatch(searchUsers({ device, params }) as any),
    
    getUserById: (device: string, userId: string) => 
      dispatch(getUserById({ device, userId }) as any),
    
    updateUser: (device: string, userId: string, data: any) => 
      dispatch(updateUser({ device, userId, data }) as any),
    
    deleteUser: (device: string, userId: string) => 
      dispatch(deleteUser({ device, userId }) as any),
    
    changePassword: (device: string, userId: string, data: any) => 
      dispatch(changePassword({ device, userId, data }) as any),
    
    updateProfilePicture: (device: string, userId: string, imageUrl: string) => 
      dispatch(updateProfilePicture({ device, userId, imageUrl }) as any),
    
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
    clearCurrentUser: (): void => {
      dispatch(setCurrentUser(null))
    },
  };
};