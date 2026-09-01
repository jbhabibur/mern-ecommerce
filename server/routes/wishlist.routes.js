import express from "express";
import {
  toggleWishlist,
  getWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

// @desc    Get current user's wishlist items
// @route   GET /api/wishlist
// @access  Private (Authenticated Users)
router.get("/", verifyToken, getWishlist);

// @desc    Toggle a product in or out of the user's wishlist
// @route   POST /api/wishlist/toggle
// @access  Private (Authenticated Users)
router.post("/toggle", verifyToken, toggleWishlist);

export default router;
