import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "@/lib/store";


// Define the Products type
export interface Products {
  itemId: number;
  qnt: number;
  price: number;
  title: string;
  image: string;
  size: string,
  docId: string,
}

// Define the CartState
export interface CartState {
  items: Products[];
}

// Helper function to load from localStorage (only on the client)
const loadFromLocalStorage = (): Products[] => {
  if (typeof window === "undefined") {
    // Return an empty array if SSR (no localStorage)
    return [];
  }
  try {
    const serializedCart = localStorage.getItem("cartItems");
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.warn("Failed to load cart from localStorage", e);
    return [];
  }
};

// Helper function to save to localStorage (only on the client)
const saveToLocalStorage = (state: Products[]) => {
  if (typeof window === "undefined") {
    // Don't attempt to save during SSR
    return;
  }
  try {
    const serializedCart = JSON.stringify(state);
    localStorage.setItem("cartItems", serializedCart);
  } catch (e) {
    console.warn("Failed to save cart to localStorage", e);
  }
};

// Initialize state from localStorage (only on client)
const initialState: CartState = {
  items: typeof window !== "undefined" ? loadFromLocalStorage() : [], // Only load if in the browser
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    addToCart: (state, action: PayloadAction<Products>) => {
      state.items.push(action.payload);
      saveToLocalStorage(state.items); // Save to localStorage after modification
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.itemId !== action.payload);
      saveToLocalStorage(state.items); // Save to localStorage after modification
    },

    // update quantity of each product
    updateQnt: (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
      const item = state.items.find(item => item.itemId === action.payload.itemId);
      if (item) {
        item.qnt = action.payload.quantity;
        saveToLocalStorage(state.items); // Save to localStorage after modification
      }
    },
    
    // Optional: Clear cart entirely
    clearCart: (state) => {
      state.items = [];
      saveToLocalStorage(state.items); // Clear from localStorage too
    },

    filterCart : ( state, action: PayloadAction<string[]> ) => {
     if( state.items) {
      state.items = state.items.filter(item => !action.payload.includes(item.itemId.toString()))
     }
    }
  },
});

// Export actions
export const { addToCart, removeFromCart, clearCart, updateQnt } = cartSlice.actions;

// Selector to access cart items
export const selectCartItems = (state: RootState) => state.cart.items;

// Export reducer
export default cartSlice.reducer;

