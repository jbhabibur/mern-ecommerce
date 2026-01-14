import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setClicked } from "../../redux/slices/searchSlice";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { X, Search } from "lucide-react";
import { TrendingTags } from "../atoms/TrendingTags";

export const MobileSearchOverlay = () => {
  const dispatch = useDispatch();
  const { isClicked } = useSelector((state) => state.search);

  const handleClose = () => {
    dispatch(setClicked(false));
  };

  // Mock data for the trending tags
  const trendingTags = [
    "dempus",
    "sample",
    "magnis",
    "loremous saliduar",
    "naminos",
    "dinterdum",
  ];

  return (
    <div
      className={`fixed inset-0 z-[1000] flex transition-all duration-300
        ${
          isClicked
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${isClicked ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleClose}
      />

      {/* Search Sidebar (Drawer) */}
      <div
        className={`relative w-[90%] max-w-sm bg-white h-full shadow-2xl transform transition-transform duration-300 ease-out
          ${isClicked ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-3 flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">Search</h2>
            <button onClick={handleClose} className="text-xl text-gray-500 p-2">
              <X />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative mb-8">
            <input
              type="text"
              // autoFocus={isClicked}
              placeholder="Search products..."
              className="w-full bg-[#f8f8f8] border-b border-gray-100 p-2 border pr-10 outline-none text-base placeholder:text-sm placeholder:font-semibold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg">
              <Search />
            </span>
          </div>

          {/* Trending Now Section */}
          <div className="mb-8">
            <h3 className="text-xs! font-bold! uppercase tracking-wider mb-2 text-gray-900">
              Trending Now
            </h3>

            {/* Standard 1px thin line */}
            <div className="w-full h-[1px] mb-3 bg-[#DDD1C8]"></div>

            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, index) => (
                <TrendingTags key={index} tag={tag} />
              ))}
            </div>
          </div>

          {/* Popular Products Section */}
          <div>
            <h3 className="text-xs! font-bold! uppercase tracking-wider mb-4 text-gray-900">
              Popular Products
            </h3>

            {/* Standard 1px thin line */}
            <div className="w-full h-[1px] mb-3 bg-[#DDD1C8]"></div>

            {/* Swiper Slider */}
            <Swiper
              spaceBetween={16} // স্লাইডগুলোর মাঝের গ্যাপ
              slidesPerView={2.2} // ছোট স্ক্রিনে ২টার একটু বেশি দেখাবে (ইমেজের মতো)
              breakpoints={{
                640: { slidesPerView: 3.2 },
                1024: { slidesPerView: 4.2 },
              }}
              className="w-full"
            >
              {/* ভবিষ্যতে যখন API থেকে ডাটা আনবেন, শুধু এই লুপের ডাটা সোর্স চেঞ্জ করবেন */}
              {[1, 2, 3, 4, 5].map((item) => (
                <SwiperSlide key={item}>
                  <div className="flex flex-col">
                    <div className="bg-[#f2f2f2] aspect-square rounded-md flex items-center justify-center mb-3">
                      <img
                        src="https://via.placeholder.com/150"
                        alt="product"
                        className="w-24 opacity-20"
                      />
                    </div>
                    <h4 className="text-sm text-gray-800 font-medium text-center">
                      Example Product Title
                    </h4>
                    <p className="text-center font-bold text-gray-900 mt-1">
                      Tk 19.99
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};
