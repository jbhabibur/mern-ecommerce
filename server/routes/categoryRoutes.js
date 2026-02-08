import express from "express";
const router = express.Router();
import multer from "multer";
import { storage } from "../config/cloudinary.js";

import {
  getAllCategory,
  getCategory,
  createCategory,
  getCategoryListOnly,
  updateCategoryStatus,
  updateCategoryImage, // New controller for individual uploads
} from "../controllers/categoryController.js";

const upload = multer({ storage });

/**
 * Middleware Configuration for Image Fields
 * Defines the specific keys expected from the frontend/FormData
 */
const categoryUploads = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
  { name: "carouselImage", maxCount: 1 },
]);

/**
 * @route   POST /api/categories
 * @desc    Create a new category with multiple images
 */
router.post("/", categoryUploads, createCategory);

/**
 * @route   PATCH /api/categories/:id/update-image
 * @desc    Update a specific image (one-by-one) without affecting other fields
 */
router.patch("/:id/update-image", categoryUploads, updateCategoryImage);

/**
 * @route   POST /api/categories/all
 * @desc    Fetch paginated categories with product counts
 */
router.post("/all", getAllCategory);

/**
 * @route   GET /api/categories/list-all
 * @desc    Fetch lightweight list for dropdowns/admin management
 */
router.get("/list-all", getCategoryListOnly);

/**
 * @route   PATCH /api/categories/:id
 * @desc    Update text fields or visibility status
 */
router.patch("/:id", updateCategoryStatus);

/**
 * @route   GET /api/categories/:slug
 * @desc    Fetch single category details and products by slug
 * @note    Keep dynamic slug routes at the bottom to prevent route conflicts
 */
router.get("/:slug", getCategory);

export default router;
