import { useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateOrderMutation } from "../../../redux/service/adminOrderApi";

export const useOrderActions = () => {
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  // Get current admin user details from Redux auth slice
  const { user } = useSelector((state) => state.auth);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setInternalNote(order.internalNote || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder?._id) return;

    try {
      // Automatic verification logic based on status
      const isVerified = ["Confirmed", "Shipped", "Delivered"].includes(
        newStatus,
      )
        ? true
        : selectedOrder.isVerified;

      // Passing the data to the mutation
      // Note: If your backend uses req.user from a JWT token,
      // you don't strictly need to pass 'adminInfo' here, but it's good for logging.
      await updateOrder({
        id: selectedOrder._id,
        orderStatus: newStatus,
        internalNote: internalNote,
        isVerified: isVerified,
        // Optional: Include admin details if your backend doesn't use JWT middleware for identity
        adminName: `${user?.firstName} ${user?.lastName}`,
        adminEmail: user?.email,
      }).unwrap();

      closeModal();

      // Industry standard success feedback
      alert("Order updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.data?.message || "Failed to update order. Please try again.");
    }
  };

  return {
    selectedOrder,
    isModalOpen,
    newStatus,
    setNewStatus,
    internalNote,
    setInternalNote,
    isUpdating,
    openModal,
    closeModal,
    handleSaveChanges,
  };
};
