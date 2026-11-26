import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { Item } from "@/lib/features/items/items";

/**
 * Normalized Products State
 * 
 * Instead of storing: [{ id: 1, title: "...", price: 100, ...}, { id: 2, ... }]
 * We store: { byId: { "1": { id: 1, ... }, "2": { id: 2, ... } }, allIds: ["1", "2"] }
 * 
 * Benefits:
 * - No duplicate data (cart & products won't have duplicate copies)
 * - O(1) lookup by ID
 * - Easy updates without re-rendering everything
 * - Smaller memory footprint
 */

export interface NormalizedProductsState {
  byId: Record<string, Item>;
  allIds: string[];
  loading: boolean;
  error: string | null;
  lastFetch: number; // Timestamp of last fetch
}

const initialState: NormalizedProductsState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  lastFetch: 0,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Set all products (normalize on receipt)
    setProductsData: (state, action: PayloadAction<Item[]>) => {
      state.loading = false;
      state.error = null;
      state.lastFetch = Date.now();

      // Clear old data
      state.byId = {};
      state.allIds = [];

      // Normalize: convert array to byId object
      action.payload.forEach((item) => {
        state.byId[item.id] = item;
        state.allIds.push(item.id);
      });
    },

    // Update a single product
    updateProduct: (state, action: PayloadAction<Item>) => {
      const product = action.payload;
      if (!state.byId[product.id]) {
        state.allIds.push(product.id);
      }
      state.byId[product.id] = product;
    },

    // Update multiple products
    updateProducts: (state, action: PayloadAction<Item[]>) => {
      action.payload.forEach((product) => {
        if (!state.byId[product.id]) {
          state.allIds.push(product.id);
        }
        state.byId[product.id] = product;
      });
    },

    // Update product stock only
    updateProductStock: (
      state,
      action: PayloadAction<{ id: string; quantity: number[] }>
    ) => {
      const product = state.byId[action.payload.id];
      if (product) {
        product.quantity = action.payload.quantity;
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear all products
    clearProducts: (state) => {
      state.byId = {};
      state.allIds = [];
      state.error = null;
      state.lastFetch = 0;
    },
  },
});

export const {
  setProductsData,
  updateProduct,
  updateProducts,
  updateProductStock,
  setLoading,
  setError,
  clearProducts,
} = productsSlice.actions;

// Selectors
export const selectProductsState = (state: RootState) => state.products;
export const selectAllProductIds = (state: RootState) => state.products.allIds;
export const selectProductsById = (state: RootState) => state.products.byId;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectLastFetch = (state: RootState) => state.products.lastFetch;

// Denormalized selector: Get all products as array
export const selectAllProducts = createSelector(
  (state: RootState) => state.products.byId,
  (state: RootState) => state.products.allIds,
  (byId, allIds) => allIds.map((id) => byId[id])
);

// Get a single product by ID
export const selectProductById = (state: RootState, productId: string): Item | undefined => {
  return state.products.byId[productId];
};

export default productsSlice.reducer;
