import React, { useState } from "react";
import { X, Facebook, Twitter } from "lucide-react";

export const ShareModal = ({ showShare, setShowShare }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (!showShare) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[500] p-4"
      onClick={() => setShowShare(false)}
    >
      <div
        className="bg-white rounded shadow-2xl w-full max-w-lg relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowShare(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-[#222] mb-8">
            Share
          </h2>

          {/* Social Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="group no-underline!"
            >
              <div className="w-full py-3 rounded bg-[#3b5998] flex items-center justify-center text-white  transition-transform gap-2">
                <Facebook size={20} fill="currentColor" />
                <span className="hidden sm:block text-sm font-bold leading-none">
                  Facebook
                </span>
              </div>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="group no-underline!"
            >
              <div className="w-full py-3 rounded bg-[#1da1f2] flex items-center justify-center text-white  transition-transform gap-2">
                <Twitter size={20} fill="currentColor" />
                <span className="hidden sm:block text-sm font-bold leading-none">
                  Twitter
                </span>
              </div>
            </a>

            <a
              href={`https://pinterest.com/pin/create/button/?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="group no-underline!"
            >
              <div className="w-full py-3 rounded bg-[#bd081c] flex items-center justify-center text-white  transition-transform gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12.289 2C6.617 2 2 6.617 2 12.289c0 4.305 2.774 7.962 6.671 9.284-.09-.806-.17-2.043.035-2.924.185-.794 1.197-5.071 1.197-5.071s-.304-.61-.304-1.512c0-1.417.823-2.475 1.844-2.475.868 0 1.287.65 1.287 1.43 0 .872-.556 2.177-.842 3.386-.239 1.012.509 1.836 1.508 1.836 1.812 0 3.203-1.91 3.203-4.666 0-2.44-1.753-4.144-4.255-4.144-2.898 0-4.6 2.174-4.6 4.419 0 .874.337 1.812.756 2.32.083.101.095.191.07.29-.078.322-.252 1.026-.286 1.168-.045.187-.149.227-.344.137-1.282-.597-2.084-2.474-2.084-3.98 0-3.24 2.354-6.217 6.79-6.217 3.565 0 6.334 2.54 6.334 5.934 0 3.541-2.233 6.391-5.332 6.391-1.041 0-2.02-.541-2.355-1.182l-.64 2.439c-.232.894-.858 2.015-1.282 2.701 1.062.328 2.189.506 3.354.506 5.671 0 10.289-4.618 10.289-10.289C22.578 6.617 17.96 2 12.289 2z" />
                </svg>
                <span className="hidden sm:block text-sm font-bold leading-none">
                  Pinterest
                </span>
              </div>
            </a>
          </div>

          {/* URL Section with Fade Effect */}
          <div className="relative group/link">
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-pink-300">
              <div className="relative flex-1 overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-transparent py-3 px-3 text-sm text-gray-400 outline-none whitespace-nowrap"
                />
                {/* Fade effect - disappears on hover */}
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none transition-opacity duration-300 group-hover/link:opacity-0" />
              </div>

              <button
                onClick={handleCopy}
                className={`min-w-[80px] h-full px-4 py-3 text-[11px] font-black border-l border-gray-100 transition-colors bg-white z-10 ${
                  copied
                    ? "text-green-600"
                    : "text-gray-400 hover:text-pink-600"
                }`}
              >
                {copied ? "COPIED!" : "COPY"}
              </button>
            </div>

            {/* Tooltip to show full URL on hover */}
            <div className="absolute top-full left-0 mt-2 hidden group-hover/link:block w-full z-20">
              <div className="bg-gray-800 text-white text-[10px] py-2 px-3 rounded shadow-xl break-all">
                {shareUrl}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
