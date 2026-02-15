import express from "express";

// Controller Imports
import {
  getProductsByCategory,
  getNewArrivals,
  createProduct,
  getSingleProductBySlug,
  getPopularProducts,
} from "../controllers/productController.js";

// Middleware & Validation Imports
import { validate } from "../middleware/validate.middleware.js";
import { productSchema } from "../validators/product.validator.js";

const router = express.Router();

/**
 * -----------------------------------------------------------
 * MULTER CONFIGURATION
 * -----------------------------------------------------------
 * 1. Storage: Uses Cloudinary configuration.
 * 2. File Size Limit: 3MB per file.
 */
import upload from "../middleware/multer.middleware.js";

/**
 * -----------------------------------------------------------
 * PRODUCT ROUTES
 * -----------------------------------------------------------
 */

// @route   GET /api/products/categories/:categoryName
// @desc    Retrieve products by category name
router.get("/categories/:categoryName", getProductsByCategory);

// @route   GET /api/products/new-arrivals
// @desc    Retrieve recently added products
router.get("/new-arrivals", getNewArrivals);

// @route   GET /api/products/popular
// @desc    Retrieve trending/popular products
router.get("/popular", getPopularProducts);

// @route   GET /api/products/:slug
// @desc    Retrieve a single product details by slug
router.get("/:slug", getSingleProductBySlug);

/**
 * @route   POST /api/products/add
 * @desc    Create a new product with multiple images
 * @access  Private/Admin
 * Logic:
 * 1. upload.array parses multipart data and sends to Cloudinary.
 * 2. validate checks the req.body against the Joi schema.
 */
router.post(
  "/add",
  upload.array("images", 5),
  validate(productSchema),
  createProduct,
);

export default router;
