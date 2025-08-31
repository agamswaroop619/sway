import { useDispatch, useSelector, useStore, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';

// Create a typed version of useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use throughout your app instead of plain `useStore`
export const useAppStore = () => useStore<AppStore>();

// Admin authentication hook
export const useAdminAuth = () => {
  const userProfile = useAppSelector((state: RootState) => state.user.userProfile);
  const isLoggedIn = useAppSelector((state: RootState) => state.user.isLoggedIn);
  
  const isAdmin = isLoggedIn && userProfile?.email === 'sunnyks927@gmail.com';
  
  return {
    isAdmin,
    isLoggedIn,
    userProfile
  };
};
