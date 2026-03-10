import React from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { useTopPerformingItems } from "../hooks/useTopPerformingItems";

export const TopPerformingItems = ({ cardStyle }) => {
  // Fetch data directly using the custom hook
  const { data: topItems = [], isLoading, isError } = useTopPerformingItems();
  console.log("hhh", topItems);

  // Skeleton Loader for fetching state
  if (isLoading) {
    return (
      <div className={`${cardStyle} animate-pulse`}>
        <div className="h-4 w-32 bg-theme-line rounded mb-6"></div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex justify-between mb-4 pb-3 border-b border-theme-line"
          >
            <div className="space-y-2">
              <div className="h-3 w-24 bg-theme-line rounded"></div>
              <div className="h-2 w-16 bg-theme-line rounded"></div>
            </div>
            <div className="h-4 w-12 bg-theme-line rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback for Errors
  if (isError) {
    return (
      <div className={cardStyle}>
        <p className="text-xs text-red-500 text-center py-4">
          Failed to load analytics data.
        </p>
      </div>
    );
  }

  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-theme-front flex items-center gap-2">
          <TrendingUp size={16} className="text-green-500" />
          Top Performing Items
        </h3>
        <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest">
          Last 30 Days
        </span>
      </div>

      <div className="space-y-4">
        {topItems.length > 0 ? (
          topItems.map((item, index) => {
            const isLowStock = item.stock < 10;

            return (
              <div
                key={item._id || index}
                className="flex justify-between items-center border-b border-theme-line pb-3 last:border-0 group"
              >
                <div>
                  <p className="font-bold text-theme-front text-sm group-hover:text-blue-500 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-theme-muted font-black uppercase tracking-tighter">
                    {item.unitsSold?.toLocaleString()} units sold
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <p className="text-xs font-black text-theme-front">
                      Stock: {item.stock}
                    </p>
                    {isLowStock && (
                      <span className="text-red-500 text-[9px] font-black uppercase flex items-center gap-1 mt-1 bg-red-500/10 px-1.5 py-0.5 rounded">
                        <AlertTriangle size={10} strokeWidth={3} /> Low
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-theme-muted text-center py-4">
            No sales data available.
          </p>
        )}
      </div>
    </div>
  );
};
