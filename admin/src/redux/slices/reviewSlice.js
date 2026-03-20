import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedReview: null,
  filterStatus: "All",
  searchTerm: "",
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    // Set the active review for a modal or edit form
    setSelectedReview: (state, action) => {
      state.selectedReview = action.payload;
    },

    // Update the global filter (e.g., from the filter buttons)
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },

    // Update search term from the search bar
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    // Reset all local review states
    clearReviewState: (state) => {
      state.selectedReview = null;
      state.filterStatus = "All";
      state.searchTerm = "";
    },
  },
});

export const {
  setSelectedReview,
  setFilterStatus,
  setSearchTerm,
  clearReviewState,
} = reviewSlice.actions;

export default reviewSlice.reducer;
