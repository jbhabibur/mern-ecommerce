import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Analytics API Slice
 * This slice manages all dashboard-related data including customer behavior
 * and product sales performance metrics.
 */
export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    // Dynamically sets the base URL from environment variables or defaults to localhost
    baseUrl: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/analytics`,

    // Automatically injects the Auth token into every request header
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token; // Optional chaining for safety
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // Tag types for automated cache invalidation
  tagTypes: ["CustomerInsights", "ProductPerformance"],

  endpoints: (builder) => ({
    /**
     * @desc    Fetch Customer Insights with Pagination
     * @param   {Object} params - Object containing page and limit
     * @returns {Object} Paginated customer data and behavior metrics
     */
    getCustomerInsights: builder.query({
      query: ({ page = 1, limit = 8 }) => ({
        url: "/customer-insights",
        params: { page, limit },
      }),
      providesTags: ["CustomerInsights"],
      keepUnusedDataFor: 300, // Keeps data in cache for 5 minutes
    }),

    /**
     * @desc    Fetch Product Performance (Stats & Chart Data)
     * @returns {Object} Global stats (total/low stock) and bar chart data
     */
    getProductPerformance: builder.query({
      query: () => "/product-performance",
      providesTags: ["ProductPerformance"],
      // Dashboard data is usually more dynamic, so we keep it for 1 minute
      keepUnusedDataFor: 60,
    }),
  }),
});

// Exporting auto-generated hooks based on the defined endpoints
export const { useGetCustomerInsightsQuery, useGetProductPerformanceQuery } =
  analyticsApi;
