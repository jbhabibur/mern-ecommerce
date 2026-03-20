import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useRevenueStats } from "../hooks/useRevenueStats";

export const RevenueChart = ({ cardStyle }) => {
  const { data: chartData, isLoading } = useRevenueStats();

  if (isLoading) {
    return (
      <div
        className={`${cardStyle} flex items-center justify-center h-[450px]`}
      >
        <p className="text-theme-muted animate-pulse">Loading Chart...</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div
        className="border border-theme-line shadow-xl p-3"
        style={{
          backgroundColor: "var(--bg-sub)",
        }}
      >
        <p className="font-bold mb-2 text-theme-front text-sm">{label}</p>

        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 my-1">
            <div style={{ backgroundColor: entry.color }} className="w-2 h-2" />
            <p style={{ color: entry.color }} className="text-xs font-semibold">
              {entry.name}: ৳{entry.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cardStyle}>
      <h3 className="text-sm font-black mb-6 text-theme-front flex items-center gap-2">
        <TrendingUp size={16} className="text-theme-act" />
        Revenue Overview (12 Months)
      </h3>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={28} barGap={-28}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "var(--fg-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />

            <YAxis
              tickFormatter={(v) => `৳${v >= 1000 ? `${v / 1000}k` : v}`}
              tick={{ fill: "var(--fg-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--fg-main)", fillOpacity: 0.05 }}
            />

            {/* Background: Total Revenue (Lighter Blue/Gray) */}
            <Bar
              dataKey="totalRevenue"
              fill="var(--accent)"
              name="Total Revenue"
              radius={0}
              fillOpacity={0.2}
            />

            {/* Foreground: Net Revenue (Solid Blue) */}
            <Bar
              dataKey="netRevenue"
              fill="#2563eb"
              name="Net Revenue"
              radius={0}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
