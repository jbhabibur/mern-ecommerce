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
 * @desc    Create a new category with multiple images
 * @route   POST /api/categories
 * @access  Private (Admin Only)
 */
router.post("/", categoryUploads, createCategory);

/**
 * @desc    Update a specific image (one-by-one) without affecting other fields
 * @route   PATCH /api/categories/:id/update-image
 * @access  Private (Admin Only)
 */
router.patch("/:id/update-image", categoryUploads, updateCategoryImage);

/**
 * @desc    Fetch paginated categories with product counts
 * @route   POST /api/categories/all
 * @access  Public / Private
 */
router.post("/all", getAllCategory);

/**
 * @desc    Fetch lightweight list for dropdowns/admin management
 * @route   GET /api/categories/list-all
 * @access  Public / Private
 */
router.get("/list-all", getCategoryListOnly);

/**
 * @desc    Update text fields or visibility status
 * @route   PATCH /api/categories/:id
 * @access  Private (Admin Only)
 */
router.patch("/:id", updateCategoryStatus);

/**
 * @desc    Fetch single category details and products by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 * @note    Keep dynamic slug routes at the bottom to prevent route conflicts
 */
router.get("/:slug", getCategory);

export default router;
