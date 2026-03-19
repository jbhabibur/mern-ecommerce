import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const GrowthChart = ({ data }) => (
  <div className="lg:col-span-2 bg-theme-base border border-theme-line p-8 rounded-[2.5rem] shadow-sm">
    <h3 className="text-sm font-black text-theme-front uppercase tracking-widest mb-8 flex items-center gap-2">
      <div className="w-1 h-4 bg-theme-act rounded-full"></div> Growth Analysis
    </h3>
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-theme-line)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-theme-muted)" }}
          />
          <YAxis
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-theme-muted)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-theme-base)",
              border: "1px solid var(--color-theme-line)",
              borderRadius: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="new"
            stroke="#3b82f6"
            fill="url(#colorNew)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
