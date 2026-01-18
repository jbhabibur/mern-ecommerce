import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../redux/slices/searchSlice";
import cartReducer from "../redux/slices/cartSlice";
import productReducer from "../redux/slices/productSlice"; // NewArrivals এর জন্য এই রিডিউসার ইমপোর্ট করুন
import { productApi } from "../redux/services/productApi";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    // NewArrivals এর ডাটা এখানে থাকবে
    products: productReducer,

    // RTK Query API reducer (আগের মতো থাকবে)
    [productApi.reducerPath]: productApi.reducer,
  },

  // Middleware আগের মতোই থাকবে
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});
