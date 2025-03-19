import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { RootState } from "@/lib/store";

// Define the Products type
export interface Products {
  itemId: number;
  qnt: number;
  price: number;
  title: string;
  image: string;
  size: string;
  docId: string;
}

// Define the CartState
export interface CartState {
  items: Products[];
}

// Function to load cart from localStorage
const loadCartFromLocalStorage = (): CartState => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : { items: [] };
  }
  return { items: [] };
};

// Function to save cart to localStorage
const saveCartToLocalStorage = (cart: CartState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

// Initialize state
const initialState: CartState = loadCartFromLocalStorage();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Products>) => {
      state.items.unshift(action.payload);
      saveCartToLocalStorage(state); // Save to localStorage
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.itemId !== action.payload);
      saveCartToLocalStorage(state);
    },

    updateQnt: (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
      const item = state.items.find(item => item.itemId === action.payload.itemId);
      if (item) {
        item.qnt = action.payload.quantity;
      }
      saveCartToLocalStorage(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state);
    },

    filterCart: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(item => !action.payload.includes(item.itemId.toString()));
      saveCartToLocalStorage(state);
    }
  },
});

// Export actions
export const { addToCart, removeFromCart, clearCart, updateQnt, filterCart } = cartSlice.actions;

// Selector to access cart items
export const selectCartItems = (state: RootState) => state.cart.items;

// Export reducer
export default cartSlice.reducer;
