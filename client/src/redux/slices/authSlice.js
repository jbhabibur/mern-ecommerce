import { createSlice } from "@reduxjs/toolkit";

// Initial state checks localStorage so login persists on refresh
const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAppLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Save to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setAppLoading: (state, action) => {
      state.isAppLoading = action.payload;
    },

    setLogout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { setLogin, setAppLoading, setLogout } = authSlice.actions;
export default authSlice.reducer;
