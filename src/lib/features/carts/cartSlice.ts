import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface Products {
    itemId: number,
    qnt: number,
    price: number,
    title: string,
    image: string,
}

export interface CartState {
  items: Products[];  // You could replace `any[]` with a more specific type for your items
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Products>) => {
      // Immer handles the mutation here
      state.items.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.itemId !== action.payload);
    },
  },
});

// Export actions
export const { addToCart, removeFromCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
