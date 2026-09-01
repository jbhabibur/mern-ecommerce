import express from "express";
import {
  createReview,
  getProductReviews,
  updateReviewStatus,
  deleteReview,
  getAllReviews,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { restrictTo } from "../middleware/restrictTo.middleware.js";

const router = express.Router();

/**
 * @desc    Get all approved reviews for a specific product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
router.get("/product/:productId", getProductReviews);

/**
 * @desc    Create a new product review
 * @route   POST /api/reviews
 * @access  Private (Authenticated Users)
 */
router.post("/", verifyToken, createReview);

/**
 * @desc    Admin / Moderation Protection Middleware
 * @access  Private (Super Admin, Manager, Editor)
 */
router.use(verifyToken);
router.use(restrictTo("super-admin", "manager", "editor"));

/**
 * @desc    Get all reviews for admin management dashboard
 * @route   GET /api/reviews
 * @access  Private (Admin / Staff Only)
 */
router.get("/", getAllReviews);

/**
 * @desc    Update review status (Approve or Reject)
 * @route   PATCH /api/reviews/:id/status
 * @access  Private (Admin / Staff Only)
 */
router.patch("/:id/status", updateReviewStatus);

/**
 * @desc    Delete a review permanently
 * @route   DELETE /api/reviews/:id
 * @access  Private (Admin / Staff Only)
 */
router.delete("/:id", deleteReview);

export default router;
