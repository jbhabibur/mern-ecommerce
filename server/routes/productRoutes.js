import express from "express";

// Controller Imports
import {
  getProductsByCategory,
  getNewArrivals,
  createProduct,
  getSingleProductBySlug,
  getPopularProducts,
  searchProducts,
} from "../controllers/productController.js";

// Middleware & Validation Imports
import { validate } from "../middleware/validate.middleware.js";
import { productSchema } from "../validators/product.validator.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

/**
 * -----------------------------------------------------------
 * STATIC & QUERY ROUTES (Specific paths first)
 * -----------------------------------------------------------
 */

// @route   GET /api/products/search
router.get("/search", searchProducts);

// @route   GET /api/products/popular
router.get("/popular", getPopularProducts);

// @route   GET /api/products/new-arrivals
router.get("/new-arrivals", getNewArrivals);

/**
 * -----------------------------------------------------------
 * DYNAMIC ROUTES (Parameterized paths)
 * -----------------------------------------------------------
 */

// @route   GET /api/products/categories/:categoryName
router.get("/categories/:categoryName", getProductsByCategory);

// @route   GET /api/products/:slug (KEEP AT THE BOTTOM OF GET REQUESTS)
router.get("/:slug", getSingleProductBySlug);

/**
 * -----------------------------------------------------------
 * POST ROUTES (Admin/Private)
 * -----------------------------------------------------------
 */

// @route   POST /api/products/add
router.post(
  "/add",
  upload.array("images", 5),
  validate(productSchema),
  createProduct,
);

export default router;
