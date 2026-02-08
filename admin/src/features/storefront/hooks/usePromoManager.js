import { useState, useEffect } from "react";
import {
  getPromoSlots,
  createPromoSlot,
  updatePromoSlot,
  deletePromoSlot,
  togglePromoStatus,
} from "../services/promoService";
import { getCategories } from "../services/categoryService";

export const usePromoManager = () => {
  const [slots, setSlots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initial state updated with slot_number and title
  const emptyForm = {
    slot_number: "",
    image: null,
    imagePreview: "",
    category: "",
    title: "", // Renamed from badgeText to match Mongoose Schema
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const controller = new AbortController();
    fetchSlots();
    fetchCategoriesData(controller.signal);

    return () => controller.abort();
  }, []);

  const fetchCategoriesData = async (signal) => {
    try {
      const data = await getCategories(signal);
      setCategories(data || []);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Failed to fetch categories:", error);
      }
    }
  };

  const fetchSlots = async () => {
    const res = await getPromoSlots();
    if (res.success) {
      setSlots(res.data);
    } else {
      console.error(res.message);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("slot_number", form.slot_number); // Added slotid
    formData.append("category", form.category);
    formData.append("title", form.title); // Changed badgeText to title

    if (form.image) {
      formData.append("image", form.image);
    } else if (form.imagePreview && !form.imagePreview.startsWith("blob:")) {
      formData.append("image", form.imagePreview);
    }

    const isEdit = Boolean(editingSlot?._id);
    let response;

    try {
      if (isEdit) {
        response = await updatePromoSlot(editingSlot._id, formData);
      } else {
        response = await createPromoSlot(formData);
      }

      if (response.success) {
        closeModal();
        fetchSlots();
      } else {
        alert(response.message || "Operation failed");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to want delete?")) return;
    const response = await deletePromoSlot(id);
    if (response.success) {
      fetchSlots();
    } else {
      alert(response.message || "Failed to delete");
    }
  };

  const handleActive = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const response = await togglePromoStatus(id);
    if (response.success) {
      fetchSlots();
    } else {
      alert(response.message || "Failed to delete");
    }
  };

  const handleImage = (file) => {
    if (!file) return;
    if (form.imagePreview && form.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }
    setForm({
      ...form,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const closeModal = () => {
    if (form.imagePreview && form.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }
    setIsModalOpen(false);
    setEditingSlot(null);
    setForm(emptyForm);
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setForm({
      slot_number: slot.slot_number || "", // Populate slotid on edit
      image: null,
      imagePreview: slot.image?.url || slot.image || "",
      category: slot.category?._id || slot.category || "",
      title: slot.title || "", // Populate title
    });
    setIsModalOpen(true);
  };

  return {
    slots,
    categories,
    isModalOpen,
    setIsModalOpen,
    editingSlot,
    loading,
    form,
    setForm,
    handleImage,
    closeModal,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleActive,
  };
};
