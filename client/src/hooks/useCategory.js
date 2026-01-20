import { useState, useEffect, useMemo } from "react";
import { fetchCategoryProducts } from "../api/productApi";

/**
 * Custom hook to manage category data, product filtering,
 * and specific stock availability states (In Stock, Partial, or Notify Me).
 */
export const useCategory = (slug) => {
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({
    title: "",
    description: "",
    banner: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtering States for Sidebar
  const [selectedStock, setSelectedStock] = useState([]); // Array like ['in-stock', 'out-of-stock']
  const [priceRange, setPriceRange] = useState([0, 5000]); // [min, max]

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchCategoryProducts(slug);

        if (data.success && isMounted) {
          const fetchedProducts = data.products || [];
          setProducts(fetchedProducts);

          // Update Category Meta Data (Banner, Title, etc.)
          setCategoryInfo({
            title: data.categoryData?.title || "",
            description: data.categoryData?.description || "",
            banner: data.categoryData?.banner || "",
          });

          // Dynamic Price Adjustment: Set max price based on actual products in this category
          if (fetchedProducts.length > 0) {
            const prices = fetchedProducts.map((p) => p.price || 0);
            const maxPriceInData = Math.max(...prices);
            setPriceRange([0, maxPriceInData]);
          } else {
            setPriceRange([0, 5000]); // Default fallback
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  /**
   * Memoized Logic: Processes products to add availability flags
   * and applies active filters (Stock and Price).
   */
  const processedData = useMemo(() => {
    let totalInStockCount = 0;

    // Phase 1: Enrich products with logical flags for the UI (Button States)
    const productsWithStatus = products.map((p) => {
      const variants = p.variants || [];

      // Logic: Product is completely sold out if every variant has 0 stock
      const isCompletelyEmpty =
        variants.length > 0 && variants.every((v) => v.stock === 0);

      // Logic: Product is fully stocked if every variant has more than 0 stock
      const isAllSizesInStock =
        variants.length > 0 && variants.every((v) => v.stock > 0);

      // Determine the specific string for Button text/logic in the frontend
      let displayStatus = "";
      if (isCompletelyEmpty) {
        displayStatus = "NOTIFY_ME"; // UI should show "Notify Me" button
      } else if (isAllSizesInStock) {
        displayStatus = "ADD_TO_CART"; // UI should show "Add to Cart" button
      } else {
        displayStatus = "SELECT_SIZE"; // UI should show "Select Size" (Partial Stock)
      }

      return {
        ...p,
        isAllSizesInStock,
        isCompletelyEmpty,
        displayStatus,
      };
    });

    // Phase 2: Apply Filters
    const filtered = productsWithStatus.filter((p) => {
      // Stock Filtering Logic
      const stockMatch =
        selectedStock.length === 0 ||
        (selectedStock.includes("in-stock") && p.isAllSizesInStock) ||
        (selectedStock.includes("out-of-stock") && p.isCompletelyEmpty);

      // Price Range Filtering Logic
      const productPrice = p.price || 0;
      const priceMatch =
        productPrice >= priceRange[0] && productPrice <= priceRange[1];

      // Global count: Increment if product is fully stocked (ignoring active filters)
      if (p.isAllSizesInStock) totalInStockCount++;

      return stockMatch && priceMatch;
    });

    return {
      filteredProducts: filtered,
      inStockCount: totalInStockCount,
      outOfStockCount: products.length - totalInStockCount,
    };
  }, [products, selectedStock, priceRange]);

  return {
    products: processedData.filteredProducts,
    categoryInfo,
    loading,
    error,
    inStockCount: processedData.inStockCount,
    outOfStockCount: processedData.outOfStockCount,
    selectedStock,
    setSelectedStock,
    priceRange,
    setPriceRange,
  };
};
