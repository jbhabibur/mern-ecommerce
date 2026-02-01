import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const authDrawerSlice = createSlice({
  name: "authDrawer",
  initialState,
  reducers: {
    openAuthDrawer: (state) => {
      state.isOpen = true;
    },
    closeAuthDrawer: (state) => {
      state.isOpen = false;
    },
    toggleAuthDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openAuthDrawer, closeAuthDrawer, toggleAuthDrawer } =
  authDrawerSlice.actions;
export default authDrawerSlice.reducer;
