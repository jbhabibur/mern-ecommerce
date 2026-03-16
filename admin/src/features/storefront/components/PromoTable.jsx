import React from "react";
import { Edit2, Trash2, MousePointerClick } from "lucide-react"; // Added MousePointerClick for better UX
import { useTheme } from "../../../contexts/ThemeContext";

export const PromoTable = ({ slots, onEdit, onDelete, onActive }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`
      w-full overflow-hidden transition-all duration-300
      ${isDark ? "bg-[#1A1A1A]" : "bg-white"}
    `}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`${isDark ? "bg-white/5 border-b border-white/5" : "bg-slate-50 border-b border-slate-100"}`}
            >
              <th className="p-5 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Banner & Slot Info
              </th>
              <th className="p-5 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Target Category & Status
              </th>
              <th className="p-5 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}
          >
            {slots.map((slot) => (
              <tr
                key={slot._id}
                // Toggles status when the entire row is clicked
                onClick={() => onActive(slot.slot_number)}
                className={`
                  group transition-all duration-300 cursor-pointer border-l-4
                  ${
                    slot.isActive
                      ? "border-blue-500 bg-transparent"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }
                  ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}
                `}
              >
                {/* 1. Banner Image Section */}
                <td className="p-5">
                  <div
                    className={`
                    relative w-44 overflow-hidden rounded-2xl border transition-all duration-500
                    ${isDark ? "border-white/10" : "border-slate-200"}
                  `}
                  >
                    <img
                      src={slot.image?.url || slot.image}
                      className={`w-full h-24 object-cover transition-transform duration-700 group-hover:scale-110 ${
                        !slot.isActive && "grayscale blur-[1px]"
                      }`}
                      alt="promo"
                    />

                    {/* Permanent Toggle Message Overlay */}
                    <div className="absolute top-0 right-0 p-2">
                      <div className="bg-blue-600/90 backdrop-blur-sm border border-blue-400/30 px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-500/20 translate-y-0 opacity-100 transition-all">
                        <MousePointerClick size={10} className="text-white" />
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                          Click to toggle
                        </span>
                      </div>
                    </div>

                    {slot.title && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-black rounded-lg uppercase tracking-tighter">
                          {slot.title}
                        </span>
                      </div>
                    )}
                    <div
                      className={`
                      absolute bottom-0 right-0 px-3 py-1.5 text-[10px] font-black tracking-tighter rounded-tl-xl border-t border-l
                      ${isDark ? "bg-[#1A1A1A] text-white border-white/10" : "bg-white text-slate-900 border-slate-100"}
                    `}
                    >
                      SLOT {slot.slot_number}
                    </div>
                  </div>
                </td>

                {/* 2. Category & Status Section */}
                <td className="p-5">
                  <div className="flex flex-col gap-3">
                    <span
                      className={`
                      font-extrabold text-lg tracking-tight transition-all
                      ${
                        slot.isActive
                          ? isDark
                            ? "text-white"
                            : "text-slate-900"
                          : "text-slate-400 line-through"
                      }
                    `}
                    >
                      {slot.category?.name || "Unassigned Category"}
                    </span>

                    <div className="flex items-center gap-3">
                      <span
                        className={`
                        flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
                        ${
                          slot.isActive
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : isDark
                              ? "bg-white/5 text-slate-500 border-white/5"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                        }
                      `}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${slot.isActive ? "bg-blue-500 animate-pulse" : "bg-slate-400"}`}
                        />
                        {slot.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 3. Actions Section */}
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents row click (status toggle) when editing
                        onEdit(slot);
                      }}
                      className={`
                        p-3 rounded-2xl transition-all border
                        ${
                          isDark
                            ? "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                            : "bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-100 shadow-sm"
                        }
                      `}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents row click (status toggle) when deleting
                        onDelete(slot.slot_number);
                      }}
                      className={`
                        p-3 rounded-2xl transition-all border
                        ${
                          isDark
                            ? "bg-red-500/10 border-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                            : "bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-100 shadow-sm"
                        }
                      `}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {slots.length === 0 && (
        <div className="p-32 text-center">
          <p
            className={`text-xl font-bold italic uppercase tracking-widest ${isDark ? "text-white/20" : "text-slate-300"}`}
          >
            No Banners Available
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Initialize your first promo slot to begin.
          </p>
        </div>
      )}
    </div>
  );
};
