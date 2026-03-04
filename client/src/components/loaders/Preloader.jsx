import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const Preloader = ({ onFinish }) => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("loading");
  // phases: loading → brand → sliding

  const timers = useRef([]);

  // Counter animation
  useEffect(() => {
    if (phase !== "loading") return;

    if (count < 100) {
      const timer = setTimeout(() => {
        setCount((prev) => prev + 1);
      }, 18);

      timers.current.push(timer);
      return () => clearTimeout(timer);
    }

    if (count === 100) {
      setPhase("brand");
    }
  }, [count, phase]);

  // Brand → Slide → Finish sequence
  useEffect(() => {
    if (phase === "brand") {
      const brandTimer = setTimeout(() => {
        setPhase("sliding");
      }, 1000); // Show brand 1s

      timers.current.push(brandTimer);
    }

    if (phase === "sliding") {
      const finishTimer = setTimeout(() => {
        onFinish();
      }, 1200); // Match slide duration

      timers.current.push(finishTimer);
    }

    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, [phase, onFinish]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: phase === "sliding" ? "-100%" : 0 }}
      transition={{
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05070a] overflow-hidden"
    >
      {/* Decorative Line */}
      <div className="absolute top-1/2 w-[80%] h-[1px] bg-white/10" />

      {/* Counter */}
      {phase === "loading" && (
        <div className="absolute bottom-[10%] right-[10%] flex items-center text-white font-extralight text-7xl md:text-9xl">
          <span className="opacity-30">[</span>
          <span className="min-w-[120px] text-center">{count}</span>
          <span className="opacity-30">]</span>
        </div>
      )}

      {/* Brand */}
      {phase !== "loading" && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-3xl md:text-6xl tracking-[1.5rem] font-extralight uppercase text-center"
        >
          MENS FASHION
        </motion.div>
      )}
    </motion.div>
  );
};
