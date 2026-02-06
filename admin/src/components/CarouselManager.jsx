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
} from "lucide-react";

/** CONFIGURATION */
const BASE_URL = "http://localhost:5000";

/** API: Fetch categories */
const fetchCategories = async () => {
  const res = await axios.get(`${BASE_URL}/api/categories/list-all`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (!res.data.success) throw new Error("Failed to fetch categories");
  return res.data.data;
};

/** API: Update category showInCarousel (Previously showOnHome) */
const updateCategoryStatus = async ({ id, newStatus }) => {
  const res = await axios.patch(`${BASE_URL}/api/categories/${id}`, {
    showInCarousel: newStatus, // Field name changed to match backend
  });
  if (!res.data.success) throw new Error("Failed to update category");
  return res.data.data;
};

const CarouselManager = () => {
  const queryClient = useQueryClient();

  /** 1️⃣ Fetch categories */
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  /** 2️⃣ Mutation Hook */
  const toggleMutation = useMutation({
    mutationFn: updateCategoryStatus,

    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previous = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (old) =>
        old?.map((cat) =>
          cat._id === id ? { ...cat, showInCarousel: newStatus } : cat,
        ),
      );
      return { previous };
    },

    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["categories"], context.previous);
      }
    },

    onSuccess: (updatedData) => {
      queryClient.setQueryData(["categories"], (old) =>
        old?.map((cat) => (cat._id === updatedData._id ? updatedData : cat)),
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  /** 3️⃣ Toggle handler */
  const handleToggle = (id) => {
    const currentCat = categories?.find((cat) => cat._id === id);
    if (!currentCat) return;

    // Toggle logic based on showInCarousel
    const newStatus = !currentCat.showInCarousel;
    toggleMutation.mutate({ id, newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-slate-600 font-medium">Syncing database...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 font-bold">Failed to load categories.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Home Carousel Manager
          </h1>
          <p className="text-slate-500 text-sm">
            Manage which categories appear on the homepage carousel.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 bg-white border rounded-full hover:bg-slate-100 transition-all active:scale-90"
        >
          <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories?.map((cat) => {
          const displayImg = cat.carouselImage || cat.bannerImage;
          const isPending =
            toggleMutation.isPending &&
            toggleMutation.variables?.id === cat._id;

          // Checking showInCarousel instead of showOnHome
          const isActive = cat.showInCarousel;

          return (
            <div
              key={cat._id}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all duration-300 ${
                isActive
                  ? "border-green-200 ring-4 ring-green-500/5"
                  : "border-slate-200"
              }`}
            >
              <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                {displayImg ? (
                  <img
                    src={displayImg}
                    alt={cat.name}
                    className={`w-full h-full object-cover transition-opacity ${
                      !isActive && "grayscale opacity-50"
                    }`}
                  />
                ) : (
                  <ImageIcon size={40} className="text-slate-300" />
                )}

                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black text-white ${
                    isActive ? "bg-green-500" : "bg-slate-800"
                  }`}
                >
                  {isActive ? "LIVE ON CAROUSEL" : "HIDDEN"}
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ID: {cat._id.slice(-8)}
                    </p>
                  </div>

                  <button
                    disabled={isPending}
                    onClick={() => handleToggle(cat._id)}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      isActive ? "bg-green-500" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full absolute top-1 transition-all ${
                        isActive ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <button
                  disabled={isPending}
                  onClick={() => handleToggle(cat._id)}
                  className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isActive
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-slate-900 text-white hover:bg-black"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isActive ? (
                    <>
                      <EyeOff size={18} /> Remove from Carousel
                    </>
                  ) : (
                    <>
                      <Eye size={18} /> Add to Carousel
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

export default CarouselManager;
