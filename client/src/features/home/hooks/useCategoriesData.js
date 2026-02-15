import { useQuery } from "@tanstack/react-query";
import { getCategoriesList } from "../../../services/categoryService";

export const useCategoriesData = () => {
  /**
   * React Query implementation:
   * isLoading (renamed to loading for compatibility): true if there is no cached data and the request is in flight.
   * data (renamed to categories): the filtered result of the API call.
   */
  const {
    data: categories = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["categoriesList"],
    queryFn: async () => {
      // Fetching specific fields including 'thumbnail'
      const response = await getCategoriesList(
        "name,thumbnail,slug,_id,showInCategories",
      );

      if (response.success) {
        // Filter logic: Only return categories with thumbnails and set to show on home
        return response.data.filter(
          (cat) => cat.thumbnail && cat.showInCategories === true,
        );
      }

      throw new Error("Failed to load categories");
    },
    // Industry standard: Categories change rarely, so we cache for 10 minutes
    staleTime: 1000 * 60 * 10,
  });

  return { categories, loading, error };
};
