import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQuery } from "../../../redux/slices/searchSlice";
import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../../../components/shared/ProductCard";
import { Search, X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

export const StickySearchOverlay = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { query } = useSelector((state) => state.search);

  // Local state for debouncing and artificial delay
  const [searchTerm, setSearchTerm] = useState(query);
  const [isWaiting, setIsWaiting] = useState(false);

  const { products, loading: apiLoading, error: isError } = useSearch(query);

  // Combined loading state: True if API is fetching OR if we are in our 1s artificial delay
  const isLoading = apiLoading || isWaiting;

  // --- 1. Debounce + 1 Sec Artificial Loading Logic ---
  useEffect(() => {
    if (searchTerm !== query) {
      setIsWaiting(true); // Start spinner immediately when typing
    }

    const delayDebounceFn = setTimeout(() => {
      dispatch(setQuery(searchTerm));

      // Artificial 1 second delay before stopping the loader
      setTimeout(() => {
        setIsWaiting(false);
      }, 1000);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  // Sync local state if Redux query changes externally
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // --- 2. Clear Query on Close or Navigate ---
  const handleClose = () => {
    dispatch(setQuery("")); // Clear search in Redux
    setSearchTerm(""); // Clear local state
    onClose();
  };

  const handleViewAll = () => {
    if (query.trim()) {
      const currentQuery = query;
      handleClose(); // Clears everything and closes
      navigate(`/search?q=${encodeURIComponent(currentQuery)}`);
    }
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag); // Trigger the same debounce logic
  };

  // Prevent Background Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md overflow-y-auto pt-20 pb-10"
      onClick={handleClose}
    >
      <button
        onClick={handleClose}
        className="fixed top-8 right-8 text-white/50 hover:text-white transition-all duration-300 z-[110]"
      >
        <X size={35} />
      </button>

      <div
        className="max-w-4xl mx-auto px-6 bg-white text-black rounded-lg shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input section with Spinner */}
        <div className="relative flex items-center border-b border-black/20 focus-within:border-black py-4 mb-12 transition-all">
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full bg-transparent text-black text-2xl md:text-4xl outline-none placeholder:text-black/30 px-2"
          />
          {isLoading ? (
            <Loader2 className="animate-spin text-black/40" size={30} />
          ) : (
            <Search className="text-black/40" size={30} />
          )}
        </div>

        {/* Trending section */}
        {!searchTerm && (
          <div className="mb-12">
            <h3 className="text-[11px]! font-bold uppercase text-black/50 mb-4 tracking-[0.2em]">
              Trending Now
            </h3>
            <div className="flex flex-wrap gap-3">
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
                  onClick={() => handleTagClick(tag)}
                  className="flex items-center gap-2 bg-black/5 border border-black/10 px-4 py-2 text-[13px] text-black/70 cursor-pointer hover:bg-black hover:text-white transition-all duration-300 rounded-sm"
                >
                  <Search size={14} /> {tag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results section */}
        <div className="pb-10">
          <h3 className="text-[11px]! font-bold uppercase text-black/50 mb-4 tracking-[0.2em]">
            {query ? "Product Results" : "Popular Products"}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 min-h-[200px]">
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-black mb-4" size={40} />
                <p className="text-xs uppercase tracking-widest text-black/40">
                  Searching catalog...
                </p>
              </div>
            ) : isError ? (
              <div className="col-span-3 text-center py-10 text-red-500 text-sm">
                Error fetching products.
              </div>
            ) : query && products?.length === 0 ? (
              <div className="col-span-3 py-12 flex flex-col items-center text-center">
                <p className="text-black font-bold uppercase tracking-tight">
                  No products found
                </p>
                <p className="text-black/40 text-xs mt-2">
                  Try another search term.
                </p>
              </div>
            ) : (
              products?.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  onClick={handleClose}
                  className="w-full transform transition-transform duration-500 hover:-translate-y-1"
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

        {!isLoading && query && products?.length > 0 && (
          <div className="mt-4 pb-12 pt-6 border-t border-black/10 text-center">
            <button
              onClick={handleViewAll}
              className="px-8 py-3 border border-black text-black text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
            >
              View All Results ({products.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
