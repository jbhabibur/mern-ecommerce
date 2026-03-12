import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/apiConfig";
import {
  getAuthUser,
  isSuperAdmin as checkSuperAdmin,
} from "./utils/authUtils";

import {
  UserPlus,
  Mail,
  User,
  Send,
  Clock,
  Trash2,
  RefreshCcw,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

export const InviteAdmin = () => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  // --- AUTH CHECK: Using Decoded Utilities ---
  const currentUser = getAuthUser();
  const isSuperAdmin = checkSuperAdmin();

  // Helper for Headers to include Bearer Token from LocalStorage
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  });

  // --- CONFIGURATION: UI Styles for Account Status ---
  const statusConfig = {
    active: { color: "text-green-600", bg: "bg-green-500", label: "Active" },
    inactive: { color: "text-gray-400", bg: "bg-gray-400", label: "Inactive" },
    suspended: { color: "text-red-600", bg: "bg-red-500", label: "Suspended" },
    pending: { color: "text-amber-600", bg: "bg-amber-500", label: "Pending" },
    deleted: { color: "text-black", bg: "bg-black", label: "Deleted" },
  };

  // --- API CALL: Fetch all staff/invitations ---
  const fetchInvitations = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/all`,
        getAuthHeaders(),
      );
      if (res.data.success) {
        setInvitations(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch staff list", err);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // --- HANDLER: Send initial invitation ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return; // Guard clause
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

  // --- HANDLER: Accept pending invite & send first-time credentials email ---
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

  // --- HANDLER: Update role for existing users & notify via email ---
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

  // --- HANDLER: Resend invitation link ---
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

  // --- HANDLER: Delete Invitation/ Admin ---
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* --- ACCESS WARNING: Shown only to non-super-admins --- */}
      {!isSuperAdmin && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 text-sm">
          <ShieldAlert size={20} />
          <p>
            <strong>View Only Mode:</strong> Only Super Admins can send
            invitations or manage roles.
          </p>
        </div>
      )}

      {/* --- SECTION: Invitation Form --- */}
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-theme-front flex items-center gap-2">
            <UserPlus className="text-theme-act" />
            Invite Staff Member
          </h1>
          <p className="text-theme-muted text-sm mt-1">
            Fill in the details to send a secure invitation to your team member.
          </p>
        </div>

        <div
          className={`bg-theme-base border border-theme-line rounded-2xl shadow-sm overflow-hidden ${!isSuperAdmin ? "opacity-75" : ""}`}
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-muted uppercase ml-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Ex: John Doe"
                  className="w-full pl-9 pr-4 py-2 bg-theme-sub/10 border border-theme-line rounded-xl focus:outline-none focus:border-theme-act text-sm transition-all text-theme-front disabled:cursor-not-allowed"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={!isSuperAdmin}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-muted uppercase ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
                  size={16}
                />
                <input
                  type="email"
                  placeholder="staff@company.com"
                  className="w-full pl-9 pr-4 py-2 bg-theme-sub/10 border border-theme-line rounded-xl focus:outline-none focus:border-theme-act text-sm transition-all text-theme-front disabled:cursor-not-allowed"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={!isSuperAdmin}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-muted uppercase ml-1">
                Initial Role
              </label>
              <select
                className="w-full px-4 py-2 bg-theme-sub/10 border border-theme-line rounded-xl focus:outline-none focus:border-theme-act text-sm capitalize text-theme-front disabled:cursor-not-allowed"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                disabled={!isSuperAdmin}
              >
                <option value="super-admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="stylist">Stylist</option>
                <option value="customer-support">Support</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !isSuperAdmin}
              className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loading || !isSuperAdmin
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-theme-act text-white hover:opacity-90"
              }`}
            >
              {loading ? (
                <Clock className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              {loading ? "Sending..." : "Invite"}
            </button>
          </form>
        </div>
      </section>

      {/* --- SECTION: Table --- */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-theme-front">
            Staff & Invitations
          </h2>
        </div>

        <div className="bg-theme-base border border-theme-line rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
            <thead className="bg-theme-sub/5 border-b border-theme-line">
              <tr>
                <th className="w-[30%] px-6 py-4 text-[11px] font-black uppercase text-theme-muted tracking-widest">
                  Invitee
                </th>
                <th className="w-[20%] px-6 py-4 text-[11px] font-black uppercase text-theme-muted tracking-widest text-center">
                  Role
                </th>
                <th className="w-[25%] px-6 py-4 text-[11px] font-black uppercase text-theme-muted tracking-widest">
                  Status
                </th>
                <th className="w-[25%] px-6 py-4 text-[11px] font-black uppercase text-theme-muted tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-line text-sm">
              {invitations.map((invite) => {
                const status =
                  statusConfig[invite.accountStatus] || statusConfig.pending;
                return (
                  <tr
                    key={invite._id}
                    className="hover:bg-theme-sub/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-theme-front truncate">
                        {invite.name || "New Admin"}
                      </div>
                      <div className="text-xs text-theme-muted truncate">
                        {invite.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        className="bg-theme-sub/10 border border-theme-line rounded px-2 py-1 text-[10px] font-bold uppercase outline-none focus:border-theme-act text-theme-front disabled:cursor-not-allowed"
                        defaultValue={invite.role}
                        disabled={!isSuperAdmin}
                        onChange={(e) =>
                          handleRoleChange(invite._id, e.target.value)
                        }
                      >
                        <option value="super-admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="stylist">Stylist</option>
                        <option value="customer-support">Support</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${status.bg}`}
                          />
                          <span
                            className={`font-black uppercase text-[11px] ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className="text-[10px] text-theme-muted ml-4">
                          {new Date(invite.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={`flex justify-end gap-2 ${!isSuperAdmin ? "opacity-40 pointer-events-none" : ""}`}
                      >
                        {invite.accountStatus === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleAcceptAndNotify(invite._id, invite.role)
                              }
                              disabled={
                                processingId === invite._id || !isSuperAdmin
                              }
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 disabled:bg-gray-400"
                            >
                              {processingId === invite._id ? (
                                <Clock className="animate-spin" size={14} />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              Accept & Notify
                            </button>

                            <button
                              onClick={() => handleResend(invite._id)}
                              disabled={!isSuperAdmin}
                              className="p-2 text-theme-muted hover:text-theme-act cursor-pointer disabled:opacity-50"
                              title="Resend Invitation"
                            >
                              <RefreshCcw size={15} />
                            </button>
                          </>
                        ) : (
                          <div className="px-3 py-1.5 text-[10px] font-bold text-theme-muted uppercase">
                            Setup Complete
                          </div>
                        )}

                        <button
                          onClick={() => handleDelete(invite._id)}
                          disabled={!isSuperAdmin}
                          className="p-2 text-theme-muted hover:text-red-500 disabled:opacity-50"
                          title="Delete/Revoke"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
