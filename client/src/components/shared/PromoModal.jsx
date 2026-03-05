import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import freeDelivery from "/free-delivery.jpg";

export const PromoModal = ({ showLoader }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Check if the user has seen it before
    const hasSeenPromo = localStorage.getItem("mensfaashion_promo_seen");

    // 2. Show if loader is finished and not seen before
    if (!showLoader && !hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  const handleClose = () => {
    // 3. Save to LocalStorage so it doesn't reappear
    localStorage.setItem("mensfaashion_promo_seen", "true");
    setIsOpen(false);
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4">
          {/* Overlay with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-[500px] bg-transparent overflow-hidden rounded-lg shadow-2xl"
          >
            {/* Close Button (X) */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-20 bg-black/40 hover:bg-black/80 text-white w-8 h-8 flex items-center justify-center rounded-full transition-all border border-white/20"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Just the Image */}
            <div className="w-full h-full cursor-pointer" onClick={handleClose}>
              <img
                src={freeDelivery}
                alt="Promotional Offer"
                className="w-full h-auto object-contain block"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
