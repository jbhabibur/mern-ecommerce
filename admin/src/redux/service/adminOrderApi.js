import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../api/apiConfig";
import { io } from "socket.io-client";

export const adminOrderApi = createApi({
  reducerPath: "adminOrderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers) => {
      // Inject authentication token into headers for secured admin routes
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    /**
     * Fetch orders with support for pagination, search, and status filtering.
     * Includes real-time cache management via Socket.io.
     */
    getOrders: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 8, search = "", status = "" } = params;
        return {
          url: "/orders/admin/all",
          params: { page, limit, search, status },
        };
      },
      providesTags: ["Orders"],

      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // Initialize socket connection to the base server URL
        const socket = io(BASE_URL);

        try {
          // Ensure we don't manipulate cache until the initial fetch is complete
          await cacheDataLoaded;

          /**
           * HANDLE NEW ORDER NOTIFICATIONS
           * Listens to 'adminOrderNotification' emitted by the backend notification logic.
           * Manually constructs a partial order object to update the UI immediately.
           */
          socket.on("adminOrderNotification", (notification) => {
            updateCachedData((draft) => {
              if (draft?.orders) {
                // Prevent duplicate entries if the order already exists in the local cache
                const exists = draft.orders.find(
                  (o) => o._id === notification.orderId,
                );

                if (!exists) {
                  // Construct a mock order object to maintain UI consistency
                  const newLiveOrder = {
                    _id: notification.orderId,
                    customer: { email: "New Order" }, // Placeholder for real-time display
                    shippingAddress: { fullName: notification.customerName },
                    financials: { totalAmount: notification.amount },
                    orderStatus: "Order Placed",
                    createdAt: new Date().toISOString(),
                  };

                  // Insert the new order at the beginning of the list
                  draft.orders.unshift(newLiveOrder);

                  // Increment total order count for accurate pagination metadata
                  if (draft.pagination) {
                    draft.pagination.totalOrders += 1;
                  }

                  // Maintain fixed page limit (e.g., 8) by removing the oldest entry in the current view
                  if (draft.orders.length > 8) {
                    draft.orders.pop();
                  }
                }
              }
            });
          });

          /**
           * HANDLE FULL ORDER OBJECTS
           * Standard listener for when the backend emits the full 'order' document.
           */
          socket.on("newOrder", (newOrder) => {
            updateCachedData((draft) => {
              if (draft?.orders) {
                const exists = draft.orders.find((o) => o._id === newOrder._id);
                if (!exists) {
                  draft.orders.unshift(newOrder);

                  if (draft.pagination) {
                    draft.pagination.totalOrders += 1;
                  }

                  if (draft.orders.length > (arg.limit || 8)) {
                    draft.orders.pop();
                  }
                }
              }
            });
          });

          /**
           * HANDLE STATUS UPDATES
           * Syncs changes (e.g., 'Processing' to 'Shipped') across all open admin tabs.
           */
          socket.on("orderUpdated", (updatedOrder) => {
            updateCachedData((draft) => {
              if (draft?.orders) {
                const index = draft.orders.findIndex(
                  (o) => o._id === updatedOrder._id,
                );
                if (index !== -1) {
                  draft.orders[index] = updatedOrder;
                }
              }
            });
          });
        } catch (error) {
          console.error("Socket.io Cache Sync Error:", error);
        }

        // Cleanup: Close socket connection when the component unmounts or cache is invalidated
        await cacheEntryRemoved;
        socket.close();
      },
    }),

    /**
     * Mutation to update order status, tracking, or notes.
     * Invalidates 'Orders' tag to trigger a background refetch for data integrity.
     */
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
