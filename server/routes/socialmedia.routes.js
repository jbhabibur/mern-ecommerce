import express from "express";
import {
  getSocialFeed,
  addSocialFeed,
  deleteSocialFeed,
} from "../controllers/socialmedia.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

// @desc    Get all social feed items
// @route   GET /api/socialmedia
// @access  Public
router.get("/", getSocialFeed);

// @desc    Add a new social feed item (Handles both multiple files and single URL)
// @route   POST /api/socialmedia
// @access  Private (Admin Only)
// @note    'images' must match frontend formData.append("images", ...)
router.post("/", upload.array("images", 10), addSocialFeed);

// @desc    Delete a specific social feed item by ID
// @route   DELETE /api/socialmedia/:id
// @access  Private (Admin Only)
router.delete("/:id", deleteSocialFeed);

export default router;
