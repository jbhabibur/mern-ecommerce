import React from "react";
import {
  BarChart3,
  ShoppingCart,
  Eye,
  Star,
  MessageSquare,
  Zap,
} from "lucide-react";

export const ProductAnalytics = ({ formData, setFormData }) => {
  // 1. Internal function to calculate popularity score
  // Uses a weighted formula: (Sales * 10) + (Views * 1) + (Rating * Reviews)
  const calculateScore = (data) => {
    const sales = Number(data.totalSales) || 0;
    const views = Number(data.totalViews) || 0;
    const reviews = Number(data.reviewCount) || 0;
    const rating = Number(data.averageRating) || 0;

    return Math.round(sales * 10 + views * 1 + rating * reviews);
  };

  const handleAnalyticsChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : Number(value);

    setFormData((prev) => {
      // Create a fresh object with the new input value
      const updatedAnalytics = {
        ...prev.analytics,
        [name]: numericValue,
      };

      // Automatically update popularityScore based on the new data
      updatedAnalytics.popularityScore = calculateScore(updatedAnalytics);

      return {
        ...prev,
        analytics: updatedAnalytics,
      };
    });
  };

  const metrics = [
    {
      label: "Total Sales",
      name: "totalSales",
      icon: <ShoppingCart className="w-4 h-4 text-emerald-500" />,
    },
    {
      label: "Total Views",
      name: "totalViews",
      icon: <Eye className="w-4 h-4 text-blue-500" />,
    },
    {
      label: "Reviews",
      name: "reviewCount",
      icon: <MessageSquare className="w-4 h-4 text-purple-500" />,
    },
    {
      label: "Avg Rating",
      name: "averageRating",
      icon: <Star className="w-4 h-4 text-amber-500" />,
      step: "0.1",
      max: "5",
    },
    {
      label: "Popularity",
      name: "popularityScore",
      icon: <Zap className="w-4 h-4 text-orange-500" />,
      isReadOnly: true, // This field is now fully automated
    },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-4">
        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" /> Performance
          Analytics
        </h2>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((item) => (
          <div key={item.name} className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              {item.icon} {item.label}
            </label>
            <input
              type="number"
              name={item.name}
              value={formData.analytics?.[item.name] ?? ""}
              onChange={handleAnalyticsChange}
              readOnly={item.isReadOnly} // Restricts manual input for popularity
              placeholder="0"
              step={item.step || "1"}
              min="0"
              max={item.max}
              className={`w-full border p-3 rounded-xl outline-none transition-all font-mono text-sm ${
                item.isReadOnly
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-50/50 border-gray-100 focus:ring-2 focus:ring-indigo-500"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
