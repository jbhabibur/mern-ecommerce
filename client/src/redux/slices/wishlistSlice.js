import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../api/apiConfig";

/* ================================
   HELPER: GET TOKEN
================================ */
const getAuthToken = (getState) => {
  // userInfo apnar auth slice theke asche (ProductCard-e userInfo check kora ache)
  return getState().auth.userInfo?.token || getState().auth.token;
};

/* ================================
   ASYNC THUNKS
================================ */

// 1. Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);
      const { data } = await axios.get(`${BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

// 2. Add to Wishlist DB (Aliased to Toggle Route)
export const addToWishlistDB = createAsyncThunk(
  "wishlist/addToWishlistDB",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);
      // ProductCard theke { userId, product } ashche, amra sudhu ID nibo
      const productId = payload.product?._id || payload.productId;

      const { data } = await axios.post(
        `${BASE_URL}/api/wishlist/toggle`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add");
    }
  },
);

// 3. Remove from Wishlist DB (Aliased to Toggle Route)
export const removeFromWishlistDB = createAsyncThunk(
  "wishlist/removeFromWishlistDB",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);
      // ProductCard theke { userId, productId } ashche
      const productId = payload.productId;

      const { data } = await axios.post(
        `${BASE_URL}/api/wishlist/toggle`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove",
      );
    }
  },
);

/* ================================
   INITIAL STATE
=============================== */
const initialState = {
  wishlistItems: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
  status: "idle",
  error: null,
};

/* ================================
   SLICE
================================ */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlistLocal: (state, action) => {
      const exists = state.wishlistItems.find(
        (item) => item._id === action.payload._id,
      );
      if (!exists) {
        state.wishlistItems.push(action.payload);
        localStorage.setItem(
          "wishlistItems",
          JSON.stringify(state.wishlistItems),
        );
      }
    },
    removeFromWishlistLocal: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== action.payload,
      );
      localStorage.setItem(
        "wishlistItems",
        JSON.stringify(state.wishlistItems),
      );
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.status = "idle";
      localStorage.removeItem("wishlistItems");
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH CASES */
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlistItems = action.payload || [];
        localStorage.setItem(
          "wishlistItems",
          JSON.stringify(state.wishlistItems),
        );
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* DB SYNC CASES (Add & Remove) */
      .addMatcher(
        (action) =>
          action.type === addToWishlistDB.fulfilled.type ||
          action.type === removeFromWishlistDB.fulfilled.type,
        (state, action) => {
          state.status = "succeeded";
          // Backend ekhon updated list pathachhe, tai sorasori replace
          state.wishlistItems = action.payload;
          localStorage.setItem(
            "wishlistItems",
            JSON.stringify(state.wishlistItems),
          );
        },
      );
  },
});

export const { addToWishlistLocal, removeFromWishlistLocal, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
