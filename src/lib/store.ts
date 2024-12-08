import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/carts/cartSlice';
import userReducer from "../lib/features/user/user";
import itemReducer from '../lib/features/items/items';
import checkoutreducer from '../lib/features/checkout/checkout'

export const makeStore = () => {
  return configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
        items: itemReducer,
        checkout: checkoutreducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']