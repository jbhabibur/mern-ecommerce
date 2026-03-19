import React from "react";
import { Search, Mail, ShoppingBag } from "lucide-react";

export const CustomerTable = ({
  customers = [],
  onDetailClick,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="bg-theme-base border border-theme-line rounded-[2.5rem] overflow-hidden shadow-sm">
      {/* Header Section */}
      <div className="p-8 border-b border-theme-line flex flex-col md:flex-row md:items-center justify-between gap-4 bg-theme-sub/10">
        <div>
          <h3 className="text-xl font-black text-theme-front tracking-tighter uppercase">
            Customer Directory
          </h3>
          <p className="text-[10px] font-bold text-theme-muted uppercase tracking-[0.2em] mt-1">
            Manage {customers.length} active users and guest data
          </p>
        </div>

        {/* Search Input */}
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-theme-act transition-colors"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name or email..."
            className="bg-theme-sub/50 border border-theme-line rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-theme-act w-full md:w-64 transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-theme-sub/30 text-[10px] uppercase tracking-[0.2em] text-theme-muted font-black">
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Orders</th>
              <th className="px-8 py-5">Joined</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-line/40">
            {customers.length > 0 ? (
              customers.map((c) => {
                const displayName =
                  c?.name || c?.email?.split("@")[0] || "Guest";
                const firstLetter = displayName.charAt(0).toUpperCase();

                return (
                  <tr
                    key={c?._id || c?.email}
                    className="hover:bg-theme-act/5 transition-all group"
                  >
                    {/* Customer Info */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-theme-act/10 text-theme-act flex items-center justify-center font-black text-sm shadow-inner">
                          {firstLetter}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-theme-front">
                            {displayName}
                          </span>
                          <span className="text-[11px] text-theme-muted flex items-center gap-1">
                            <Mail size={12} /> {c?.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          !c?.isGuest
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {c?.isGuest ? "Guest" : "Registered"}
                      </span>
                    </td>

                    {/* Order Count Column */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-theme-front">
                        <ShoppingBag size={14} className="text-theme-muted" />
                        <span className="text-sm font-black">
                          {c?.orderCount || 0}
                        </span>
                        <span className="text-[9px] font-bold text-theme-muted uppercase">
                          Orders
                        </span>
                      </div>
                    </td>

                    {/* Date Joined */}
                    <td className="px-8 py-6 text-[11px] font-bold text-theme-front uppercase tracking-tighter">
                      {c?.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    {/* Action Button */}
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => onDetailClick(c)}
                        className="text-[10px] font-black text-theme-act uppercase tracking-widest px-4 py-2 rounded-xl transition-all border border-theme-act/20 hover:bg-theme-act hover:text-white active:scale-95"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <p className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em]">
                    No customers found matching your search
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
