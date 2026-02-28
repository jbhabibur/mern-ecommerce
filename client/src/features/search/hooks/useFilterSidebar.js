import { useState, useEffect } from "react";

export const useFilterSidebar = (
  initialPriceRange,
  maxPrice,
  updateFilters,
) => {
  const [localPrice, setLocalPrice] = useState(initialPriceRange);
  const [shouldShowRefined, setShouldShowRefined] = useState(false);

  // Sync slider when URL changes
  useEffect(() => {
    setLocalPrice(initialPriceRange);
  }, [initialPriceRange[0], initialPriceRange[1]]);

  const checkRefinedVisibility = (selectedStock, priceRange) => {
    const isPriceFiltered = priceRange[0] !== 0 || priceRange[1] !== maxPrice;
    const hasStockFilter =
      Array.isArray(selectedStock) && selectedStock.length > 0;
    setShouldShowRefined(hasStockFilter || isPriceFiltered);
  };

  const handleToggle = (value, selectedStock, priceRange, loading) => {
    if (loading) return;
    const currentStock = Array.isArray(selectedStock) ? selectedStock : [];
    const updated = currentStock.includes(value)
      ? currentStock.filter((i) => i !== value)
      : [...currentStock, value];
    updateFilters(updated, priceRange, null, null, false);
  };

  const handleClearAll = (loading) => {
    if (loading) return;
    updateFilters([], [0, maxPrice], null, null, false);
  };

  return {
    localPrice,
    setLocalPrice,
    shouldShowRefined,
    checkRefinedVisibility,
    handleToggle,
    handleClearAll,
  };
};
