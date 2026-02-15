import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout as logoutAction } from "./authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Get token from state
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear local state and reset all API caches
          dispatch(logoutAction());
          dispatch(authApi.util.resetApiState());
        } catch (error) {
          console.error("Logout failed", error);
        }
      },
    }),
  }),
});

export const { useLogoutMutation } = authApi;
