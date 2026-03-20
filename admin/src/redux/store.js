import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Services (RTK Query)
import { adminOrderApi } from "./service/adminOrderApi.js";
import { inventoryApi } from "./service/inventoryApi.js";
import { analyticsApi } from "./service/analyticsApi.js";
import { reviewApi } from "./service/reviewApi.js";

// Slices (Regular Redux)
import authReducer from "./slices/authSlice.js";
import reviewReducer from "./slices/reviewSlice.js";

export const store = configureStore({
  reducer: {
    // Regular Reducers
    auth: authReducer,
    review: reviewReducer,

    // API Reducers
    [adminOrderApi.reducerPath]: adminOrderApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminOrderApi.middleware,
      inventoryApi.middleware,
      analyticsApi.middleware,
      reviewApi.middleware,
    ),
});

setupListeners(store.dispatch);
