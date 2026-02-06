import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
} from "lucide-react";

/** CONFIGURATION */
const BASE_URL = "http://localhost:5000";

/** API: Fetch categories */
const fetchCategories = async () => {
  const res = await axios.get(`${BASE_URL}/api/categories/list-all`, {
    headers: { "Cache-Control": "no-cache" },
  });
  if (!res.data.success) throw new Error("Failed to fetch categories");
  return res.data.data;
};

/** API: Update category status using showInCategories */
const updateCategoryStatus = async ({ id, newStatus }) => {
  const res = await axios.patch(`${BASE_URL}/api/categories/${id}`, {
    showInCategories: newStatus, // স্ক্রিনশট অনুযায়ী ফিল্ডের নাম আপডেট করা হলো
  });
  if (!res.data.success) throw new Error("Failed to update category");
  return res.data.data;
};

const CategoriesManager = () => {
  const queryClient = useQueryClient();

  /** 1️⃣ Fetch Data */
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  /** 2️⃣ Mutation Logic (Optimistic Updates) */
  const toggleMutation = useMutation({
    mutationFn: updateCategoryStatus,
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previous = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (old) =>
        old?.map((cat) =>
          cat._id === id ? { ...cat, showInCategories: newStatus } : cat,
        ),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["categories"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleToggle = (id) => {
    const currentCat = categories?.find((cat) => cat._id === id);
    if (!currentCat) return;
    // showInCategories টগল করা হচ্ছে
    toggleMutation.mutate({ id, newStatus: !currentCat.showInCategories });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="mt-4 text-slate-500 font-medium">Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        <h3 className="text-lg font-bold text-slate-800">Connection Error</h3>
        <button
          onClick={() => refetch()}
          className="mt-4 text-indigo-600 font-semibold underline"
        >
          Try refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <header className="mb-10 flex justify-between items-end max-w-6xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid className="text-indigo-600" size={24} />
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Categories Manager
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Control which categories are visible on the categories page.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          <span className="text-sm font-bold text-slate-700">Sync</span>
        </button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {categories?.map((cat) => {
          const thumbnailImg = cat.thumbnail || cat.bannerImage || cat.icon;
          const isPending =
            toggleMutation.isPending &&
            toggleMutation.variables?.id === cat._id;

          // এখানে showInCategories চেক করা হচ্ছে
          const isActive = cat.showInCategories;

          return (
            <div
              key={cat._id}
              className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-md ${
                isActive
                  ? "border-indigo-100 ring-2 ring-indigo-500/5"
                  : "border-slate-200"
              }`}
            >
              <div className="aspect-square p-3 relative">
                <div className="w-full h-full rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-50">
                  {thumbnailImg ? (
                    <img
                      src={thumbnailImg}
                      alt={cat.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        !isActive && "grayscale opacity-40 scale-95"
                      }`}
                    />
                  ) : (
                    <ImageIcon size={28} className="text-slate-300" />
                  )}
                </div>
                <div
                  className={`absolute top-5 right-5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                    isActive ? "bg-green-500" : "bg-slate-300"
                  }`}
                />
              </div>

              <div className="px-3 pb-3 text-center">
                <h3
                  className="font-bold text-slate-800 text-sm truncate mb-3"
                  title={cat.name}
                >
                  {cat.name}
                </h3>

                <button
                  disabled={isPending}
                  onClick={() => handleToggle(cat._id)}
                  className={`w-full py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isActive ? (
                    <>
                      <Eye size={14} /> Visible
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} /> Hidden
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesManager;
