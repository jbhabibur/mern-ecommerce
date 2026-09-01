import express from "express";
import {
  getAdminNotifications,
  markAllAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// @desc    Get all admin notifications
// @route   GET /api/notifications
// @access  Private (Admin Only)
router.get("/", getAdminNotifications);

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-read
// @access  Private (Admin Only)
router.patch("/mark-read", markAllAsRead);

export default router;
