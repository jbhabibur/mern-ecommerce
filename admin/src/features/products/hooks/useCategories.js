import { useState, useEffect } from "react";
import { fetchCategories } from "../services/productApi";

/**
 * Custom hook to manage the lifecycle of fetching categories.
 * Handles loading states and provides the data to the UI.
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);

        // Calling our API service
        const result = await fetchCategories();

        if (result.success) {
          setCategories(result.data);
        } else {
          setError(result.message || "Failed to load categories");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching categories.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, isLoading, error };
};
