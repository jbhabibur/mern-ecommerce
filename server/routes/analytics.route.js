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

// Admin-only route for top performing items
router.get("/top-items", getTopPerformingItems);

// @route   GET /api/analytics/kpi-stats
// @desc    Get KPI stats for dashboard
router.get("/kpi-stats", getKpiStats);

// @route   GET /api/analytics/stock-analysis
// @desc    Get only low stock or out of stock products for dashboard
router.get("/stock-analysis", getStockAnalysis);

// @route   GET /api/analytics/customer-insights
// @desc    Get customer insights for dashboard
router.get("/customer-insights", getCustomerInsights);

// @route   GET /api/analytics/product-performance
// @desc    Get product performance stats for dashboard
router.get("/product-performance", getProductPerformanceStats);

// @route   GET /api/analytics/monthly-revenue-stats
// @desc    Get only low stock or out of stock products for dashboard
router.get("/monthly-revenue-stats", getMonthlyRevenueStats);

export default router;
