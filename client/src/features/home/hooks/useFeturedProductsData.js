import { useState, useEffect } from "react";
import { fetchPopularProducts } from "../../../services/productService";

/**
 * Custom hook to fetch and manage featured (popular) products
 */
export const useFeturedProductsData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Controller to prevent memory leaks if component unmounts
    let isMounted = true;

    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchPopularProducts();

        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load featured products");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
};
