import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const StockProgressBar = ({ stockLimit = 50, currentStock = 10 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // পেজ লোড হওয়ার সামান্য পরে অ্যানিমেশন শুরু হবে
    const timer = setTimeout(() => {
      const stockPercentage = (currentStock / stockLimit) * 100;
      setProgress(stockPercentage);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentStock, stockLimit]);

  return (
    <div className="w-full max-w-sm my-4">
      {/* Stock Text */}
      <p className="text-[#d62828] font-medium mb-2 text-sm! md:text-base">
        Please hurry! Only {currentStock} left in stock
      </p>

      {/* Progress Bar Container */}
      <div className="h-1 w-full bg-gray-100 overflow-hidden">
        {/* Animated Inner Bar */}
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-red-500 via-orange-400 to-green-500"
        />
      </div>
    </div>
  );
};
