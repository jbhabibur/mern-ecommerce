import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

// Components
import { RecentActivity } from "./components/RecentActivity";
import { KpiSection } from "./components/KpiSection";
import { TopPerformingItems } from "./components/TopPerformingItems";
import { RevenueChart } from "./components/RevenueChart";
import { StockInventory } from "./components/StockInventory";

/**
 * Dashboard Component
 * Main layout container for the admin analytics suite.
 */
export const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Shared boutique-style card aesthetic
  const cardStyle =
    "bg-theme-sub border border-theme-line rounded-3xl p-6 shadow-sm transition-all duration-300";

  return (
    <div className="p-8 space-y-8 bg-theme-base min-h-screen transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase">
            Men's Fashion Dashboard
          </h1>
          <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
            Real-time Analytics & Store Insights
          </p>
        </div>
      </div>

      {/* KPI METRICS GRID (Net Revenue, Orders, Visitors) */}
      <KpiSection />

      {/* MAIN TREND ANALYSIS: REVENUE OVERVIEW */}
      <RevenueChart isDark={isDark} cardStyle={cardStyle} />

      {/* OPERATIONAL INSIGHTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Inventory Management with Paginated Stock Status */}
        <StockInventory cardStyle={cardStyle} />

        {/* Sales Performance: Best Selling Products */}
        <TopPerformingItems cardStyle={cardStyle} />
      </div>

      {/* TRANSACTIONAL LOG: LATEST ORDERS/ACTIVITY */}
      <RecentActivity />
    </div>
  );
};
