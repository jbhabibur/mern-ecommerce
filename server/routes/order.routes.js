import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  retryPayment,
  //  Admin controllers
  getAllOrdersAdmin,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

/** * ==========================================
 * CUSTOMER / USER ROUTES
 * ==========================================
 */

// Route: POST /api/orders (Create Order)
router.post("/", createOrder);

// Route: GET /api/orders/my-orders (User's personal orders)
router.get("/my-orders", verifyToken, getUserOrders);

// Route: GET /api/orders/retry-payment/:orderId
router.get("/retry-payment/:orderId", verifyToken, retryPayment);

// Route: GET /api/orders/:id (Success Page details)
router.get("/:id", getOrderById);

/**
 * ==========================================
 * ADMIN MANAGEMENT ROUTES
 * ==========================================
 */

/**
 * Route: GET /api/orders/admin/all
 * Description: Retrieve paginated orders for the Admin Dashboard or full order management.
 * Query Params: ?page=1&limit=8
 */
router.get("/admin/all", verifyToken, getAllOrdersAdmin);

export default router;
