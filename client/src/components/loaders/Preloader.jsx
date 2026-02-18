import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Preloader = () => {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (count < 100) {
      const timer = setTimeout(() => {
        setCount((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timer);
    } else {
      // 1. Counter fades out
      setTimeout(() => setIsComplete(true), 400);

      // 2. Brand title appears at 700ms
      setTimeout(() => setShowBrand(true), 700);

      // 3. Slide starts 2 seconds after the title appears
      // 700ms (appearance) + 2000ms (waiting time) = 2700ms
      setTimeout(() => setIsDismissed(true), 2700);
    }
  }, [count]);

  return (
    <motion.div
      initial={{ y: 0 }}
      // Smoothly slides the entire window from bottom to top
      animate={{ y: isDismissed ? "-100%" : 0 }}
      transition={{
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1], // Premium curtain-like ease
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070a] overflow-hidden"
    >
      {/* Decorative line */}
      <div className="absolute top-1/2 w-[80%] h-[1px] bg-white/10" />

      {/* Counter UI */}
      {!isComplete && (
        <motion.div
          exit={{ opacity: 0 }}
          className="absolute bottom-[10%] right-[10%] flex items-center text-white font-extralight text-7xl md:text-9xl"
        >
          <span className="opacity-30">[</span>
          <span className="min-w-[120px] text-center">{count}</span>
          <span className="opacity-30">]</span>
        </motion.div>
      )}

      {/* Brand UI */}
      {showBrand && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-white text-3xl md:text-6xl tracking-[1.5rem] font-extralight uppercase text-center"
        >
          MENS FASHION
        </motion.div>
      )}
    </motion.div>
  );
};
