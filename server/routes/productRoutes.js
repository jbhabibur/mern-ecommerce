import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import {
  getProductsByCategory,
  getNewArrivals,
  createProduct,
  getSingleProduct,
} from "../controllers/productController.js";
import { validate } from "../middleware/validate.middleware.js";
import { productSchema } from "../validators/product.validator.js";

const router = express.Router();

/** * Multer Configuration
 * 1. Uses the Cloudinary storage logic you defined.
 * 2. Limits file size to 3MB per image.
 */
const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
});

// Public Routes
router.get("/categories/:categoryName", getProductsByCategory);
router.get("/new-arrivals", getNewArrivals);
router.get("/:slug", getSingleProduct);

/**
 * @route   POST /api/product/add
 * @desc    Create product with image upload and validation
 * * Order is critical:
 * 1. upload.array: Parses Multipart data, uploads images to Cloudinary subfolder (using slug).
 * 2. validate: Joi checks the parsed req.body.
 * 3. createProduct: Final database operation.
 */
router.post(
  "/add",
  upload.array("images", 5), // 'images' is the key from frontend, max 5 files
  validate(productSchema), // Validates text fields after Multer parses them
  createProduct,
);

export default router;
