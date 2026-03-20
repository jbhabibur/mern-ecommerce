import Review from "../models/review.model.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/error.middleware.js";

/**
 * @desc    Create a new product review (Pending by default)
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment } = req.body;

  // 1. Create the review
  const review = await Review.create({
    product,
    user: req.user._id,
    rating: Number(rating),
    comment,
    status: "pending", // Reviews stay hidden until admin approves
  });

  res.status(201).json({
    success: true,
    message: "Review submitted! It will appear after admin approval.",
    data: review,
  });
});

/**
 * @desc    Admin: Get all reviews for management
 * @route   GET /api/reviews
 * @access  Private (Admin Only)
 */
export const getAllReviews = asyncHandler(async (req, res) => {
  // Fetch all reviews, populate user info (name, email) and product info (name)
  const reviews = await Review.find({})
    .populate("user", "name email")
    .populate("product", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    data: reviews,
  });
});

/**
 * @desc    Get all APPROVED reviews for a specific product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Only fetch reviews that have been approved by the admin
  const reviews = await Review.find({ product: productId, status: "approved" })
    .populate("user", "name email")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @desc    Admin: Update review status (Approve/Reject) and update Product Analytics
 * @route   PATCH /api/reviews/:id/status
 * @access  Private (Admin Only)
 */
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  const reviewId = req.params.id;

  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // If approving for the first time, update product analytics
  if (status === "approved" && review.status !== "approved") {
    const product = await Product.findById(review.product);

    if (product) {
      const oldReviewCount = product.analytics.reviewCount || 0;
      const oldRating = product.analytics.averageRating || 0;

      // Calculate new average rating
      const newReviewCount = oldReviewCount + 1;
      const newAverageRating =
        (oldRating * oldReviewCount + review.rating) / newReviewCount;

      product.analytics.reviewCount = newReviewCount;
      product.analytics.averageRating = Number(newAverageRating.toFixed(1)); // Keep it to 1 decimal point

      await product.save();
    }
  }

  review.status = status;
  await review.save();

  res.status(200).json({
    success: true,
    message: `Review has been ${status}`,
    data: review,
  });
});

/**
 * @desc    Admin: Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Admin Only)
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // If deleting an already approved review, we must decrease the product analytics
  if (review.status === "approved") {
    const product = await Product.findById(review.product);
    if (product && product.analytics.reviewCount > 0) {
      const oldReviewCount = product.analytics.reviewCount;
      const oldRating = product.analytics.averageRating;

      const newReviewCount = oldReviewCount - 1;
      let newAverageRating = 0;

      if (newReviewCount > 0) {
        newAverageRating =
          (oldRating * oldReviewCount - review.rating) / newReviewCount;
      }

      product.analytics.reviewCount = newReviewCount;
      product.analytics.averageRating = Number(newAverageRating.toFixed(1));
      await product.save();
    }
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
