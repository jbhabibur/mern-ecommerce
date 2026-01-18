import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slices/searchSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import { productApi } from "./services/productApi";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    products: productReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

// Sync Cart with Local Storage
store.subscribe(() => {
  try {
    const cartState = store.getState().cart;
    localStorage.setItem("cartData", JSON.stringify(cartState));
  } catch (error) {
    console.error("Local Storage Error:", error);
  }
});

export default store;
