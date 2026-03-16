import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const useCarouselManager = () => {
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Categories
  const {
    data: categories,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/categories/list-all`);
      return res.data.data;
    },
  });

  // 2. Filter & Auto-Sort Logic (Active items first)
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    return (
      categories
        // First, filter by search term
        .filter((cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        // Then, sort so that showInCarousel: true comes first
        .sort((a, b) => {
          if (a.showInCarousel === b.showInCarousel) return 0;
          return a.showInCarousel ? -1 : 1;
        })
    );
  }, [categories, searchTerm]);

  // 3. Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axios.patch(
        `${BASE_URL}/api/categories/${id}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  // 4. Image Upload Logic
  const handleImageChange = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingId(id);
    try {
      // In a real scenario, you'd upload the file to Cloudinary/S3 here
      // and get back a real URL.
      const imageUrl = "https://via.placeholder.com/800x400";

      await updateMutation.mutateAsync({
        id,
        payload: { carouselImage: imageUrl, showInCarousel: true },
      });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingId(null);
    }
  };

  // 5. Toggle Active/Inactive Status
  const toggleCarousel = (id, currentState) => {
    updateMutation.mutate({
      id,
      payload: { showInCarousel: !currentState },
    });
  };

  // 6. Remove Image Media
  const removeImage = (id) => {
    // Usually, if we remove the image, we should also take it down from carousel
    updateMutation.mutate({
      id,
      payload: { carouselImage: "", showInCarousel: false },
    });
  };

  return {
    filteredCategories,
    isLoading,
    isFetching,
    uploadingId,
    searchTerm,
    setSearchTerm,
    refetch,
    handleImageChange,
    toggleCarousel,
    removeImage,
    // Bonus: Helper to show stats in your header
    stats: {
      total: categories?.length || 0,
      active: categories?.filter((c) => c.showInCarousel).length || 0,
    },
  };
};
