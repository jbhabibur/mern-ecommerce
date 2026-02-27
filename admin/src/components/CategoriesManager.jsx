import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  Layers,
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

export const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pendingId, setPendingId] = useState(null);

  const loadCategories = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setIsFetching(true);
    setIsError(false);

    try {
      const res = await axios.get(`${BASE_URL}/api/categories/list-all`);
      if (res.data.success) {
        setCategories(res.data.data);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      setIsError(true);
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleToggle = async (id) => {
    const currentCat = categories.find((cat) => cat._id === id);
    if (!currentCat) return;

    const newStatus = !currentCat.showInCategories;
    const previousCategories = [...categories];

    // Optimistic UI Update
    setCategories((prev) =>
      prev.map((cat) =>
        cat._id === id ? { ...cat, showInCategories: newStatus } : cat,
      ),
    );

    setPendingId(id);

    try {
      const res = await axios.patch(`${BASE_URL}/api/categories/${id}`, {
        showInCategories: newStatus,
      });
      if (!res.data.success) throw new Error("Update failed");
    } catch (err) {
      setCategories(previousCategories);
      alert("Failed to update status.");
    } finally {
      setPendingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-theme-base">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-theme-act" />
          <div className="absolute inset-0 blur-xl bg-theme-act/20 animate-pulse"></div>
        </div>
        <p className="mt-6 text-theme-muted font-black uppercase tracking-widest text-xs">
          Syncing Catalog...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="bg-theme-error/10 p-4 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-theme-error" />
        </div>
        <h3 className="text-xl font-black text-theme-front">
          System Sync Error
        </h3>
        <p className="text-theme-muted mb-6 text-sm">
          We couldn't reach the category database.
        </p>
        <button
          onClick={() => loadCategories()}
          className="px-8 py-3 bg-theme-act text-theme-actfg rounded-2xl font-bold shadow-lg shadow-theme-act/30"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-theme-base min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-theme-act/10 rounded-xl">
                <Layers className="text-theme-act" size={28} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-theme-front tracking-tighter">
                Inventory <span className="text-theme-act">Scope</span>
              </h1>
            </div>
            <p className="text-theme-muted text-sm font-medium ml-1">
              Toggle visibility for storefront category navigation
            </p>
          </div>

          <button
            onClick={() => loadCategories(false)}
            disabled={isFetching}
            className="group flex items-center gap-3 px-6 py-3 bg-theme-sub border border-theme-line rounded-2xl hover:border-theme-act transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={`${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} text-theme-act`}
            />
            <span className="text-sm font-black text-theme-front uppercase tracking-tight">
              Refresh Grid
            </span>
          </button>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const thumbnailImg = cat.thumbnail || cat.bannerImage;
            const isPending = pendingId === cat._id;
            const isActive = cat.showInCategories;

            return (
              <div
                key={cat._id}
                className={`group relative bg-theme-sub rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${
                  isActive
                    ? "border-theme-act/20 shadow-xl shadow-theme-act/5"
                    : "border-theme-line grayscale opacity-80"
                }`}
              >
                {/* Visual Preview */}
                <div className="aspect-[4/3] relative overflow-hidden bg-theme-base">
                  {thumbnailImg ? (
                    <img
                      src={thumbnailImg}
                      alt={cat.name}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                        !isActive && "opacity-40"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-theme-line">
                      <ImageIcon size={48} strokeWidth={1} />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                      isActive
                        ? "bg-theme-success/10 text-theme-success border-theme-success/20"
                        : "bg-theme-base/50 text-theme-muted border-theme-line"
                    }`}
                  >
                    {isActive ? "Online" : "Offline"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-black text-theme-front text-lg leading-tight truncate">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider mt-1">
                      {cat.parent ? "Sub-Category" : "Primary Category"}
                    </p>
                  </div>

                  <button
                    disabled={isPending}
                    onClick={() => handleToggle(cat._id)}
                    className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                      isActive
                        ? "bg-theme-act text-theme-actfg shadow-lg shadow-theme-act/20"
                        : "bg-theme-base text-theme-front border border-theme-line hover:border-theme-act"
                    }`}
                  >
                    {isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isActive ? (
                      <>
                        <Eye size={16} /> Hide from Store
                      </>
                    ) : (
                      <>
                        <EyeOff size={16} /> Show in Store
                      </>
                    )}
                  </button>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-theme-act/30 rounded-[2rem] transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
