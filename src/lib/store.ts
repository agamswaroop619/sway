import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/carts/cartSlice';
import wishlistReducer from "./features/wishlist/wishlist";
import userReducer from "../lib/features/user/user"

export const makeStore = () => {
  return configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        user: userReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']