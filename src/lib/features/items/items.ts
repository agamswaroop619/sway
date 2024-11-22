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

         },

         updateReview: (state, action: PayloadAction<{
          id: string, 
          review: number, 
          message: string, 
          userDocId: string, 
          userName: string, 
          updatedReview: number
      }>) => {
          if (state.itemsData) {
              state.itemsData = state.itemsData.map((item) => {
                  // Check if the current item's id matches the id from the action payload
                  if (item.id === action.payload.id) {
                      // Create the new review object
                      // const newReview = {
                      //     userName: action.payload.userName,
                      //     userDocId: action.payload.userDocId,
                      //     review: action.payload.message, // The review message
                      //     createdAt: new Date().getTime(),
                      //     rating: action.payload.review // The rating the user gave
                      // };
      
                      // Add the new review to the reviews array of the item (assuming `item.reviews` is an array)
                      // if( item.userReview) {
                      // item.userReview.unshift(newReview); // Add the review at the beginning of the array
                      // }
                      // else{
                      //   item.userReview = [newReview];
                      // }
                      // Update the item's rating with the new updated rating (calculated elsewhere)
                      // newReview.rating = action.payload.updatedReview;
      
                      // return item; // Return the updated item
                  }
                  return item; // Return unchanged item if id doesn't match
              });
          }
         },

         updateQntAtCart: (state, action: PayloadAction<{ itemId: string; quantity: number[] }>) => {
          if (state.itemsData) {
            state.itemsData = state.itemsData.map((item) => 
              item.id === action.payload.itemId 
                ? { ...item, quantity: action.payload.quantity } 
                : item
            );
          }
        }
        
    }
  });

  export const { setItemsData, updateItem, updateReview, updateQntAtCart } = itemSlice.actions;

  export const itemsDataInCart = ( state : RootState ) => state.items.itemsData;

  export default itemSlice.reducer;


