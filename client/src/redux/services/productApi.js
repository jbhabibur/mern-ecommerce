import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  // JSON Server er default port 3000 thake
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (builder) => ({
    // Sokoll product fetch korar jonno
    getAllProducts: builder.query({
      query: () => "products",
    }),
    // Title diye filter kore single product anar jonno
    getProductByTitle: builder.query({
      query: (title) => `products?name=${title}`,
      // JSON Server array return kore, tai transform kore single object nite paren
      transformResponse: (response) => response[0],
    }),
  }),
});

export const { useGetAllProductsQuery, useGetProductByTitleQuery } = productApi;
