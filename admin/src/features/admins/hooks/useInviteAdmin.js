import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../api/apiConfig.js";
import {
  getAuthUser,
  isSuperAdmin as checkSuperAdmin,
} from "../utils/authUtils.js";

export const useInviteAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const currentUser = getAuthUser();
  const isSuperAdmin = checkSuperAdmin();

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
  });

  const fetchInvitations = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/all`,
        getAuthHeaders(),
      );
      if (res.data.success) setInvitations(res.data.data);
    } catch (err) {
      console.error("Failed to fetch staff list", err);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/request-access`,
        { ...formData, isSystemGenerated: true },
        getAuthHeaders(),
      );
      if (res.data.success) {
        alert("Invitation request submitted!");
        setFormData({ name: "", email: "", role: "admin" });
        fetchInvitations();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAndNotify = async (id, finalRole) => {
    if (!isSuperAdmin) return;
    setProcessingId(id);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/accept/${id}`,
        { role: finalRole },
        getAuthHeaders(),
      );
      if (res.data.success) {
        alert("Invitation link sent! User has been notified.");
        fetchInvitations();
      }
    } catch (err) {
      alert("Activation failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    if (!isSuperAdmin) return;
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/admin/update-role/${id}`,
        { role: newRole },
        getAuthHeaders(),
      );
      if (res.data.success) {
        alert(`Role updated to ${newRole}. User notified via email.`);
        fetchInvitations();
      }
    } catch (err) {
      alert("Failed to update role.");
    }
  };

  const handleResend = async (id) => {
    if (!isSuperAdmin) return;
    try {
      await axios.post(
        `${BASE_URL}/api/admin/resend/${id}`,
        {},
        getAuthHeaders(),
      );
      alert("Invitation link resent!");
      fetchInvitations();
    } catch (err) {
      alert("Failed to resend.");
    }
  };

  const handleDelete = async (id) => {
    if (!isSuperAdmin) return;
    if (
      !window.confirm("Are you sure you want to delete this invitation/ admin?")
    )
      return;
    try {
      await axios.delete(
        `${BASE_URL}/api/admin/revoke/${id}`,
        getAuthHeaders(),
      );
      alert("Invitation revoked successfully!.");
      fetchInvitations();
    } catch (err) {
      alert("Failed to revoke.");
    }
  };

  return {
    formData,
    setFormData,
    loading,
    invitations,
    processingId,
    isSuperAdmin,
    handleSubmit,
    handleAcceptAndNotify,
    handleRoleChange,
    handleResend,
    handleDelete,
  };
};
