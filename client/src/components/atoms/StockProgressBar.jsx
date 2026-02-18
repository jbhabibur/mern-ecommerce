import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const StockProgressBar = ({ stockLimit = 50, currentStock = 10 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Capping logic: Max 100% er beshi hobe na
      const percentage = (currentStock / stockLimit) * 100;
      setProgress(Math.min(percentage, 100));
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStock, stockLimit]);

  // 2. Smart Color Logic
  const getBarColor = () => {
    if (progress <= 20) return "bg-red-600";
    if (progress <= 50) return "bg-orange-400";
    return "bg-green-500";
  };

  return (
    <div className="w-full max-w-xs my-4">
      {/* 3. Smart Message Logic */}
      <p
        className={`font-medium mb-2 text-sm! ${progress <= 20 ? "text-red-600" : "text-gray-700"}`}
      >
        {currentStock > stockLimit
          ? "Plenty of stock available"
          : `Only ${currentStock} left in stock - Order soon!`}
      </p>

      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-full ${getBarColor()}`}
        />
      </div>
    </div>
  );
};
