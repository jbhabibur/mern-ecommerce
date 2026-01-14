import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFocused: false, // Tracks focus state for desktop input
  isClicked: false, // Tracks click state for mobile search icon
  query: "", // Stores the actual search text
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Updates focus state when user clicks into the desktop input
    setFocus: (state, action) => {
      state.isFocused = action.payload;
    },
    // Toggles or sets the visibility of the mobile search bar
    setClicked: (state, action) => {
      state.isClicked = action.payload;
    },
    // Updates the search query string
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
});

export const { setFocus, setClicked, setQuery } = searchSlice.actions;
export default searchSlice.reducer;
