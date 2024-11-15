import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

interface Image {
  url: string;
  imgId: number;
}

interface Review {
  commentId: string,
  userId: string;
  userName: string;
  comment: string;
  rating: number;
}

export interface Item {
  id: string;
  docId: string,
  collection: string,
  title: string;
  images: Image[];
  price: number;
  description: string; // Can be an empty string
  descImg: string;
  color: string;
  review: number;
  userReview?: Review[]; // Empty array in this case
  category: string[]; // Array of categories
  quantity: number[]; // Array of size-quantity objects
  createdAt: number;  // Firestore Timestamp type
}


  export interface itemState {
    itemsData: Item[] | null;  // User profile or null if not logged in
  }
  
  const initialState: itemState = {
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

         updateItem : ( state, action: PayloadAction<Item > ) => {

          if( state.itemsData) {
            state.itemsData = state.itemsData.map((item: Item) =>
              item.id === action.payload.id ? action.payload: item
               
            );
          }

         }
    }
  });

  export const { setItemsData } = itemSlice.actions;

  export const itemsDataInCart = ( state : RootState ) => state.items.itemsData;

  export default itemSlice.reducer;


