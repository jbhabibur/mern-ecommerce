import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URLS } from "../api/API_URLS";
import { getFullImagePath } from "../api/apiConfig";
import { NAVIGATION_DATA_DESKTOP } from "../constants/navigationData";
import { SectionLayout } from "../layout/SectionLayout";
import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { ImagePlaceholder } from "../components/atoms/ImagePlaceholder";

export const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // 1. Pagination-er jonno visible count state (Initial 8)
  const [visibleCount, setVisibleCount] = useState(8);

  const fetchSingleCount = async (slug) => {
    try {
      const url = API_URLS.CATEGORY_PRODUCTS(slug);
      const res = await axios.get(url);
      const data = res.data;
      if (Array.isArray(data)) return data.length;
      return data.products?.length || data.total || 0;
    } catch (err) {
      return 0;
    }
  };

  const fetchApiCategories = async () => {
    try {
      const res = await axios.post(API_URLS.ALL_CATEGORIES, { page: 1 });
      return res.data.data || [];
    } catch (err) {
      return [];
    }
  };

  const calculateTotalSum = (item, countMap) => {
    let currentTotal = countMap[item.slug] || 0;
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        currentTotal += calculateTotalSum(child, countMap);
      });
    }
    return currentTotal;
  };

  const initializeAllData = async () => {
    setLoading(true);
    const apiCats = await fetchApiCategories();
    const allSlugs = new Set();
    const extractSlugs = (items) => {
      items.forEach((it) => {
        if (it.slug && it.slug !== "/") allSlugs.add(it.slug);
        if (it.children) extractSlugs(it.children);
      });
    };
    extractSlugs(NAVIGATION_DATA_DESKTOP);

    const countMap = {};
    await Promise.all(
      Array.from(allSlugs).map(async (slug) => {
        countMap[slug] = await fetchSingleCount(slug);
      }),
    );

    const finalDisplayList = [];
    const processNavigation = (items) => {
      items.forEach((item) => {
        if (item.slug && item.slug !== "/") {
          const matchedApi = apiCats.find((c) => c.slug === item.slug);
          const totalAggregatedCount = calculateTotalSum(item, countMap);
          finalDisplayList.push({
            id: item.id || item.slug,
            name: item.label,
            slug: item.slug,
            bannerImage: matchedApi?.bannerImage || null,
            totalCount: totalAggregatedCount,
          });
        }
        if (item.children) processNavigation(item.children);
      });
    };

    processNavigation(NAVIGATION_DATA_DESKTOP);
    const uniqueList = Array.from(
      new Map(finalDisplayList.map((c) => [c.slug, c])).values(),
    );
    setCategories(uniqueList);
    setLoading(false);
  };

  useEffect(() => {
    initializeAllData();
  }, []);

  // 2. Show More handle korar function
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  if (loading)
    return (
      <div className="text-center py-20 font-bold">Loading Collections...</div>
    );

  return (
    <SectionLayout custom="py-10">
      <Breadcrumb />

      {/* 3. Slice use kore prothome 8-ta dekhano hocche */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
        {categories.slice(0, visibleCount).map((cat) => (
          <div key={cat.id} className="flex flex-col items-center">
            <Link
              to={`/categories/${cat.slug}`}
              className="w-full h-[220px] overflow-hidden bg-[#f4f4f4] mb-8 group cursor-pointer relative flex items-center justify-center !no-underline"
            >
              {cat.bannerImage ? (
                <img
                  src={getFullImagePath(cat.bannerImage)}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-1000 ease-in-out"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </Link>

            <div className="text-center w-full">
              <Link to={`/categories/${cat.slug}`} className="!no-underline">
                <h3 className="text-[22px] font-[900] uppercase tracking-tighter text-black leading-tight mb-2">
                  {cat.name}
                </h3>
              </Link>
              <p className="text-[#999] text-[13px] font-medium uppercase tracking-[0.15em] mb-8">
                {cat.totalCount} Products
              </p>
              <Link
                to={`/categories/${cat.slug}`}
                className="bg-[#1e1e1e] text-white !no-underline inline-block px-14 py-3 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Show More Button - Sudhu jodi aro item thake tokhon dekhabe */}
      {visibleCount < categories.length && (
        <div className="mt-20 text-center">
          <button
            onClick={handleShowMore}
            className="border border-black text-black px-10 py-3 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black! hover:text-white! transition-all duration-300"
          >
            Show More
          </button>
        </div>
      )}
    </SectionLayout>
  );
};
