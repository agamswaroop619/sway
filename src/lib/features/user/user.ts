import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from '@/lib/localstorage'
import { Products } from '../carts/cartSlice';


export interface Order {
  itemId: string,
  orderId: string,
  shipmentId: string,
  image: string,
  title: string,
  price: number,
}

export interface User {
    name: string;
    email: string ;
    userId: string;
    refreshToken: string;
    accessToken: string;
    phone: string,
    orders: Order[],  
    delivery: {
        address: string,
        apartment: string,
        city: string,
        postalCode: string,
        state: string,
        country: string
    },
    wishlist: string[],
    cart: Products[],
}

export interface UserState {
  userProfile: User | null;  // User profile or null if not logged in
  isLoggedIn: boolean;       // Boolean to track logged-in status
}

const loadUserFromLocalStorage = (): UserState => {
  const storedUser = loadFromLocalStorage('user');
  if (storedUser) {
    return {
      userProfile: storedUser.userProfile,
      isLoggedIn: storedUser.isLoggedIn
    };
  }
  return {
    userProfile: null,
    isLoggedIn: false,
  };
};

const initialState: UserState = loadUserFromLocalStorage();

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    setUser: (state, action: PayloadAction<User>) => {
      state.userProfile = action.payload;
      state.isLoggedIn = true;
      // Save to localStorage
      saveToLocalStorage('user', { userProfile: action.payload, isLoggedIn: true });
    },

    logout: (state) => {
      state.userProfile = null;
      state.isLoggedIn = false;
      // Remove from localStorage
      removeFromLocalStorage('user');
    },

    setOrder: (state, action: PayloadAction<Order[]>) => {
      if (state.userProfile) {
        state.userProfile.orders = action.payload;
        // Save updated user info to localStorage
        saveToLocalStorage('user', state);
      }
    },

    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.userProfile) {
        state.userProfile = { ...state.userProfile, ...action.payload };
        // Save updated user info to localStorage
        saveToLocalStorage('user', state);
      }
    },

    clearOrders: (state) => {
      if (state.userProfile) {
        state.userProfile.orders = [];
      }
    },

    addToWishlist: (state, action: PayloadAction<string>) => {
      // Ensure wishlist is an array before modifying it
      if (state.userProfile) {
        if (!Array.isArray(state.userProfile.wishlist)) {
          state.userProfile.wishlist = []; // Initialize as an empty array if undefined or not an array
        }
    
        // Check if the item already exists in the wishlist to prevent duplicates
        if (!state.userProfile.wishlist.includes(action.payload)) {
          // Add the item to the beginning of the wishlist
          state.userProfile.wishlist.unshift(action.payload);
    
          // Save updated user info to localStorage
          saveToLocalStorage('user', state);
        }
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      if (state.userProfile && Array.isArray(state.userProfile.wishlist)) {
        // Filter out the item from the wishlist
        state.userProfile.wishlist = state.userProfile.wishlist.filter(item => item !== action.payload);
    
        // Save updated user info to localStorage
        saveToLocalStorage('user', state);
      }
    }
    
  },
});

// Export actions
export const { setUser, logout, updateProfile, setOrder, clearOrders,
   addToWishlist, removeFromWishlist } = userSlice.actions;
export const userProfileInfo = (state: RootState) => state.user.userProfile;
export const userLoginInfo = (state: RootState) => state.user.isLoggedIn;
// Export reducer
export default userSlice.reducer;
