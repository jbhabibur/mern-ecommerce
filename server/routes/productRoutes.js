import express from "express";

// Controller Imports
import {
  getProductsByCategory,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProductBySlug,
  getPopularProducts,
  searchProducts,
  getAllProducts,
  getPaginatedProducts,
  getAllUniqueSizes,
  getProductStockAnalysis,
  getStockStats,
} from "../controllers/productController.js";

// Middleware & Validation Imports
import { validate } from "../middleware/validate.middleware.js";
import { productSchema } from "../validators/product.validator.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

/**
 * -----------------------------------------------------------
 * STATIC & QUERY ROUTES
 * -----------------------------------------------------------
 */

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
router.get("/", getAllProducts);

/**
 * @desc    Get products with pagination
 * @route   GET /api/products/paginated
 * @access  Public
 */
router.get("/paginated", getPaginatedProducts);

/**
 * @desc    Search products by keyword
 * @route   GET /api/products/search
 * @access  Public
 */
router.get("/search", searchProducts);

/**
 * @desc    Get most popular products
 * @route   GET /api/products/popular
 * @access  Public
 */
router.get("/popular", getPopularProducts);

/**
 * @desc    Get newly added products
 * @route   GET /api/products/new-arrivals
 * @access  Public
 */
router.get("/new-arrivals", getNewArrivals);

/**
 * -----------------------------------------------------------
 * ADMIN & ANALYTICS ROUTES
 * -----------------------------------------------------------
 */

/**
 * @desc    Get inventory stats (Low Stock and Out of Stock counts)
 * @route   GET /api/products/admin/inventory-stats
 * @access  Admin / Private
 */
router.get("/admin/inventory-stats", getStockStats);

/**
 * @desc    Get list of all unique product sizes
 * @route   GET /api/products/admin/all-sizes
 * @access  Admin / Private
 */
router.get("/admin/all-sizes", getAllUniqueSizes);

/**
 * @desc    Get stock breakdown for a specific product
 * @route   GET /api/products/admin/stock-analysis/:id
 * @access  Admin / Private
 */
router.get("/admin/stock-analysis/:id", getProductStockAnalysis);

/**
 * -----------------------------------------------------------
 * DYNAMIC ROUTES
 * -----------------------------------------------------------
 */

/**
 * @desc    Get products by category name
 * @route   GET /api/products/categories/:categoryName
 * @access  Public
 */
router.get("/categories/:categoryName", getProductsByCategory);

/**
 * @desc    Get product details by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
router.get("/:slug", getSingleProductBySlug);

/**
 * -----------------------------------------------------------
 * WRITE ROUTES (Admin/Private)
 * -----------------------------------------------------------
 */

/**
 * @desc    Create a new product
 * @route   POST /api/products/add
 * @access  Admin / Private
 */
router.post(
  "/add",
  upload.array("images", 5),
  validate(productSchema),
  createProduct,
);

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/update/:id
 * @access  Admin / Private
 */
router.put(
  "/update/:id",
  upload.array("images", 5),
  validate(productSchema),
  updateProduct,
);

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/delete/:id
 * @access  Admin / Private
 */
router.delete("/delete/:id", deleteProduct);

export default router;
