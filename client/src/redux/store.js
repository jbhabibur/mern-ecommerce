import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../redux/slices/searchSlice";
import { productApi } from "../redux/services/productApi";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    // API-er reducer-ti add kora holo
    [productApi.reducerPath]: productApi.reducer,
  },
  // Caching ebong invalidation-er jonno middleware dorkar
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});
