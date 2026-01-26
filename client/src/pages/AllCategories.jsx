import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../api/API_URLS";
import { getFullImagePath } from "../api/apiConfig";

export const AllCategories = () => {
  // State to store the list of categories
  const [categories, setCategories] = useState([]);
  // State to track the current page for pagination
  const [page, setPage] = useState(1);
  // Loading state to prevent duplicate API calls
  const [loading, setLoading] = useState(false);
  // State to determine if there are more items to fetch from the server
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetches categories from the backend based on the page number.
   * Uses a POST request to send pagination data.
   */
  const fetchCategories = async (pageNumber) => {
    if (loading) return; // Exit if a request is already in progress
    setLoading(true);
    try {
      const response = await axios.post(API_URLS.ALL_CATEGORIES, {
        page: pageNumber,
      });
      const newData = response.data.data;

      // Update categories list while ensuring no duplicate IDs exist
      setCategories((prev) => {
        const existingIds = new Set(prev.map((cat) => cat._id));
        const uniqueNewData = newData.filter(
          (cat) => !existingIds.has(cat._id),
        );
        return [...prev, ...uniqueNewData];
      });

      // Update hasMore state based on backend response
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchCategories(1);
  }, []);

  /**
   * Handles the 'Show More' button click.
   * Increments the page number and triggers a new fetch.
   */
  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCategories(nextPage);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16 bg-white">
      {/* Category Grid: Responsive layout (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
        {categories.map((cat) => (
          <div key={cat._id} className="flex flex-col items-center">
            {/* Image Section: Fixed aspect ratio with hover zoom effect */}
            <div className="w-full h-[220px] overflow-hidden bg-[#f4f4f4] mb-8 group cursor-pointer">
              <img
                src={getFullImagePath(cat.displayImage)} // Using dynamic display image logic
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-1000 ease-in-out"
                // Fallback placeholder if image fails to load
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=No+Image";
                }}
              />
            </div>

            {/* Text Content: High-end typography and styling */}
            <div className="text-center w-full">
              <h3 className="text-[28px] font-[900] uppercase tracking-tighter text-black leading-tight mb-2">
                {cat.name}
              </h3>
              <p className="text-[#999] text-[13px] font-medium uppercase tracking-[0.15em] mb-8">
                {cat.productCount || 0} Products
              </p>

              {/* Action Button: Styled to match premium brand guidelines */}
              <button className="bg-[#1e1e1e] text-white px-14 py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-sm">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Trigger: Only shown if not loading and more data is available */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-24">
          <button
            onClick={handleShowMore}
            className="px-20 py-4 border-[2px] border-black font-black uppercase text-[12px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};
