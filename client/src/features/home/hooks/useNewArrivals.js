import { useState, useEffect } from "react";
import { API_URLS } from "../../../api/API_URLS";

export const useNewArrivals = (initialLimit = 8) => {
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(initialLimit);

  useEffect(() => {
    const getNewArrivals = async () => {
      try {
        const response = await fetch(API_URLS.NEW_ARRIVALS);
        if (!response.ok) {
          throw new Error("Data fetch korte somossya hochche");
        }
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };
    getNewArrivals();
  }, []);

  const handleLoadMore = () => {
    setIsMoreLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + initialLimit);
      setIsMoreLoading(false);
    }, 1500);
  };

  return {
    products,
    initialLoading,
    isMoreLoading,
    error,
    visibleCount,
    handleLoadMore,
    totalProducts: products.length,
  };
};
