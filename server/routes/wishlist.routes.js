import express from "express";
import {
  toggleWishlist,
  getWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

// GET: /api/wishlist
router.get("/", verifyToken, getWishlist);

// POST: /api/wishlist/toggle
router.post("/toggle", verifyToken, toggleWishlist);

export default router;
