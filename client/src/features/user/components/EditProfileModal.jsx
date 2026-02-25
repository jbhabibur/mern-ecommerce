import React from "react";
import { createPortal } from "react-dom";
import { X, Loader2, CheckSquare } from "lucide-react";

export const EditProfileModal = ({
  isOpen,
  onClose,
  editData,
  setEditData,
  onSubmit,
  updating,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content - Width set to max-w-2xl (736px) for a wider feel */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-8 py-3 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Update Profile</h3>
            <p className="text-xs text-gray-500">
              Modify your personal details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body - Scrollbar Hidden via CSS classes */}
        <div className="p-8 overflow-y-auto space-y-6 scrollbar-hide">
          {/* Custom style for hiding scrollbar inside the div */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `,
            }}
          />

          {/* Full Name - Span full width */}
          <ModalInput
            label="Full Name"
            value={editData.fullName}
            onChange={(v) => setEditData({ ...editData, fullName: v })}
            placeholder="John Doe"
          />

          {/* Responsive Grid: 1 column on mobile, 2 on tablets/desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Phone Number"
              value={editData.phone}
              onChange={(v) => setEditData({ ...editData, phone: v })}
              placeholder="+880 1XXX XXXXXX"
            />
            <ModalInput
              label="Birthday"
              type="date"
              value={editData.birthday}
              onChange={(v) => setEditData({ ...editData, birthday: v })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Gender
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-black focus:ring-1 focus:ring-black transition appearance-none cursor-pointer text-sm"
                value={editData.gender}
                onChange={(e) =>
                  setEditData({ ...editData, gender: e.target.value })
                }
              >
                <option value="Select Gender">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Newsletter Toggle - Aligned with grid */}
            <div
              className="flex items-center px-4 py-3.5 gap-2 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all self-end"
              onClick={() =>
                setEditData({
                  ...editData,
                  isSubscribed: !editData.isSubscribed,
                })
              }
            >
              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                  editData.isSubscribed
                    ? "bg-black border-black shadow-lg shadow-black/20"
                    : "bg-white border-gray-300"
                }`}
              >
                {editData.isSubscribed && (
                  <CheckSquare size={16} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 m-0">
                  Newsletter
                </p>
                <p className="text-[10px] text-gray-500 leading-tight m-0">
                  Get trend updates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Responsive buttons */}
        <div className="p-8 border-t flex flex-col sm:flex-row gap-3 bg-gray-50/30">
          <button
            onClick={onClose}
            className="flex-1 order-2 sm:order-1 py-3.5 border border-gray-200 rounded-xl font-semibold bg-white text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={updating}
            className="flex-1 order-1 sm:order-2 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-xl shadow-black/10"
          >
            {updating ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const ModalInput = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-400"
    />
  </div>
);
