import { useSelector, useDispatch } from "react-redux";
import { setFocus } from "../../redux/slices/searchSlice";
import { useEffect, useRef } from "react";
import { HorizontalLine } from "../atoms/HorizontalLine";

export const DesktopSearchOverlay = () => {
  const dispatch = useDispatch();
  const { isFocused } = useSelector((state) => state.search);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. Check if the click is outside the overlay
      const clickedOutsideOverlay =
        overlayRef.current && !overlayRef.current.contains(event.target);

      // 2. Check if the click is NOT the search input (to prevent the double-click bug)
      // We check if the clicked element has type "search" or is the search input
      const isSearchInput =
        event.target.type === "search" ||
        event.target.closest('input[type="search"]');

      if (clickedOutsideOverlay && !isSearchInput) {
        dispatch(setFocus(false));
      }
    };

    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocused, dispatch]);

  if (!isFocused) return null;

  return (
    <div
      ref={overlayRef}
      className="absolute top-full right-0 w-[550px] bg-white shadow-2xl z-[500] p-4 border border-gray-100 rounded-b-md"
    >
      {/* Trending Section */}
      <div className="mb-8">
        <h3 className="text-xs! font-bold uppercase text-gray-900 mb-2 tracking-wider">
          Trending Now
        </h3>

        {/* Standard 1px thin line */}
        <HorizontalLine />

        <div className="flex flex-wrap gap-2">
          {[
            "dempus",
            "sample",
            "magnis",
            "loremous saliduar",
            "naminos",
            "dinterdum",
          ].map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 bg-[#f8f8f8] px-4 py-2 text-[13px] text-gray-500 cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
            >
              <span className="text-[10px]">🔍</span> {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Popular Products Section */}
      <div>
        <h3 className="text-xs! font-bold uppercase text-gray-900 mb-2 tracking-wider">
          Popular Products
        </h3>

        {/* Standard 1px thin line */}
        <HorizontalLine />

        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="text-center group cursor-pointer">
              <div className="bg-[#f2f2f2] aspect-square mb-4 flex items-center justify-center border border-transparent group-hover:border-gray-200 transition-all">
                <div className="w-16 h-16 border border-gray-300 opacity-20 flex items-center justify-center text-2xl">
                  📦
                </div>
              </div>
              <p className="text-[13px] font-medium text-gray-800 truncate">
                Example Product Title
              </p>
              <p className="font-bold text-[14px] mt-1 text-black">Tk 19.99</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
