import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../api/apiConfig";

/**
 * Review API Service
 * Handles all server-side interactions for product reviews
 */
export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    // BASE_URL যদি http://localhost:5000 হয়
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    // Fetch all reviews (Admin Panel)
    getAllReviews: builder.query({
      // আপনার ব্যাকএন্ড রাউট যেহেতু /api/reviews
      // তাই এখানে অবশ্যই /api যোগ করতে হবে যদি BASE_URL এ না থাকে
      query: () => "/api/reviews",
      providesTags: ["Review"],
    }),

    // Approve or Reject a review
    updateReviewStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/reviews/${id}/status`, // পাথ ঠিক করা হলো
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Review"],
    }),

    // Delete a review permanently
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/api/reviews/${id}`, // পাথ ঠিক করা হলো
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewApi;
