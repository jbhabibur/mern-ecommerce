import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  retryPayment,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

/**
 * Route: POST /api/orders
 * Description: Creates a new order
 */
router.post("/", createOrder);

/**
 * Route: GET /api/orders/my-orders
 * Description: Retrieve all orders belonging to the authenticated user
 */
router.get("/my-orders", verifyToken, getUserOrders);

/**
 * Route: GET /api/orders/retry-payment/:orderId
 * Description: Retry payment for a pending order
 */
router.get("/retry-payment/:orderId", verifyToken, retryPayment);
/**
 * Route: GET /api/orders/:id
 * Description: Fetch order details for the Success Page
 */
router.get("/:id", getOrderById);

export default router;
