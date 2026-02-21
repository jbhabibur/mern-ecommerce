import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; // Used to decode the JWT token

// Function to check if the token is valid and not expired
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // Returns true if token is not expired, false otherwise
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const token = localStorage.getItem("token");
const isValid = isTokenValid(token);

// Initial state validates the token from localStorage on app load
const initialState = {
  isLoggedIn: isValid, // Ensures the user is only logged in if the token is valid
  user: isValid ? JSON.parse(localStorage.getItem("user")) : null,
  token: isValid ? token : null,
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

      // Persist authentication data to localStorage
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
      // Clear all stored data on logout
      localStorage.clear();
    },
  },
});

export const { setLogin, setAppLoading, setLogout } = authSlice.actions;
export default authSlice.reducer;
