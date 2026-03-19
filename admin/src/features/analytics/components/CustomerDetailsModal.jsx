import React from "react";
import { X, ExternalLink, Mail, Calendar, Hash } from "lucide-react";

export const CustomerDetailsModal = ({ isOpen, onClose, customer }) => {
  if (!isOpen || !customer) return null;

  // Safety check for display name
  const displayName =
    customer?.name || customer?.email?.split("@")[0] || "Guest";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-theme-base border border-theme-line w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header Section */}
        <div className="p-8 border-b border-theme-line bg-theme-sub/20 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-theme-act text-white flex items-center justify-center text-xl font-black shadow-lg">
              {firstLetter}
            </div>
            <div>
              <h4 className="text-xl font-black text-theme-front tracking-tight">
                {displayName}
              </h4>
              <span
                className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-md ${
                  !customer.isGuest
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {customer.isGuest ? "Guest Shopper" : "Registered Member"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-line rounded-xl transition-colors text-theme-front"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-theme-sub/30 p-5 rounded-3xl border border-theme-line text-center">
              <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest mb-1">
                Total Orders
              </p>
              <p className="text-2xl font-black text-theme-front tracking-tighter">
                {customer.orderCount || 0}
              </p>
            </div>
            <div className="bg-theme-sub/30 p-5 rounded-3xl border border-theme-line text-center">
              <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-sm font-black text-theme-act uppercase pt-2">
                {customer.orderCount > 5 ? "V.I.P" : "Active"}
              </p>
            </div>
          </div>

          {/* Detailed Info List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-theme-front">
              <div className="p-2 bg-theme-sub/50 rounded-lg text-theme-muted">
                <Mail size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-theme-muted uppercase">
                  Email Address
                </span>
                <span className="text-sm font-bold">
                  {customer.email || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-theme-front">
              <div className="p-2 bg-theme-sub/50 rounded-lg text-theme-muted">
                <Calendar size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-theme-muted uppercase">
                  Customer Since
                </span>
                <span className="text-sm font-bold">
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Recently"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-theme-sub/10 border-t border-theme-line flex gap-3">
          <button className="flex-1 py-4 bg-theme-act text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-theme-act/90 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-theme-act/20">
            View History <ExternalLink size={14} />
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 border border-theme-line text-theme-front rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-theme-base transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
