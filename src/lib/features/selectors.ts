/**
 * Memoized Selectors for Redux Store
 * 
 * Uses reselect library to prevent unnecessary re-renders
 * by memoizing selector results. Only recomputes when inputs change.
 */

import { createSelector } from "reselect";
import { RootState } from "@/lib/store";

// ============================================================================
// PRODUCTS SELECTORS
// ============================================================================

export const selectProductsState = (state: RootState) => state.products;

export const selectAllProductIds = createSelector(
  [(state: RootState) => state.products.allIds],
  (allIds) => allIds
);

export const selectProductsById = createSelector(
  [(state: RootState) => state.products.byId],
  (byId) => byId
);

// Memoized: Get all products as array (only recalculates when byId or allIds change)
export const selectAllProducts = createSelector(
  [
    (state: RootState) => state.products.byId,
    (state: RootState) => state.products.allIds,
  ],
  (byId, allIds) => allIds.map((id) => byId[id]).filter(Boolean)
);

// Memoized: Get product by ID (factory selector)
export const selectProductById = (productId: string) =>
  createSelector(
    [(state: RootState) => state.products.byId[productId]],
    (product) => product
  );

// ============================================================================
// CART SELECTORS
// ============================================================================

export const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  [(state: RootState) => state.cart.items],
  (items) => items
);

// Memoized: Get cart items with full product details
export const selectCartItemsWithDetails = createSelector(
  [
    (state: RootState) => state.cart.items,
    (state: RootState) => state.products.byId,
  ],
  (cartItems, productsById) => {
    return cartItems.map((cartItem) => ({
      ...cartItem,
      productDetails: productsById[cartItem.itemId.toString()],
    }));
  }
);

// Memoized: Calculate cart subtotal
export const selectCartSubtotal = createSelector(
  [(state: RootState) => state.cart.items],
  (items) => items.reduce((total, item) => total + item.price * item.qnt, 0)
);

// Memoized: Get total cart items count
export const selectCartItemsCount = createSelector(
  [(state: RootState) => state.cart.items],
  (items) => items.length
);

// Memoized: Get total quantity in cart
export const selectCartTotalQuantity = createSelector(
  [(state: RootState) => state.cart.items],
  (items) => items.reduce((total, item) => total + item.qnt, 0)
);

// ============================================================================
// USER SELECTORS
// ============================================================================

export const selectUserState = (state: RootState) => state.user;

export const selectUserProfile = createSelector(
  [(state: RootState) => state.user.userProfile],
  (profile) => profile
);

export const selectIsLoggedIn = createSelector(
  [(state: RootState) => state.user.isLoggedIn],
  (isLoggedIn) => isLoggedIn
);

// Memoized: Get user wishlist
export const selectWishlist = createSelector(
  [(state: RootState) => state.user.userProfile?.wishlist || []],
  (wishlist) => wishlist
);

// Memoized: Get user wishlist items count
export const selectWishlistCount = createSelector(
  [(state: RootState) => state.user.userProfile?.wishlist || []],
  (wishlist) => wishlist.length
);

// Memoized: Get user orders
export const selectUserOrders = createSelector(
  [(state: RootState) => state.user.userProfile?.orders || []],
  (orders) => orders
);

// Memoized: Get user delivery address
export const selectUserDeliveryAddress = createSelector(
  [(state: RootState) => state.user.userProfile?.delivery || null],
  (delivery) => delivery
);

// ============================================================================
// FILTERED PRODUCTS SELECTORS (for product listing pages)
// ============================================================================

interface FilterOptions {
  searchQuery?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  size?: string;
  sortBy?: "default" | "rating" | "low" | "high";
}

// Memoized: Filter and sort products
export const selectFilteredProducts = createSelector(
  [
    (state: RootState) => state.products.byId,
    (state: RootState) => state.products.allIds,
    (_state: RootState, filters: FilterOptions) => filters,
  ],
  (byId, allIds, filters) => {
    const sizeIndexMap: Record<string, number> = {
      small: 0,
      medium: 1,
      large: 2,
      xl: 3,
      xxl: 4,
    };

    const results = allIds
      .map((id) => byId[id])
      .filter((item) => {
        // Search filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const titleMatch = item.title.toLowerCase().includes(query);
          const categoryMatch = item.collection.toLowerCase().includes(query);
          if (!titleMatch && !categoryMatch) return false;
        }

        // Category filter
        if (filters.category) {
          if (
            !item.collection
              .toLowerCase()
              .includes(filters.category.toLowerCase())
          ) {
            return false;
          }
        }

        // Rating filter
        if (filters.rating && filters.rating > 0) {
          if (item.review < filters.rating) return false;
        }

        // Price range filter
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          const min = filters.minPrice ?? 0;
          const max = filters.maxPrice ?? Infinity;
          if (item.price < min || item.price > max) return false;
        }

        // Size filter
        if (filters.size && filters.size !== "all") {
          const sizeIdx = sizeIndexMap[filters.size];
          if (sizeIdx === undefined || item.quantity[sizeIdx] <= 0) return false;
        }

        return true;
      });

    // Apply sorting
    switch (filters.sortBy) {
      case "rating":
        results.sort((a, b) => b.review - a.review);
        break;
      case "low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "default":
      default:
        // Keep original order
        break;
    }

    return results;
  }
);

// ============================================================================
// WISHLIST SELECTORS
// ============================================================================

// Memoized: Get wishlist items with product details
export const selectWishlistItemsWithDetails = createSelector(
  [
    (state: RootState) => state.user.userProfile?.wishlist || [],
    (state: RootState) => state.products.byId,
  ],
  (wishlistIds, productsById) => {
    return wishlistIds
      .map((id) => productsById[id])
      .filter((product) => product !== undefined);
  }
);

// Memoized: Check if product is in wishlist
export const selectIsProductInWishlist = (productId: string) =>
  createSelector(
    [(state: RootState) => state.user.userProfile?.wishlist || []],
    (wishlist) => wishlist.includes(productId)
  );
