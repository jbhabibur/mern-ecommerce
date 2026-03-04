import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setClicked, setQuery } from "../../../redux/slices/searchSlice";
import { useNavigate, useLocation } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { X, Search, Loader2 } from "lucide-react";
import { ProductCard } from "../../../components/shared/ProductCard";

import { useSearch } from "../hooks/useSearch";

export const MobileSearchOverlay = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [isSwiperReady, setIsSwiperReady] = useState(false);

  // Local state for debouncing and artificial delay
  const [searchTerm, setSearchTerm] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const { isClicked, query } = useSelector((state) => state.search);
  const { products, loading: apiLoading } = useSearch(query);

  // Combined loading state
  const isLoading = apiLoading || isWaiting;

  // --- 1. Debounce + 1 Sec Artificial Loading Logic ---
  useEffect(() => {
    if (isClicked) {
      setSearchTerm(query);
    }
  }, [isClicked]);

  useEffect(() => {
    if (searchTerm !== query) {
      setIsWaiting(true);
    }

    const delayDebounceFn = setTimeout(() => {
      dispatch(setQuery(searchTerm));

      setTimeout(() => {
        setIsWaiting(false);
      }, 1000);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  // --- 2. Clear & Close Logic ---
  const handleClose = () => {
    dispatch(setClicked(false));

    setTimeout(() => {
      setSearchTerm("");
      dispatch(setQuery(""));
    }, 400);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    handleClose();
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  // Body scroll lock logic
  useEffect(() => {
    if (isClicked) {
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setIsSwiperReady(true);
      }, 400);

      return () => clearTimeout(timer);
    } else {
      setIsSwiperReady(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isClicked]);

  // Navigation check
  useEffect(() => {
    if (isClicked) {
      handleClose();
    }
  }, [location.pathname]);

  return (
    <div
      className={`fixed inset-0 z-[1000] flex transition-opacity duration-300
        ${isClicked ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${isClicked ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleClose}
      />

      {/* Search Sidebar */}
      <div
        className={`relative w-[85%] max-w-sm bg-white h-full shadow-2xl transform transition-transform duration-500 ease-in-out
          ${isClicked ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-3 flex flex-col h-full overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">Search</h2>
            <button onClick={handleClose} className="text-xl text-gray-500 p-2">
              <X />
            </button>
          </div>

          <div className="relative mb-8">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full bg-[#f8f8f8] border-b border-gray-100 p-2 border pr-10 outline-none text-base placeholder:text-sm placeholder:font-semibold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
              {isLoading ? (
                <Loader2 size={20} className="animate-spin text-black/40" />
              ) : (
                <Search size={20} />
              )}
            </span>
          </div>

          {!searchTerm && (
            <div className="mb-8">
              <h3 className="text-xs! font-bold! uppercase tracking-wider mb-2 text-gray-900">
                Trending Now
              </h3>
              <div className="w-full h-[1px] mb-3 bg-[#DDD1C8]"></div>
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
                    onClick={() => handleTagClick(tag)}
                    key={tag}
                    className="flex items-center gap-2 bg-[#f8f8f8] px-2.5 py-1.5 text-[13px] text-gray-500 cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <Search size={15} /> {tag}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs! font-bold! uppercase tracking-wider mb-4 text-gray-900">
              {query ? "Product Results" : "Popular Products"}
            </h3>

            <div className="w-full h-[1px] mb-3 bg-[#DDD1C8]"></div>

            {isLoading ? (
              <div className="text-center py-10 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="animate-spin mb-2" size={30} />
                <p className="text-[10px] uppercase tracking-widest">
                  Searching...
                </p>
              </div>
            ) : query && products?.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center">
                <p className="text-[14px] font-bold text-gray-900 uppercase">
                  No products found
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  Try another term.
                </p>
              </div>
            ) : (
              isSwiperReady &&
              products?.length > 0 && (
                <Swiper
                  key={query || "popular"}
                  spaceBetween={16}
                  slidesPerView={2.2}
                  observer={true}
                  observeParents={true}
                  className="w-full"
                >
                  {products.slice(0, 10).map((item) => (
                    <SwiperSlide key={item._id || item.id}>
                      <div onClick={handleClose}>
                        <ProductCard
                          product={item}
                          view="grid"
                          isSearchOverlay={true}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )
            )}
          </div>

          {!isLoading && query && products?.length > 0 && (
            <div className="mt-8 pt-4 border-t border-gray-100 text-center">
              <button
                onClick={() => {
                  const currentQuery = query;
                  handleClose();
                  navigate(`/search?q=${encodeURIComponent(currentQuery)}`);
                }}
                className="text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:underline"
              >
                View All ({products.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
