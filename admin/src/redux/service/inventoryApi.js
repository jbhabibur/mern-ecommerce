import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../api/apiConfig";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers) => {
      // Get the JWT token from localStorage for authentication
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Inventory"],
  endpoints: (builder) => ({
    /**
     * @desc Fetch all unique sizes used in the inventory
     */
    getAllUniqueSizes: builder.query({
      query: () => "/products/admin/all-sizes",
      providesTags: ["Inventory"],
      // Extract just the data array from the response
      transformResponse: (response) => response.data,
    }),

    /**
     * @desc Fetch size and stock analysis for a specific product ID
     */
    getProductStockAnalysis: builder.query({
      query: (productId) => `/products/admin/stock-analysis/${productId}`,
      providesTags: (result, error, id) => [{ type: "Inventory", id }],
      // Extract just the data array for easier chart mapping
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllUniqueSizesQuery, useGetProductStockAnalysisQuery } =
  inventoryApi;
