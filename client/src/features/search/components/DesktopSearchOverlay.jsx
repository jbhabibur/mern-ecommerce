import { useEffect, useRef, useState } from "react"; // useState & useRef properly imported
import { useSelector, useDispatch } from "react-redux";
import { setFocus, setQuery } from "../../../redux/slices/searchSlice";
import { HorizontalLine } from "../../../components/atoms/HorizontalLine";
import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../../../components/shared/ProductCard";
import { Search, Loader2 } from "lucide-react"; // Loader2 added

export const DesktopSearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  const { isFocused, query } = useSelector((state) => state.search);

  // Local state for artificial 1-sec delay
  const [isWaiting, setIsWaiting] = useState(false);
  const { products, loading: apiLoading, error: isError } = useSearch(query);

  // Combined loading state
  const isLoading = apiLoading || isWaiting;

  // --- 1. Artificial 1-second delay logic ---
  useEffect(() => {
    if (query) {
      setIsWaiting(true);
      const timer = setTimeout(() => {
        setIsWaiting(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [query]);

  // --- 2. Handle Close and Clear ---
  const handleClose = () => {
    dispatch(setFocus(false));
    dispatch(setQuery("")); // Clear query on close
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside =
        overlayRef.current && !overlayRef.current.contains(event.target);

      // Check if the click was on the search input itself (to avoid double-toggle)
      const isSearchInput =
        event.target.type === "search" ||
        event.target.closest('input[type="search"]');

      if (clickedOutside && !isSearchInput) {
        handleClose();
      }
    };

    if (isFocused) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFocused]);

  const handleViewAll = () => {
    if (query.trim()) {
      const currentQuery = query;
      handleClose();
      navigate(`/search?q=${encodeURIComponent(currentQuery)}`);
    }
  };

  if (!isFocused) return null;

  return (
    <div
      ref={overlayRef}
      className="absolute top-full right-0 w-[550px] bg-white shadow-2xl z-[500] p-6 border border-gray-100 rounded-b-md"
    >
      {/* 1. Trending Section */}
      {!query && (
        <div className="mb-8">
          <h3 className="text-[11px]! font-bold uppercase text-gray-900 mb-2 tracking-wider">
            Trending Now
          </h3>
          <HorizontalLine />
          <div className="flex flex-wrap gap-2">
            {[
              "panjabi",
              "casual shirt",
              "formal shirt",
              "belt",
              "jeans",
              "pant",
              "t-shirt",
              "polo",
            ].map((tag) => (
              <div
                key={tag}
                onClick={() => {
                  handleClose();
                  navigate(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="flex items-center gap-2 bg-[#f8f8f8] px-2.5 py-1.5 text-[13px] text-gray-500 cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
              >
                <Search size={15} /> {tag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Results Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[11px]! font-bold uppercase text-gray-900 tracking-wider">
            {query ? "Product Results" : "Popular Products"}
          </h3>
          {isLoading && (
            <Loader2 className="animate-spin text-black/20" size={16} />
          )}
        </div>
        <HorizontalLine />

        <div className="grid grid-cols-3 gap-6 min-h-[150px]">
          {isLoading ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-10">
              <Loader2 className="animate-spin text-gray-300 mb-2" size={30} />
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                Searching...
              </p>
            </div>
          ) : isError ? (
            <div className="col-span-3 text-center py-10 text-red-400 text-sm">
              Error fetching products.
            </div>
          ) : query && products?.length === 0 ? (
            <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-3 opacity-20">🔍</div>
              <p className="text-[14px] font-bold text-gray-900 uppercase tracking-tight">
                No products found
              </p>
              <p className="text-[12px] text-gray-400 mt-1 max-w-[250px] leading-relaxed">
                We couldn't find any results for "{query}".
              </p>
            </div>
          ) : (
            Array.isArray(products) &&
            products.slice(0, 3).map((item) => (
              <div
                key={item._id || item.id}
                onClick={handleClose}
                className="w-full scale-95 hover:scale-100 transition-transform duration-300"
              >
                <ProductCard
                  product={item}
                  view="grid"
                  isSearchOverlay={true}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Footer */}
      {!isLoading && query && products?.length > 0 && (
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <button
            onClick={handleViewAll}
            className="text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:underline cursor-pointer"
          >
            View All Results ({products.length})
          </button>
        </div>
      )}
    </div>
  );
};
