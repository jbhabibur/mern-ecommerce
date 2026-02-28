import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFocus } from "../../../redux/slices/searchSlice";
import { HorizontalLine } from "../../../components/atoms/HorizontalLine";
import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../../../components/shared/ProductCard";
import { Search } from "lucide-react";

export const DesktopSearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isFocused, query } = useSelector((state) => state.search);
  const overlayRef = useRef(null);

  const { products, loading: isLoading, error: isError } = useSearch(query);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside =
        overlayRef.current && !overlayRef.current.contains(event.target);
      const isSearchInput =
        event.target.type === "search" ||
        event.target.closest('input[type="search"]');

      if (clickedOutside && !isSearchInput) {
        dispatch(setFocus(false));
      }
    };

    if (isFocused) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFocused, dispatch]);

  const handleViewAll = () => {
    if (query.trim()) {
      dispatch(setFocus(false));
      navigate(`/search?q=${encodeURIComponent(query)}`);
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
                onClick={() => {
                  dispatch(setFocus(false));
                  navigate(`/search?q=${encodeURIComponent(tag)}`);
                }}
                key={tag}
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
        <h3 className="text-[11px]! font-bold uppercase text-gray-900 mb-2 tracking-wider">
          {query ? "Product Results" : "Popular Products"}
        </h3>
        <HorizontalLine />

        <div className="grid grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-3 text-center py-10 text-gray-400 animate-pulse">
              Loading products...
            </div>
          )}

          {isError && (
            <div className="col-span-3 text-center py-10 text-red-400 text-sm">
              Error fetching products.
            </div>
          )}

          {/* NO RESULTS FOUND STATE */}
          {!isLoading && !isError && query && products?.length === 0 && (
            <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-3 opacity-20">🔍</div>
              <p className="text-[14px] font-bold text-gray-900 uppercase tracking-tight">
                No products found
              </p>
              <p className="text-[12px] text-gray-400 mt-1 max-w-[250px] leading-relaxed">
                We couldn't find any results for "{query}". Please check your
                spelling or try another term.
              </p>
            </div>
          )}

          {!isLoading &&
            Array.isArray(products) &&
            products.slice(0, 3).map((item) => (
              <div
                key={item._id || item.id}
                className="w-full scale-95 hover:scale-100 transition-transform duration-300"
              >
                <ProductCard
                  product={item}
                  view="grid"
                  isSearchOverlay={true}
                />
              </div>
            ))}
        </div>
      </div>

      {/* 3. Footer */}
      {query && products?.length > 0 && (
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
