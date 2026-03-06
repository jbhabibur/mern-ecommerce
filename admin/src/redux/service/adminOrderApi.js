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
    getOrders: builder.query({
      // Matches: GET /api/orders/admin/all
      query: () => "/orders/admin/all",
      providesTags: ["Orders"],
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...patch }) => ({
        // Matches: PATCH /api/orders/admin/update/:id
        url: `/orders/admin/update/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderMutation } = adminOrderApi;
