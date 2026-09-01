import express from "express";
import {
  getTopPerformingItems,
  getKpiStats,
  getStockAnalysis,
  getMonthlyRevenueStats,
  getCustomerInsights,
  getProductPerformanceStats,
} from "../controllers/analytics.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";

const router = express.Router();

// @desc    Get top performing items for admin dashboard
// @route   GET /api/analytics/top-items
// @access  Private (Admin Only)
router.get("/top-items", verifyToken, verifyAdmin, getTopPerformingItems);

// @desc    Get KPI stats for admin dashboard
// @route   GET /api/analytics/kpi-stats
// @access  Private (Admin Only)
router.get("/kpi-stats", verifyToken, verifyAdmin, getKpiStats);

// @desc    Get low stock or out of stock products for dashboard analysis
// @route   GET /api/analytics/stock-analysis
// @access  Private (Admin Only)
router.get("/stock-analysis", verifyToken, verifyAdmin, getStockAnalysis);

// @desc    Get customer insights for admin dashboard
// @route   GET /api/analytics/customer-insights
// @access  Private (Admin Only)
router.get("/customer-insights", verifyToken, verifyAdmin, getCustomerInsights);

// @desc    Get product performance stats for admin dashboard
// @route   GET /api/analytics/product-performance
// @access  Private (Admin Only)
router.get(
  "/product-performance",
  verifyToken,
  verifyAdmin,
  getProductPerformanceStats,
);

// @desc    Get monthly revenue stats for admin dashboard
// @route   GET /api/analytics/monthly-revenue-stats
// @access  Private (Admin Only)
router.get(
  "/monthly-revenue-stats",
  verifyToken,
  verifyAdmin,
  getMonthlyRevenueStats,
);

export default router;
