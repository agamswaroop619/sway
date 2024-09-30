import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Products } from '../carts/cartSlice';

export interface CartState {
  items: Products[];  // You could replace `any[]` with a more specific type for your items
}

const initialState: CartState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToCartWishlist: (state, action: PayloadAction<Products>) => {
      const item= state.items.find( item => item.itemId === action.payload.itemId )

      if(!item){
        // Immer handles the mutation here
      state.items.push(action.payload);
      }

    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.itemId !== action.payload);
    },
  },
});

// Export actions
export const { addToCartWishlist, removeFromWishlist } = wishlistSlice.actions;

// Export reducer
export default wishlistSlice.reducer;
