import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent) return;

    const handleScroll = () => {
      if (window.scrollY > 200 && !hasScrolled) {
        setHasScrolled(true);
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  const handleClose = (accepted = false) => {
    if (accepted) localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 w-full md:bottom-6 md:left-6 z-[10000] md:max-w-[600px] bg-white p-6 md:p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[0_10px_50px_rgba(0,0,0,0.15)] border-t md:border border-gray-100"
        >
          {/* Close Icon */}
          <button
            onClick={() => handleClose(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors p-2"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>

          <h3 className="text-[10px]! md:text-[11px]! font-bold! tracking-[0.2em] uppercase mb-3 pr-6">
            Cookies enhance your shopping experience
          </h3>
          <p className="text-xs! md:text-sm! text-gray-500 leading-relaxed mb-6">
            We use our own and third-party cookies for analytical purposes and
            to show you personalized advertising.
          </p>

          <div className="flex flex-row gap-3">
            <button
              onClick={() => handleClose(false)}
              className="flex-1 py-3 border border-black text-[10px]! md:text-[11px]! font-bold! uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => handleClose(true)}
              className="flex-1 py-3 bg-black text-white text-[10px]! md:text-[11px]! font-bold! uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
