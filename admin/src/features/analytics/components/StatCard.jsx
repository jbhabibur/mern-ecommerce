import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const StatCard = ({ title, value, change, icon, color = "blue" }) => {
  const isPositive = change?.startsWith("+");
  const isNegative = change?.startsWith("-");

  const colorMap = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="bg-theme-base border border-theme-line p-5 rounded-[2rem] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2.5 rounded-2xl border transition-transform group-hover:scale-110 ${colorMap[color] || colorMap.blue}`}
        >
          {icon}
        </div>

        {change && (
          <div
            className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl border ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : isNegative
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  : "bg-theme-sub/20 text-theme-muted border-theme-line"
            }`}
          >
            {change}
            {isPositive ? (
              <ArrowUpRight size={12} />
            ) : isNegative ? (
              <ArrowDownRight size={12} />
            ) : null}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-theme-muted text-[10px] font-black uppercase tracking-[0.15em]">
          {title}
        </p>
        <h2 className="text-2xl font-black text-theme-front tracking-tighter">
          {value || "0"}
        </h2>
      </div>
    </div>
  );
};
