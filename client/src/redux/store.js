import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slices/searchSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import authDrawerReducer from "./slices/authDrawerSlice";
import authReducer from "./slices/authSlice";
import selectionReducer from "./slices/selectionSlice";

/**
 * Redux Store Configuration
 * Standardized global state management for local UI states.
 * Server state is now handled separately by React Query.
 */
export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    products: productReducer,
    authDrawer: authDrawerReducer,
    auth: authReducer,
    selection: selectionReducer,
  },
  // Default middleware is sufficient since we removed RTK Query
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

/**
 * Persistence Logic: Sync Cart with Local Storage
 * Ensures cart data persists across browser sessions.
 */
store.subscribe(() => {
  try {
    const cartState = store.getState().cart;
    localStorage.setItem("cartData", JSON.stringify(cartState));
  } catch (error) {
    console.error("Local Storage Error:", error);
  }
});

export default store;
