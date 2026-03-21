import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/apiConfig";
import {
  Users,
  Search,
  UserX,
  ShieldCheck,
  Mail,
  MoreVertical,
  AlertCircle,
  Loader2,
} from "lucide-react";
// Import the dynamic hasAccess helper
import { getAuthUser, hasAccess } from "../../utils/authUtils";

export const StaffList = () => {
  // --- STATE MANAGEMENT ---
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // --- AUTH & PERMISSION CHECK ---
  const currentUser = getAuthUser();

  /** * DYNAMIC PERMISSIONS
   * You can easily change who has write access here.
   * Example: allow only 'super-admin' or both 'super-admin' and 'manager'
   */
  const canModify = hasAccess("super-admin");

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  });

  // --- API CALL: Fetch Official Staff ---
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/profile/all-staff`,
        getAuthHeaders(),
      );

      if (res.data.success) {
        const processedStaff = res.data.data
          .filter((s) => s.accountStatus === "active" && s.role !== "customer")
          .sort((a, b) => {
            if (a.role === "super-admin" && b.role !== "super-admin") return -1;
            if (a.role !== "super-admin" && b.role === "super-admin") return 1;
            return 0;
          });

        setStaff(processedStaff);
      }
    } catch (err) {
      console.error("Failed to fetch staff list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // --- HANDLER: Update Staff Role ---
  const handleRoleChange = async (id, newRole) => {
    if (!canModify) return;

    if (id === currentUser?.id) {
      alert("Role changes for your own account are restricted.");
      return;
    }

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/profile/update-role/${id}`,
        { role: newRole },
        getAuthHeaders(),
      );

      if (res.data.success) {
        alert("Staff role updated successfully.");
        fetchStaff();
      }
    } catch (err) {
      alert("Failed to update role.");
    }
  };

  // --- HANDLER: Revoke Staff Access ---
  const handleRemoveStaff = async (id) => {
    // Check if user has permission to delete (maybe only super-admin can delete)
    const canDelete = hasAccess("super-admin");

    if (!canDelete) {
      alert("Only a Super Admin can remove staff members.");
      return;
    }

    if (id === currentUser?.id) {
      alert(
        "Security Alert: Administrative access removal must be performed by another admin.",
      );
      return;
    }

    if (!window.confirm("Are you sure? Access will be revoked immediately."))
      return;

    try {
      await axios.delete(
        `${BASE_URL}/api/profile/delete-user/${id}`,
        getAuthHeaders(),
      );
      alert("Staff removed successfully.");
      fetchStaff();
    } catch (err) {
      alert("Failed to remove staff.");
    }
  };

  // --- CLIENT-SIDE FILTERING ---
  const filteredStaff = useMemo(() => {
    return staff.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [staff, searchTerm]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 bg-theme-base min-h-screen">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase flex items-center gap-2">
            <Users className="text-theme-act" />
            Official Staff Directory
          </h1>
          <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
            {canModify
              ? "Full management control enabled for privileged accounts."
              : "Read-only access granted for standard personnel."}
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
            size={18}
          />
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full pl-10 pr-4 py-2 bg-theme-sub border border-theme-line rounded-xl focus:outline-none focus:border-theme-act text-sm transition-all text-theme-front"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- VIEW ONLY BANNER --- */}
      {!canModify && (
        <div className="flex items-center gap-3 bg-theme-sub/40 border border-theme-line p-4 rounded-xl">
          <AlertCircle className="text-amber-500 shrink-0" size={20} />
          <p className="text-sm text-theme-front">
            <span className="font-bold text-amber-500">View Only Mode:</span>{" "}
            You can view the directory but do not have permission to modify
            data.
          </p>
        </div>
      )}

      {/* --- STAFF DATA TABLE --- */}
      <div className="bg-theme-base border border-theme-line rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
            <thead className="bg-theme-sub border-b border-theme-line text-[11px] font-black uppercase text-theme-muted tracking-widest">
              <tr>
                <th className="w-[35%] px-6 py-4">Staff Member</th>
                <th className="w-[25%] px-6 py-4 text-center">Current Role</th>
                <th className="w-[20%] px-6 py-4 text-center">
                  Account Status
                </th>
                <th className="w-[20%] px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-line text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-theme-muted"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Loader2
                        className="animate-spin text-theme-act"
                        size={24}
                      />
                      <span className="italic">
                        Synchronizing staff data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-theme-sub/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-theme-act/10 flex items-center justify-center text-theme-act font-bold border border-theme-act/20">
                          {member.name?.charAt(0) || "U"}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-theme-front flex items-center gap-1">
                            {member.name}
                            {member.role === "super-admin" && (
                              <ShieldCheck
                                size={14}
                                className="text-blue-500"
                              />
                            )}
                          </div>
                          <div className="text-xs text-theme-muted flex items-center gap-1">
                            {member.email} <Mail size={12} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        className="bg-theme-sub border border-theme-line rounded-lg px-2 py-1 text-[11px] font-bold uppercase outline-none focus:border-theme-act text-theme-front disabled:opacity-50 disabled:cursor-not-allowed mx-auto block"
                        defaultValue={member.role}
                        disabled={!canModify || member._id === currentUser?.id}
                        onChange={(e) =>
                          handleRoleChange(member._id, e.target.value)
                        }
                      >
                        <option value="super-admin">Super Admin</option>
                        <option value="manager">Manager</option>
                        <option value="editor">Editor</option>
                        <option value="stylist">Stylist</option>
                        <option value="customer-support">Support</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-theme-success/10 text-theme-success rounded-full text-[10px] font-black uppercase border border-theme-success/20">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={`flex justify-end gap-2 ${
                          !canModify || member._id === currentUser?.id
                            ? "opacity-20 pointer-events-none grayscale"
                            : ""
                        }`}
                      >
                        <button
                          onClick={() => handleRemoveStaff(member._id)}
                          className="p-2 text-theme-muted hover:text-theme-error hover:bg-theme-error/10 transition-all rounded-lg"
                        >
                          <UserX size={18} />
                        </button>
                        <button className="p-2 text-theme-muted">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-theme-muted"
                  >
                    No matching staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
