import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  retryPayment,
  getOrderTracking,
  //  Admin controllers
  getAllOrdersAdmin,
  updateOrderAdmin,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

// --- CUSTOMER / USER ROUTES ---

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private / Public (Depending on auth requirements)
router.post("/", createOrder);

// @desc    Get current user's personal orders
// @route   GET /api/orders/my-orders
// @access  Private (Authenticated Users)
router.get("/my-orders", verifyToken, getUserOrders);

// @desc    Get order tracking status and history
// @route   GET /api/orders/track/:orderId
// @access  Public / Private
router.get("/track/:orderId", getOrderTracking);

// @desc    Retry payment for a failed or pending order
// @route   GET /api/orders/retry-payment/:orderId
// @access  Private (Authenticated Users)
router.get("/retry-payment/:orderId", verifyToken, retryPayment);

// @desc    Get order details by ID (Success Page details)
// @route   GET /api/orders/:id
// @access  Public / Private
// @note    Keep dynamic ID routes below specific static routes like /my-orders or /admin
router.get("/:id", getOrderById);

// --- ADMIN MANAGEMENT ROUTES ---

// @desc    Retrieve paginated orders for the Admin Dashboard
// @route   GET /api/orders/admin/all
// @access  Private (Admin Only)
// @query   ?page=1&limit=8
router.get("/admin/all", verifyToken, getAllOrdersAdmin);

// @desc    Admin can update order status, verification, and internal notes
// @route   PATCH /api/orders/admin/update/:id
// @access  Private (Admin Only)
router.patch("/admin/update/:id", verifyToken, updateOrderAdmin);

export default router;
