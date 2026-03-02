import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isQuickViewOpen: false,
  quickViewProduct: null,
};

const productViewSlice = createSlice({
  name: "productView",
  initialState,
  reducers: {
    /**
     * Opens the modal and sets the selected product data.
     * @param {Object} action.payload - The product object to display.
     */
    openQuickView: (state, action) => {
      state.isQuickViewOpen = true;
      state.quickViewProduct = action.payload;
    },
    /**
     * Closes the modal and clears the product data.
     */
    closeQuickView: (state) => {
      state.isQuickViewOpen = false;
      state.quickViewProduct = null;
    },
  },
});

// Export actions to be dispatched from components
export const { openQuickView, closeQuickView } = productViewSlice.actions;

// Export reducer to be added to the store
export default productViewSlice.reducer;
