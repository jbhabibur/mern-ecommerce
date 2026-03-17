import { useState, useEffect } from "react";
import { socket } from "../../../config/socket";
import axios from "axios";

export const useOrderNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from DB on initial load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notifications`,
        );
        if (response.data.success) {
          // Map DB fields to your UI fields if they differ
          const formattedData = response.data.notifications.map((n) => ({
            id: n._id,
            message: n.message,
            time: new Date(n.createdAt).toLocaleString(),
            read: n.isRead,
            amount: n.amount,
            type: n.type,
          }));
          setNotifications(formattedData);
        }
      } catch (error) {
        console.error("Error fetching notifications from DB:", error);
      }
    };

    fetchNotifications();

    // Listen for live socket updates
    socket.on("adminOrderNotification", (data) => {
      const liveNote = {
        id: data._id, // Using DB ID sent via socket
        message: data.message,
        time: "Just now",
        read: data.isRead,
        amount: data.amount,
        type: data.type,
      };

      setNotifications((prev) => [liveNote, ...prev]);
    });

    return () => {
      socket.off("adminOrderNotification");
    };
  }, []);

  // Sync "Mark all read" with the Backend DB
  const markAllRead = async () => {
    try {
      // Optimistic Update: Change UI immediately
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      // Call API to update database
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/notifications/mark-read`,
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return { notifications, markAllRead };
};
