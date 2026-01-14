import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../redux/slices/searchSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    // Onno kono slice thakle ekhane add hobe
  },
});
