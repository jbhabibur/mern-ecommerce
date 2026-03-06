import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContext";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 7000 },
];

const orderData = [
  { name: "Shirts", value: 400 },
  { name: "Pants", value: 300 },
  { name: "Shoes", value: 300 },
  { name: "Accessories", value: 200 },
];

export const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const COLORS = isDark
    ? ["#f8fafc", "#cbd5e1", "#94a3b8", "#64748b"] // light colors on dark bg
    : ["#000", "#444", "#777", "#aaa"]; // dark colors on light bg

  const textColor = isDark ? "text-theme-front" : "text-theme-front";
  const mutedColor = isDark ? "text-theme-muted" : "text-theme-muted";
  const cardBg = "bg-theme-sub";
  const cardShadow = isDark
    ? "shadow-lg shadow-black/20"
    : "shadow-md shadow-gray-200";

  return (
    <div className={`p-4 sm:p-6 space-y-6 bg-theme-base min-h-screen`}>
      {/* Title */}
      <h1 className={`text-xl sm:text-2xl font-bold ${textColor}`}>
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className={`${cardBg} ${cardShadow} rounded-xl p-5`}>
          <p className={`text-sm ${mutedColor}`}>Total Revenue</p>
          <h2 className={`text-xl lg:text-2xl font-bold ${textColor}`}>
            $12,450
          </h2>
        </div>

        <div className={`${cardBg} ${cardShadow} rounded-xl p-5`}>
          <p className={`text-sm ${mutedColor}`}>Total Orders</p>
          <h2 className={`text-xl lg:text-2xl font-bold ${textColor}`}>
            1,240
          </h2>
        </div>

        <div className={`${cardBg} ${cardShadow} rounded-xl p-5`}>
          <p className={`text-sm ${mutedColor}`}>Customers</p>
          <h2 className={`text-xl lg:text-2xl font-bold ${textColor}`}>890</h2>
        </div>

        <div className={`${cardBg} ${cardShadow} rounded-xl p-5`}>
          <p className={`text-sm ${mutedColor}`}>Products</p>
          <h2 className={`text-xl lg:text-2xl font-bold ${textColor}`}>120</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className={`${cardBg} ${cardShadow} p-4 sm:p-5 rounded-xl`}>
          <h2
            className={`font-semibold mb-4 text-sm sm:text-base ${textColor}`}
          >
            Monthly Sales
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" stroke={isDark ? "#f8fafc" : "#000"} />
              <YAxis stroke={isDark ? "#f8fafc" : "#000"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1a1a1a" : "#fff",
                  borderColor: isDark ? "#333" : "#e2e8f0",
                  color: isDark ? "#f8fafc" : "#000",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={isDark ? "#3b82f6" : "#000"}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className={`${cardBg} ${cardShadow} p-4 sm:p-5 rounded-xl`}>
          <h2
            className={`font-semibold mb-4 text-sm sm:text-base ${textColor}`}
          >
            Category Distribution
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={orderData} dataKey="value" outerRadius={100} label>
                {orderData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className={`${cardBg} ${cardShadow} p-4 sm:p-5 rounded-xl`}>
        <h2 className={`font-semibold mb-4 text-sm sm:text-base ${textColor}`}>
          Orders Overview
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={salesData}>
            <XAxis dataKey="month" stroke={isDark ? "#f8fafc" : "#000"} />
            <YAxis stroke={isDark ? "#f8fafc" : "#000"} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1a1a1a" : "#fff",
                borderColor: isDark ? "#333" : "#e2e8f0",
                color: isDark ? "#f8fafc" : "#000",
              }}
            />
            <Bar
              dataKey="sales"
              fill={isDark ? "#3b82f6" : "#000"}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
