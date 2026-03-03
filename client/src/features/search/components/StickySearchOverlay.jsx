import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFocus } from "../../../redux/slices/searchSlice";
import { HorizontalLine } from "../../../components/atoms/HorizontalLine";
import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../../../components/shared/ProductCard";
import { Search } from "lucide-react";

export const StickySearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isFocused, query } = useSelector((state) => state.search);
  const overlayRef = useRef(null);

  const { products, loading: isLoading, error: isError } = useSearch(query);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!overlayRef.current) return;

      const clickedOutside = !overlayRef.current.contains(event.target);
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
      className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white shadow-2xl z-[500] p-6 border border-gray-100 rounded-b-md"
    >
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
                  dispatch(setFocus(false));
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

          {!isLoading &&
            Array.isArray(products) &&
            products.slice(0, 3).map((item) => (
              <div key={item._id || item.id} className="w-full">
                <ProductCard
                  product={item}
                  view="grid"
                  isSearchOverlay={true}
                />
              </div>
            ))}
        </div>
      </div>

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
