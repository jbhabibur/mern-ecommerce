import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  retryPayment,
  //  Admin controllers
  getAllOrdersAdmin,
  updateOrderAdmin,
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

/** * ==========================================
 * ADMIN MANAGEMENT ROUTES
 * ==========================================
 */

/**
 * Route: GET /api/orders/admin/all
 * Description: Fetch all orders for the Admin Dashboard
 */
router.get("/admin/all", verifyToken, getAllOrdersAdmin);

/**
 * Route: PATCH /api/orders/admin/update/:id
 * Description: Admin updates order status or internal notes
 */
router.patch("/admin/update/:id", verifyToken, updateOrderAdmin);

export default router;
