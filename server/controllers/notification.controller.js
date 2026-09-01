import Notification from "../models/notification.model.js";

// @desc    Fetch latest notifications for admin
// @route   GET /api/notifications/admin
// @access  Private/Admin
export const getAdminNotifications = async (req, res) => {
  try {
    // Fetch latest 20 notifications, sorted by newest first
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// @desc    Mark all notifications as read for admin
// @route   PUT /api/notifications/admin/mark-all-read
// @access  Private/Admin
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } },
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
    });
  }
};
