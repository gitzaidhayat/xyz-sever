import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Don't auto-load user - rely on login/register responses
  // useEffect(() => {
  //   if (!user && !isAuthenticated && !isLoading) {
  //     dispatch(loadUser());
  //   }
  // }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin',
  };
};
