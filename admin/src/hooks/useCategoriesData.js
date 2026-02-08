import { useState, useEffect } from "react";
import { getCategories } from "../features/storefront/services/categoryService";

export const useCategoriesData = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calling the service function
        const data = await getCategories(controller.signal);

        // Ensure we are setting an array
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Hook Error:", err);
          setError(err.response?.data?.message || "Failed to load categories");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup to prevent memory leaks if admin leaves the page
    return () => controller.abort();
  }, []);

  return { categories, loading, error };
};
