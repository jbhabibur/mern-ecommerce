import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { adminOrderApi } from "./service/adminOrderApi.js";
import { inventoryApi } from "./service/inventoryApi.js";

export const store = configureStore({
  reducer: {
    [adminOrderApi.reducerPath]: adminOrderApi.reducer,

    [inventoryApi.reducerPath]: inventoryApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminOrderApi.middleware,
      inventoryApi.middleware,
    ),
});

setupListeners(store.dispatch);
