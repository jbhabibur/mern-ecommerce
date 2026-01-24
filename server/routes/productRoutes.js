import express from "express";
const router = express.Router();

import {
  getProductsByCategory,
  getNewArrivals,
  createBulkProducts,
  getSingleProduct,
} from "../controllers/productController.js";

/**
 * @route   POST /api/bulk
 * @desc    Bulk create products (Internal/Admin use)
 * @access  Private/Admin
 */
router.post("/bulk", createBulkProducts);

/**
 * @route   GET /api/categories/:categoryName
 * @desc    Fetch category details (banner, title) and all associated products
 * @access  Public
 */
router.get("/categories/:categoryName", getProductsByCategory);

/**
 * @route   GET /api/new-arrivals
 * @desc    Retrieve the latest product arrivals
 * @access  Public
 */
router.get("/new-arrivals", getNewArrivals);

/**
 * @route   GET /api/products/:slug
 * @desc    Retrieve details for a single product using its unique slug
 * @access  Public
 */
router.get("/:slug", getSingleProduct);

export default router;
