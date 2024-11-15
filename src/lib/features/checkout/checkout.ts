import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

interface cartItems {
  itemId: number;
  qnt: number;
  price: number;
  title: string;
  image: string;
  size: string;
  docId: string;
  stock: number;  // stock should always be a number
}

export interface itemState {
  checkoutItems: cartItems[] | null;  // User profile or null if not logged in
}

const initialState: itemState = {
  checkoutItems: null,
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    pushItem: (state, action: PayloadAction<cartItems>) => {
      if (state.checkoutItems) {
        // Add new item to the existing array without mutating the state
        const item = state.checkoutItems.find( item => item.itemId === action.payload.itemId )
        if( !item )
        state.checkoutItems = [...state.checkoutItems, action.payload];
      } else {
        // Initialize checkoutItems if it's null
        state.checkoutItems = [action.payload];
      }
    },

    removeCheckoutItem: (state, action: PayloadAction<number>) => {
      if( state.checkoutItems)
      state.checkoutItems = state.checkoutItems.filter(item => item.itemId !== action.payload);
      
    },

    clearCheckout: ( state ) => {
      state.checkoutItems= [];
    }
  }
});

// Optionally, you can export the actions if needed
export const { pushItem , removeCheckoutItem , clearCheckout} = checkoutSlice.actions;

// Selector to access checkoutItems
export const selectCheckoutItems = (state: RootState) => state.checkout.checkoutItems;

export default checkoutSlice.reducer;
