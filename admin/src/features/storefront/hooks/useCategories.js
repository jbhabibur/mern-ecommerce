import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Added search state

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

  // --- Search & Sorting Logic ---
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    return categories
      .filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        // Active (showInCategories: true) items move to the top
        if (a.showInCategories === b.showInCategories) return 0;
        return a.showInCategories ? -1 : 1;
      });
  }, [categories, searchTerm]);

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

  return {
    categories: filteredCategories, // Return filtered/sorted list
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
    isFetching,
    pendingId,
    loadCategories,
    handleToggle,
  };
};
