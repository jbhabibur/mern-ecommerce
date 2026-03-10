import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  CheckCircle,
  Users,
  BarChart3,
} from "lucide-react";
import { KpiCard } from "./KpiCard";
import { useKpiStats } from "../hooks/useKpiStats";

/**
 * Component: KpiSection
 * Displays business metrics including Net Revenue, Total Orders, and Live Visitors.
 */
export const KpiSection = () => {
  const { data: stats, isLoading } = useKpiStats();

  // Internal Live Visitor Simulation
  const [visitors, setVisitors] = useState(240);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors((prev) => prev + (Math.random() > 0.5 ? 2 : -2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-theme-sub rounded-3xl border border-theme-line"
          ></div>
        ))}
      </div>
    );
  }

  const kpiData = [
    {
      id: "net-revenue",
      icon: <DollarSign size={20} />,
      label: "Net Revenue", // Delivered orders total
      value: `৳${(stats?.netRevenue || 0).toLocaleString()}`,
      color: "green",
    },
    {
      id: "total-orders",
      icon: <BarChart3 size={20} />,
      label: "Total Orders", // All orders count
      value: (stats?.totalOrders || 0).toLocaleString(),
      color: "blue",
    },
    {
      id: "orders-today",
      icon: <ShoppingCart size={20} />,
      label: "Orders Today",
      value: stats?.todayOrders || 0,
      color: "purple",
    },
    {
      id: "pending",
      icon: <Package size={20} />,
      label: "Pending Orders",
      value: stats?.pendingOrders || 0,
      color: "orange",
    },
    {
      id: "delivered",
      icon: <CheckCircle size={20} />, // Changed icon for variety
      label: "Delivered",
      value: stats?.deliveredOrders || 0,
      color: "teal",
    },
    {
      id: "visitors",
      icon: <Users size={20} />,
      label: "Visitors Now",
      value: visitors,
      color: "pink", // Differentiated color for live stats
    },
  ];

  return (
    // Changed to lg:grid-cols-6 to accommodate all metrics comfortably
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {kpiData.map((kpi) => (
        <KpiCard
          key={kpi.id}
          icon={kpi.icon}
          label={kpi.label}
          value={kpi.value}
          color={kpi.color}
        />
      ))}
    </div>
  );
};
