import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { adminOrderApi } from "./service/adminOrderApi.js";

export const store = configureStore({
  reducer: {
    [adminOrderApi.reducerPath]: adminOrderApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminOrderApi.middleware),
});

setupListeners(store.dispatch);
