import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, Bell } from "lucide-react";

export const Toast = ({ message, type = "success", onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <Bell className="w-5 h-5 text-yellow-500" />,
  };

  const colors = {
    success: "border-green-100 bg-white shadow-2xl",
    error: "border-red-100 bg-white shadow-2xl",
    info: "border-blue-100 bg-white shadow-2xl",
    warning: "border-yellow-100 bg-white shadow-2xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 p-4 min-w-[320px] rounded-xl border overflow-hidden ${colors[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>

      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-800 m-0 leading-tight">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar:
        - Duration komiye 2s kora hoyeche jate fast jay.
        - onAnimationComplete use kora hoyeche jate animation shesh holei onClose() call hoy.
      */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        onAnimationComplete={onClose}
        className={`absolute bottom-0 left-0 h-1 ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </motion.div>
  );
};
