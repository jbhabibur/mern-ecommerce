import express from "express";
import {
  getAdminNotifications,
  markAllAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Route to get notifications (GET /api/notifications)
router.get("/", getAdminNotifications);

// Route to mark all as read (PATCH /api/notifications/mark-read)
router.patch("/mark-read", markAllAsRead);

export default router;
