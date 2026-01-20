import express from "express";
const router = express.Router();

import {
  getProductsByCategory, // This is the controller we just refined
  getNewArrivals,
  createBulkProducts,
} from "../controllers/productController.js";

// Fetch category banner, title, and all products belonging to it
// Matches your frontend: /api/products/category/panjabi
router.get("/categories/:categoryName", getProductsByCategory);

// Other product routes
router.get("/new-arrivals", getNewArrivals);
router.post("/bulk", createBulkProducts);

export default router;
