import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Async Thunk to fetch all products from API
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/products");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    newArrivals: [],
    activeProduct: null, // Used for StickyPurchaseBar in MainLayout
    isStickyVisible: false, // New state to track scroll visibility globally
    loading: false,
    error: null,
  },
  reducers: {
    // Set the currently viewed product
    setActiveProduct: (state, action) => {
      state.activeProduct = action.payload;
    },
    // Set sticky bar visibility based on scroll
    setStickyVisibility: (state, action) => {
      state.isStickyVisible = action.payload;
    },
    // Clear the active product and reset visibility
    clearActiveProduct: (state) => {
      state.activeProduct = null;
      state.isStickyVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Filter New Arrivals
        state.newArrivals = action.payload.filter(
          (item) => item.isNewArrival === true,
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveProduct, clearActiveProduct, setStickyVisibility } =
  productSlice.actions;

export default productSlice.reducer;
