import express from "express";
const router = express.Router();

import {
  getAllCategory,
  getCategory, // This might fetch just category details
  createCategory,
} from "../controllers/categoryController.js";

// Create a new category
router.post("/", createCategory);

// Fetch all categories
router.post("/all", getAllCategory);

// Fetch a single category's details by slug
router.get("/:slug", getCategory);

export default router;
