import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReviewService,
  getProductReviewsService,
} from "../../../services/reviewService.js";

export const useReviews = (productId) => {
  const queryClient = useQueryClient();

  // Fetching reviews using the service
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviewsService(productId),
    enabled: !!productId,
    // Extracting the review list from our standardized service response
    select: (res) => res.data || [],
  });

  // Mutation for creating a new review
  const createReviewMutation = useMutation({
    mutationFn: createReviewService,
    onSuccess: (res) => {
      if (res.success) {
        // Replaced toast with alert
        alert(res.message);

        // Refresh the list (though new ones are pending, it's good practice)
        queryClient.invalidateQueries(["reviews", productId]);
      } else {
        alert(res.message);
      }
    },
    onError: (err) => {
      // Replaced toast with alert
      alert(err?.message || "Something went wrong");
    },
  });

  return {
    reviews: data || [],
    isLoading,
    isError,
    submitReview: createReviewMutation.mutate,
    isSubmitting: createReviewMutation.isPending,
  };
};
