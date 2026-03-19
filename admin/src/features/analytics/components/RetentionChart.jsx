import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981"];

// Optimized Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-theme-base border border-theme-line p-3 rounded-2xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm font-black text-theme-front">
          {payload[0].value}%{" "}
          <span className="text-[9px] text-theme-muted">Share</span>
        </p>
      </div>
    );
  }
  return null;
};

export const RetentionChart = ({ data, rate }) => {
  return (
    <div className="bg-theme-base border border-theme-line p-8 rounded-[2.5rem] shadow-sm relative">
      <h3 className="text-sm font-black text-theme-front uppercase tracking-widest mb-8">
        Retention
      </h3>

      <div className="h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
              nameKey="name"
              stroke="none"
              cx="50%"
              cy="50%"
            >
              {data?.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={COLORS[i % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip />}
              // This makes it follow the mouse cursor dynamically
              isAnimationActive={true}
              // This ensures it stays on top of everything
              wrapperStyle={{ zIndex: 1000 }}
              // This allows the tooltip to float outside the chart container
              allowEscapeViewBox={{ x: true, y: true }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text - pointer-events-none is mandatory to let mouse pass through to the chart */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-3xl font-black text-theme-front tracking-tighter">
            {rate}%
          </span>
          <span className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em] mt-1">
            Returning
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6">
        {data?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span className="text-[9px] font-black text-theme-muted uppercase tracking-widest">
              {item.name}
            </span>
          </div>
        ))}
        a
      </div>
    </div>
  );
};
