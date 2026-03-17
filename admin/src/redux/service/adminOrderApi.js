import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../api/apiConfig";
import { io } from "socket.io-client";

export const adminOrderApi = createApi({
  reducerPath: "adminOrderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers) => {
      // Get the token from local storage for every request
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    // Fetch orders with support for pagination, search, and status filtering
    getOrders: builder.query({
      query: (params = {}) => {
        /**
         * Extract all necessary filters from the params object.
         * Default values are provided to ensure the API call doesn't fail.
         */
        const { page = 1, limit = 8, search = "", status = "" } = params;

        return {
          url: "/orders/admin/all",
          // Pass all filters as URL query parameters (e.g., ?page=1&search=John&status=Shipped)
          params: { page, limit, search, status },
        };
      },
      providesTags: ["Orders"],

      // Real-time updates via Socket.io
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const socket = io(BASE_URL);

        try {
          // Wait for the initial data to be successfully fetched
          await cacheDataLoaded;

          // Listen for new orders emitted by the server
          socket.on("newOrder", (newOrder) => {
            updateCachedData((draft) => {
              /**
               * Logic for updating the cache instantly:
               * 1. Increment total order count for the UI badges
               * 2. Add the new order to the top of the list (unshift)
               */
              if (draft && typeof draft.totalOrders === "number") {
                draft.totalOrders += 1;
              }

              if (draft?.orders) {
                draft.orders.unshift(newOrder);
              }
            });
          });
        } catch (error) {
          // Error handling for the cache entry (optional)
        }

        // Cleanup: Close the socket connection when the component unmounts or query is removed
        await cacheEntryRemoved;
        socket.close();
      },
    }),

    // Update order status or internal notes
    updateOrder: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/orders/admin/update/${id}`,
        method: "PATCH",
        body: patch,
      }),
      // Refresh the "Orders" cache tag to show updated data in the table
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderMutation } = adminOrderApi;
