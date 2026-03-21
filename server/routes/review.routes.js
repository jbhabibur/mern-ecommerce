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
 * @description Public Routes
 */
// Anyone can view approved reviews
router.get("/product/:productId", getProductReviews);

/**
 * @description Private Routes (Requires Login)
 */
// Use verifyToken to populate req.user so createReview can access req.user._id
router.post("/", verifyToken, createReview);

/**
 * @description Admin/Moderation Routes (Requires Login + Role)
 */
// Apply protection to all routes below this line
router.use(verifyToken);
router.use(restrictTo("super-admin", "manager", "editor")); // Adjust roles based on your setup

// GET /api/reviews - Admin management
router.get("/", getAllReviews);

// Update review status (Approve/Reject)
router.patch("/:id/status", updateReviewStatus);

// Delete a review permanently
router.delete("/:id", deleteReview);

export default router;
