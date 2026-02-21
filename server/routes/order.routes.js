import express from "express";
import { createOrder, getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

/**
 * Route: POST /api/orders
 * Description: Creates a new order
 */
router.post("/", createOrder);

/**
 * @route   GET /api/orders/:id
 * @desc    Fetch order details for the Success Page
 */
router.get("/:id", getOrderById);

export default router;
