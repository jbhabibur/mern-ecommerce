import express from "express";
const router = express.Router();

import {
  getCategory, // This might fetch just category details
  createCategory,
} from "../controllers/categoryController.js";

// Create a new category
router.post("/", createCategory);

// Fetch a single category's details by slug
router.get("/:slug", getCategory);

export default router;
