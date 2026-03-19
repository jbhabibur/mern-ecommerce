import React from "react";
import { StatCard } from "./StatCard";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useGetProductPerformanceQuery } from "../../../redux/service/analyticsApi";

export const ProductPerformance = () => {
  // Fetch dynamic data from Redux Toolkit Query
  const { data, isLoading, isError } = useGetProductPerformanceQuery();
  console.log("test", data);

  // Handling Loading State
  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4 text-theme-muted">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-medium animate-pulse">
          Loading performance metrics...
        </p>
      </div>
    );
  }

  // Handling Error State
  if (isError) {
    return (
      <div className="h-96 flex items-center justify-center text-red-500 font-bold">
        Failed to load analytics data. Please try again later.
      </div>
    );
  }

  // Extract data from API response
  const { stats, chartData } = data?.data || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || "0"}
          change="Updated"
          icon={<Package size={22} />}
          color="blue"
        />
        <StatCard
          title="Best Seller Rate"
          value={stats?.bestSellerRate || "0%"}
          change="+Current"
          icon={<TrendingUp size={22} />}
          color="emerald"
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockItems || "0"}
          change={
            Number(stats?.lowStockItems) > 0 ? "Action Required" : "Healthy"
          }
          icon={<AlertTriangle size={22} />}
          color={Number(stats?.lowStockItems) > 0 ? "amber" : "blue"}
        />
        <StatCard
          title="Avg. Daily Sales"
          value={stats?.avgDailySales || "0"}
          change="Last 30 Days"
          icon={<ShoppingBag size={22} />}
          color="purple"
        />
      </div>

      {/* 2. Dynamic Bar Chart Section */}
      <div className="bg-theme-base border border-theme-line p-8 rounded-[32px] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-extrabold text-theme-front">
            Top Selling Products
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Units Sold
          </div>
        </div>

        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={chartData} margin={{ left: -10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--theme-line-chart)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="var(--fg-muted)"
                fontSize={12}
                fontWeight={600}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke="var(--fg-muted)"
                fontSize={12}
                fontWeight={600}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--theme-sub)", opacity: 0.1 }}
                contentStyle={{
                  backgroundColor: "var(--theme-base)",
                  border: "1px solid var(--theme-line)",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                itemStyle={{ color: "var(--theme-front)" }}
              />
              <Bar dataKey="sales" radius={[10, 10, 0, 0]} barSize={55}>
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
