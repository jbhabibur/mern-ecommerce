import React from "react";
import { useInviteAdmin } from "./hooks/useInviteAdmin";
import {
  UserPlus,
  Mail,
  User,
  Send,
  Clock,
  Trash2,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
// Import the dynamic access utility
import { hasAccess } from "../../utils/authUtils";

export const InviteAdmin = () => {
  const {
    formData,
    setFormData,
    loading,
    invitations,
    processingId,
    handleSubmit,
    handleAcceptAndNotify,
    handleRoleChange,
    handleResend,
    handleDelete,
  } = useInviteAdmin();

  /** * DYNAMIC PERMISSION CHECK
   * We check if the user is a super-admin.
   * Only super-admins can interact with the invitation system.
   */
  const canManageInvitations = hasAccess("super-admin");

  // Updated Status Config to use Theme-compliant semantic colors
  const statusConfig = {
    active: {
      color: "text-theme-success",
      bg: "bg-theme-success",
      label: "Active",
    },
    inactive: {
      color: "text-theme-muted",
      bg: "bg-theme-muted",
      label: "Inactive",
    },
    suspended: {
      color: "text-theme-error",
      bg: "bg-theme-error",
      label: "Suspended",
    },
    pending: { color: "text-theme-act", bg: "bg-theme-act", label: "Pending" },
    deleted: {
      color: "text-theme-front",
      bg: "bg-theme-front",
      label: "Deleted",
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 bg-theme-base min-h-screen">
      {/* --- INVITATION FORM SECTION --- */}
      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase flex items-center gap-2">
            <UserPlus className="text-theme-act" size={28} />
            Invite Staff Member
          </h1>
          <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
            Fill in the details to send a secure invitation to your team member.
          </p>
        </div>

        {/* --- VIEW ONLY BANNER (Styled to match StaffList) --- */}
        {!canManageInvitations && (
          <div className="flex items-center gap-3 bg-theme-sub/40 border border-theme-line p-4 rounded-xl mb-6">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-sm text-theme-front">
              <span className="font-bold text-amber-500">View Only Mode:</span>{" "}
              You can view the invitations but do not have permission to modify
              data or send new invites.
            </p>
          </div>
        )}

        <div
          className={`bg-theme-base border border-theme-line rounded-2xl shadow-sm overflow-hidden transition-opacity ${
            !canManageInvitations ? "opacity-60 grayscale-[0.5]" : ""
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            {/* Name Input */}
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
                  className="w-full pl-9 pr-4 py-2 bg-theme-sub/20 border border-theme-line rounded-xl focus:outline-none focus:border-theme-act text-sm transition-all text-theme-front disabled:cursor-not-allowed"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={!canManageInvitations}
                />
              </div>
            </div>

            {/* Email Input */}
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
                  className="w-full pl-9 pr-4 py-2 bg-theme-sub/20 border border-theme-line rounded-xl focus:outline-none focus:border-theme-act text-sm transition-all text-theme-front disabled:cursor-not-allowed"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={!canManageInvitations}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-muted uppercase ml-1">
                Initial Role
              </label>
              <select
                className="w-full px-4 py-2 bg-theme-sub/20 border border-theme-line rounded-xl focus:outline-none focus:border-theme-act text-sm capitalize text-theme-front disabled:cursor-not-allowed"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                disabled={!canManageInvitations}
              >
                <option value="super-admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="stylist">Stylist</option>
                <option value="customer-support">Support</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !canManageInvitations}
              className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loading || !canManageInvitations
                  ? "bg-theme-line text-theme-muted cursor-not-allowed"
                  : "bg-theme-act text-white hover:opacity-90 shadow-lg shadow-theme-act/20"
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

      {/* --- INVITATIONS LIST SECTION --- */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-theme-front">
            Recent Staff Invitations
          </h2>
          <span className="text-[10px] font-bold px-2 py-1 bg-theme-sub rounded-md text-theme-muted border border-theme-line">
            {invitations.length} TOTAL
          </span>
        </div>

        <div className="bg-theme-base border border-theme-line rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
            <thead className="bg-theme-sub border-b border-theme-line">
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
              {invitations.length > 0 ? (
                invitations.map((invite) => {
                  const status =
                    statusConfig[invite.accountStatus] || statusConfig.pending;
                  return (
                    <tr
                      key={invite._id}
                      className="hover:bg-theme-sub/30 transition-colors group"
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
                          className="bg-theme-sub border border-theme-line rounded px-2 py-1 text-[10px] font-bold uppercase outline-none focus:border-theme-act text-theme-front disabled:cursor-not-allowed mx-auto block"
                          defaultValue={invite.role}
                          disabled={!canManageInvitations}
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
                              className={`w-2 h-2 rounded-full ${status.bg} shadow-sm shadow-black/20`}
                            />
                            <span
                              className={`font-black uppercase text-[11px] ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </div>
                          <div className="text-[10px] text-theme-muted ml-4 opacity-60">
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className={`flex justify-end gap-2 ${
                            !canManageInvitations
                              ? "opacity-20 pointer-events-none"
                              : ""
                          }`}
                        >
                          {invite.accountStatus === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleAcceptAndNotify(invite._id, invite.role)
                                }
                                disabled={
                                  processingId === invite._id ||
                                  !canManageInvitations
                                }
                                className="flex items-center gap-1 px-3 py-1.5 bg-theme-success text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:bg-theme-line transition-all"
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
                                disabled={!canManageInvitations}
                                className="p-2 text-theme-muted hover:text-theme-act cursor-pointer disabled:opacity-50 transition-colors"
                                title="Resend Invitation"
                              >
                                <RefreshCcw size={15} />
                              </button>
                            </>
                          ) : (
                            <div className="px-3 py-1.5 text-[10px] font-black text-theme-success uppercase bg-theme-success/10 rounded-lg border border-theme-success/20">
                              Setup Complete
                            </div>
                          )}
                          <button
                            onClick={() => handleDelete(invite._id)}
                            disabled={!canManageInvitations}
                            className="p-2 text-theme-muted hover:text-theme-error disabled:opacity-50 transition-colors"
                            title="Delete/Revoke"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-theme-muted"
                  >
                    No pending invitations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
