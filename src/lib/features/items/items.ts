import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import toast from "react-hot-toast";

interface Image {
  url: string;
  imgId: number;
}

interface Review {
 review: string
  userRating: number,
  userId: string,
  userName: string,
  commentId: string,
  createdAt: string, 
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
          itemId: string, 
          userRating: number,
          updatedRating: number,
          userId: string,
          userName: string,
          commentId: string,  
          review: string   ,
          createdAt: string,  
        }>) => {
          if (state.itemsData) {

            state.itemsData = state.itemsData.map((item) => {

              
        
              if (Number(item.id) == Number(action.payload.itemId)) {
                // Update the review rating (ensure it's a string if needed)
                item.review = action.payload.updatedRating; // Assuming this should be a string
        
                // Prepend the updated review to the userReview array (ensure it matches the Review interface)
                item.userReview = [{
                  review: action.payload.review,
                  userId: action.payload.userId,
                  userName: action.payload.userName,
                  commentId: action.payload.commentId,
                  userRating: action.payload.userRating,
                  createdAt: action.payload.createdAt,
                }, ...(item.userReview || [])];


                console.log("item match for update review");
              } else {
                console.log(`item not match for update review -> ${item.id } ${action.payload.itemId}`);
              }
        
              // Return the unchanged item if the id doesn't match
              return item;
            });
          } else {
            console.log("itemsData not found");
          }
        },
        
        
          testReview : ( state ) => {
            toast.success("Test function called");
            console.log("state item data ",state.itemsData)
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

  export const { setItemsData, updateItem, updateReview, updateQntAtCart, testReview } = itemSlice.actions;

  export const itemsDataInCart = ( state : RootState ) => state.items.itemsData;

  export default itemSlice.reducer;


