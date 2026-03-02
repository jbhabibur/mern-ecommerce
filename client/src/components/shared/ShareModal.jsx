import { useState } from "react";
import { createPortal } from "react-dom";

import {
  X,
  Facebook,
  Twitter,
  PinIcon as Pinterest,
  Copy,
  Check,
} from "lucide-react";
import { useCustomCursor } from "../../hooks/useCustomCursor";

// --- Share Modal Component ---
export const ShareModal = ({ isOpen, onClose, productUrl }) => {
  const [copied, setCopied] = useState(false);
  const { mousePos } = useCustomCursor(isOpen);

  // Return null if modal is not open to avoid unnecessary rendering
  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // Using createPortal to render the modal at the end of document.body
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible md:cursor-none"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      >
        {/* 2. Floating Close Button */}
        <div
          className="fixed pointer-events-none z-[110] hidden md:flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-xl transition-transform duration-100 ease-out"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <X className="w-6 h-6 text-black" />
        </div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Share
        </h2>

        <div className="space-y-3!">
          <button className="w-full flex items-center justify-center gap-3 bg-[#3b5998] hover:bg-[#344e86] text-white py-3 rounded-md font-bold transition-all">
            <Facebook size={20} fill="currentColor" /> Facebook
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-3 bg-[#00acee] hover:bg-[#009bd6] text-white py-3 rounded-md font-bold transition-all">
              <Twitter size={20} fill="currentColor" /> Twitter
            </button>
            <button className="flex items-center justify-center gap-3 bg-[#bd081c] hover:bg-[#a80719] text-white py-3 rounded-md font-bold transition-all">
              <Pinterest size={20} fill="currentColor" /> Pinterest
            </button>
          </div>
        </div>

        <div className="mt-8 border border-gray-200 rounded-lg p-2 flex items-center bg-gray-50">
          <input
            type="text"
            readOnly
            value={productUrl}
            className="w-full bg-transparent text-gray-500 text-sm px-2 outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className="ml-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-100 text-gray-600 flex items-center gap-2 transition-all"
          >
            {copied ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <Copy size={16} />
            )}
            <span className="text-xs font-bold">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
