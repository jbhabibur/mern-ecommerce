import React, { useEffect, useState } from "react";

export const Toast = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    // Progress bar interval
    const intervalTime = 10; // update every 10ms
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setWidth((prev) => (prev > 0 ? prev - step : 0));
    }, intervalTime);

    // Close toast when time is up
    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const textColor = type === "success" ? "text-green-600" : "text-red-600";
  const borderColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-5 right-5 z-[100] min-w-[250px] shadow-lg ${bgColor} p-4 overflow-hidden animate-in fade-in slide-in-from-right-5`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wider ${textColor}`}
      >
        {message}
      </div>

      {/* Animated Bottom Border */}
      <div
        className={`absolute bottom-0 left-0 h-[3px] ${borderColor} transition-all ease-linear`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};
