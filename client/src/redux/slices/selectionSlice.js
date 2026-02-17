import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSize: localStorage.getItem("selectedSize") || "",
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setSize: (state, action) => {
      state.selectedSize = action.payload;
      localStorage.setItem("selectedSize", action.payload);
    },
    clearSize: (state) => {
      state.selectedSize = "";
    },
  },
});

export const { setSize, clearSize } = selectionSlice.actions;
export default selectionSlice.reducer;
