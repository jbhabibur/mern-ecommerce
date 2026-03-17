import { getIO } from "../config/initSocket.js";
import Notification from "../models/notification.model.js";

/**
 * Sends and saves a real-time socket notification for order events.
 * @param {Object} order - The order document from MongoDB.
 * @param {String} type - Notification type ('NEW_ORDER' or 'PAYMENT_RETRY').
 */
export const emitOrderNotification = async (order, type = "NEW_ORDER") => {
  try {
    // 1. Generate custom message based on type
    const message =
      type === "NEW_ORDER"
        ? `New order placed by ${order.shippingAddress?.fullName || "a customer"}`
        : `Payment retry initiated by ${order.shippingAddress?.fullName || "a customer"}`;

    // 2. Save the notification to MongoDB
    const newNotification = new Notification({
      type,
      message,
      orderId: order._id,
      customerName: order.shippingAddress?.fullName || "N/A",
      amount: order.financials?.totalAmount || 0,
      isRead: false,
    });

    const savedNotification = await newNotification.save();

    // 3. Emit via Socket.io
    // We send the 'savedNotification' object because it contains the DB _id and createdAt timestamp
    const io = getIO();
    io.emit("adminOrderNotification", savedNotification);

    console.log(`📡 Socket & DB [${type}] logged for Order: ${order._id}`);
  } catch (error) {
    console.error("Notification Logic Error:", error.message);
  }
};
