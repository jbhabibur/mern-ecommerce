import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Product API slice to handle all product-related server interactions.
 */
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
  }), // Adjust base URL as per your server config
  endpoints: (builder) => ({
    /**
     * Fetches all products from the database.
     */
    getAllProducts: builder.query({
      query: () => "products",
    }),

    /**
     * Fetches a single product by its unique slug.
     * Maps to the backend route: GET /api/products/:slug
     */
    getProductBySlug: builder.query({
      query: (slug) => `products/${slug}`,
      // Extracts the product object from the backend response wrapper { success, data }
      transformResponse: (response) => response.data,
    }),
  }),
});

// Export auto-generated hooks for usage in functional components
export const { useGetAllProductsQuery, useGetProductBySlugQuery } = productApi;
