import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { Products } from '../carts/cartSlice';

export interface User {
    name: string;
    email: string ;
    address: string;
    userId: string;
    refreshToken: string;
    accessToken: string;
    phone: string,
    orders: Products[],
}

export interface UserState {
  userProfile: User | null;  // User profile or null if not logged in
  isLoggedIn: boolean;       // Boolean to track logged-in status
}

const initialState: UserState = {
  userProfile: null,         // No user initially
  isLoggedIn: false,         // User is not logged in initially
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.userProfile = action.payload;    // Set user details
      state.isLoggedIn = true;               // Mark user as logged in
    },
    logout: (state) => {
      state.userProfile = null;              // Clear user details
      state.isLoggedIn = false;              // Mark user as logged out
    },
  },
});

// Export actions
export const { setUser, logout } = userSlice.actions;
export const userProfileInfo =  (state: RootState) => state.user.userProfile;
export const userLoginInfo = (state: RootState ) => state.user.isLoggedIn;
// Export reducer
export default userSlice.reducer;
