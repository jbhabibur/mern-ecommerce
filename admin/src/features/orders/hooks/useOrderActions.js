import { useState } from "react";
import { useUpdateOrderMutation } from "../../../redux/service/adminOrderApi";

export const useOrderActions = () => {
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

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
      const isVerified =
        newStatus === "Confirmed" ||
        newStatus === "Shipped" ||
        newStatus === "Delivered"
          ? true
          : selectedOrder.isVerified;

      await updateOrder({
        id: selectedOrder._id,
        orderStatus: newStatus,
        internalNote: internalNote,
        isVerified: isVerified,
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
