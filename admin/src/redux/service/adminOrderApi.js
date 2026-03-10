import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../api/apiConfig";

export const adminOrderApi = createApi({
  reducerPath: "adminOrderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    // Updated to accept dynamic parameters for page and limit
    getOrders: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 8 } = params;
        return {
          url: "/orders/admin/all",
          params: { page, limit }, // Appends ?page=X&limit=Y to the URL
        };
      },
      providesTags: ["Orders"],
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/orders/admin/update/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderMutation } = adminOrderApi;
