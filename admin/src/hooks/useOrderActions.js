import { useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateOrderMutation } from "../redux/service/adminOrderApi";

export const useOrderActions = () => {
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  // Get current admin user details from Redux auth slice
  const { user } = useSelector((state) => state.auth);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [internalNote, setInternalNote] = useState("");

  /**
   * Opens the modal and populates the current order data
   */
  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setInternalNote(order.internalNote || "");
    setIsModalOpen(true);
  };

  /**
   * Resets local state and closes the modal
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
    setInternalNote("");
  };

  /**
   * Submits the changes to the backend
   */
  const handleSaveChanges = async () => {
    if (!selectedOrder?._id) return;

    try {
      // 1. Automatic verification logic based on status
      // We mark it as verified if it's progressing past the initial stage
      const isVerified = ["Confirmed", "Shipped", "Delivered"].includes(
        newStatus,
      )
        ? true
        : selectedOrder.isVerified;

      // 2. Prepare payload
      const payload = {
        id: selectedOrder._id,
        orderStatus: newStatus,
        internalNote: internalNote,
        isVerified: isVerified,
        // Passing admin details for the backend's history/audit log
        adminName:
          `${user?.firstName || "Admin"} ${user?.lastName || ""}`.trim(),
        adminEmail: user?.email,
      };

      // 3. Trigger RTK Query Mutation
      await updateOrder(payload).unwrap();

      // 4. Close modal on success
      closeModal();

      // [Note] In a production app, you might want to use a toast (like react-hot-toast)
      // instead of a native alert for a better UI experience.
      alert("Order updated successfully!");
    } catch (err) {
      console.error("Order update failed:", err);
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
