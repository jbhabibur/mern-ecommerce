import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Initialize size from localStorage if available
  selectedSize:
    typeof window !== "undefined"
      ? localStorage.getItem("selectedSize") || ""
      : "",
  quantity: 1,
  productInfo: null,
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setProductInfo: (state, action) => {
      state.productInfo = action.payload;
    },
    setSize: (state, action) => {
      state.selectedSize = action.payload;
      localStorage.setItem("selectedSize", action.payload);
    },

    setQuantity: (state, action) => {
      state.quantity = Math.max(1, action.payload);
    },

    incrementQuantity: (state) => {
      state.quantity += 1;
    },

    decrementQuantity: (state) => {
      if (state.quantity > 1) {
        state.quantity -= 1;
      }
    },

    resetSelection: (state) => {
      state.selectedSize = "";
      state.selectedSize = "";
      state.quantity = 1;
      localStorage.removeItem("selectedSize");
    },

    clearSize: (state) => {
      state.selectedSize = "";
      localStorage.removeItem("selectedSize");
    },
  },
});

export const {
  setProductInfo,
  setSize,
  clearSize,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  resetSelection,
} = selectionSlice.actions;

export default selectionSlice.reducer;
