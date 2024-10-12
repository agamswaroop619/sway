import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

interface Image {
  url: string;
  imgId: number;
}

interface Quantity {
  small?: number;
  medium?: number;
  large?: number;
  xl?: number;
  xxl?: number;
}

export interface Item {
  id: string;
  title: string;
  images: Image[];
  price: number;
  description: string; // Can be an empty string
  descImg: string;
  color: string;
  review: number;
  userReview?: {
    userId: string;
    userName: string;
    comment: string;
    rating: number;
  }[]; // Empty array in this case
  category: string[]; // Array of categories
  quantity: Quantity[]; // Array of size-quantity objects
  createdAt: number;  // Firestore Timestamp type
}


  export interface UserState {
    itemsData: Item[] | null;  // User profile or null if not logged in
  }
  
  const initialState: UserState = {
    itemsData: null,
  };

  export const itemSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {

        setItemsData: (state, action: PayloadAction<Item[]>) => {
            state.itemsData = action.payload; // Expecting an array of items
            console.log(" Data in redux : ",state.itemsData);
          },
    }
  });

  export const { setItemsData } = itemSlice.actions;

  export const itemsDataInCart = ( state : RootState ) => state.items.itemsData;

  export default itemSlice.reducer;


