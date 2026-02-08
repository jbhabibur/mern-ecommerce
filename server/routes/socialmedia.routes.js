import express from "express";
import {
  getSocialFeed,
  addSocialFeed,
  deleteSocialFeed,
} from "../controllers/socialmedia.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

// Get all social feed items
router.get("/", getSocialFeed);

/**
 * Handle both Multiple Files and Single URL
 * 'images' must match frontend formData.append("images", ...)
 */
router.post("/", upload.array("images", 10), addSocialFeed);

// Delete specific feed item by ID
router.delete("/:id", deleteSocialFeed);

export default router;
