import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export const PromoTable = ({ slots, onEdit, onDelete, onActive }) => {
  return (
    <div className="bg-theme-base rounded-2xl shadow-sm border border-theme-line overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-theme-sub/50 border-b border-theme-line">
          <tr>
            <th className="p-5 font-bold text-theme-muted text-xs uppercase tracking-widest">
              Banner & Slot Info
            </th>
            <th className="p-5 font-bold text-theme-muted text-xs uppercase tracking-widest">
              Target Category & Status
            </th>
            <th className="p-5 font-bold text-theme-muted text-xs uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-theme-line">
          {slots.map((slot) => (
            <tr
              key={slot._id}
              onClick={() => onActive(slot.slot_number)}
              className={`group transition-all duration-200 cursor-pointer border-l-4 ${
                slot.isActive
                  ? "border-green-500 bg-white hover:bg-green-50/30"
                  : "border-gray-300 bg-gray-50/50 hover:bg-gray-100"
              }`}
            >
              {/* 1. Banner Image Section */}
              <td className="p-5">
                <div className="relative w-40 overflow-hidden rounded-xl border border-theme-line shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={slot.image?.url || slot.image}
                    className={`w-full h-20 object-cover transition-transform duration-500 group-hover:scale-105 ${
                      !slot.isActive && "grayscale opacity-60"
                    }`}
                    alt="promo"
                  />
                  {slot.title && (
                    <div className="absolute top-2 left-2 shadow-lg">
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold rounded uppercase">
                        {slot.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-theme-base/80 px-2 py-1 text-[10px] font-mono font-bold border-tl border-theme-line">
                    SLOT {slot.slot_number}
                  </div>
                </div>
              </td>

              {/* 2. Category & Status Section */}
              <td className="p-5">
                <div className="flex flex-col gap-2">
                  <span
                    className={`font-bold text-base tracking-tight ${
                      slot.isActive
                        ? "text-theme-success"
                        : "text-theme-muted line-through"
                    }`}
                  >
                    {slot.category?.name || "Unassigned Category"}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        slot.isActive
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-200 text-gray-600 border border-gray-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${slot.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                      />
                      {slot.isActive ? "Active" : "Paused"}
                    </span>

                    <span className="text-[10px] text-theme-muted/50 font-medium italic">
                      Click row to toggle status
                    </span>
                  </div>
                </div>
              </td>

              {/* 3. Actions Section */}
              <td className="p-5 text-right">
                <div className="flex justify-end gap-2 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stops row toggle when clicking Edit
                      onEdit(slot);
                    }}
                    className="p-2.5 hover:bg-theme-act/10 rounded-xl text-theme-muted hover:text-theme-act border border-theme-line hover:border-theme-act/30 transition-all bg-theme-base shadow-sm"
                    title="Edit Promo"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stops row toggle when clicking Delete
                      onDelete(slot.slot_number);
                    }}
                    className="p-2.5 hover:bg-red-50 rounded-xl text-theme-muted hover:text-red-500 border border-theme-line hover:border-red-200 transition-all bg-theme-base shadow-sm"
                    title="Delete Promo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {slots.length === 0 && (
        <div className="p-24 text-center">
          <div className="text-theme-muted text-lg font-medium">
            No banners found.
          </div>
          <p className="text-sm text-theme-muted/60">
            Create a banner to boost category sales.
          </p>
        </div>
      )}
    </div>
  );
};
