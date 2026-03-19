import React from "react";
import { Outlet, useLocation } from "react-router-dom";

/**
 * Analytics Layout Component
 * Provides a consistent header and structure for all analytics-related sub-routes.
 */
export const Analytics = () => {
  const location = useLocation();
  const path = location.pathname;

  /**
   * Header Logic: Determines the title and subtitle based on the current active route.
   */
  const getHeaderInfo = () => {
    if (path.includes("products")) {
      return {
        title: "Product Performance",
        subtitle: "Inventory & category-wise sales insights",
      };
    }
    if (path.includes("sales")) {
      return {
        title: "Sales Reports",
        subtitle: "Financial overview and revenue tracking",
      };
    }
    return {
      title: "Customer Analytics",
      subtitle: "Real-time insights and data tracking",
    };
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    /* Main Container: Uses theme variables for background.
       Transition ensures smooth switching between light and dark mode.
    */
    <div className="min-h-screen bg-theme-base p-4 md:p-8 transition-colors duration-300 animate-in fade-in duration-700">
      {/* Header Section: Matches the "MEN'S FASHION DASHBOARD" style from images */}
      <div className="mb-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase">
            {title}
          </h1>
          <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Visual Divider: Subtle line that adapts to the current theme's border color */}
      <div className="h-[1px] w-full bg-theme-line mb-10 opacity-60"></div>

      {/* Dynamic Content Area: Where sub-routes like CustomerInsights are rendered */}
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};
