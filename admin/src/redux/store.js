import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { adminOrderApi } from "./service/adminOrderApi.js";
import { inventoryApi } from "./service/inventoryApi.js";
import { analyticsApi } from "./service/analyticsApi.js";
import authReducer from "./slices/authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminOrderApi.reducerPath]: adminOrderApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminOrderApi.middleware,
      inventoryApi.middleware,
      analyticsApi.middleware,
    ),
});

setupListeners(store.dispatch);
