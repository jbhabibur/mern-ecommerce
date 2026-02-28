import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../api/apiConfig";

export const useSearch = (overrideQuery) => {
  const [products, setProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const debounceTimer = useRef(null);

  const rawQuery =
    overrideQuery !== undefined ? overrideQuery : searchParams.get("q") || "";

  /* -------------------- Dynamic Max Price -------------------- */
  const maxPriceInRange = useMemo(() => {
    if (!products.length) return 0;
    return Math.max(...products.map((p) => Number(p.price) || 0));
  }, [products]);

  /* -------------------- URL Derived States -------------------- */
  const selectedStock = searchParams.getAll("filter.v.availability");
  const priceRange = useMemo(() => {
    const gte = parseInt(searchParams.get("filter.v.price.gte")) || 0;
    const lteParam = searchParams.get("filter.v.price.lte");
    const lte = lteParam ? parseInt(lteParam) : maxPriceInRange;
    return [gte, lte];
  }, [searchParams, maxPriceInRange]);

  const itemsPerPage = parseInt(searchParams.get("limit")) || 12;
  const sortOption = searchParams.get("sort") || "featured";

  /* -------------------- Update Filters -------------------- */
  const updateFilters = useCallback(
    async (newStock, newPrice, newLimit, newSort, forceUpdate = false) => {
      setFilterLoading(true);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      const applyChanges = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("filter.v.availability");
        newStock.forEach((val) => params.append("filter.v.availability", val));
        params.set("filter.v.price.gte", newPrice[0]);
        params.set("filter.v.price.lte", newPrice[1]);
        params.set("limit", newLimit ?? itemsPerPage);
        params.set("sort", newSort ?? sortOption);
        setSearchParams(params, { replace: true });
      };

      if (forceUpdate) {
        applyChanges();
        setFilterLoading(false);
      } else {
        debounceTimer.current = setTimeout(() => {
          applyChanges();
          setFilterLoading(false);
        }, 800);
      }
    },
    [searchParams, setSearchParams, itemsPerPage, sortOption],
  );

  /* -------------------- Fetch Search Data -------------------- */
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const url = rawQuery
          ? `${BASE_URL}/api/products/search?query=${encodeURIComponent(rawQuery)}`
          : `${BASE_URL}/api/products/popular`;

        const { data } = await axios.get(url);
        if (mounted) {
          const results = data?.data || (Array.isArray(data) ? data : []);
          setProducts(results);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setDataLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [rawQuery]);

  /* -------------------- Local Data Processing -------------------- */
  const processedData = useMemo(() => {
    const enriched = products.map((p) => {
      const variants = p.variants || [];
      const isAllSizesInStock =
        variants.length > 0 && variants.every((v) => v.stock > 0);
      const isOutOfStock =
        variants.length === 0 || variants.some((v) => v.stock === 0);
      return { ...p, isAllSizesInStock, isOutOfStock };
    });

    const inStockCount = enriched.filter((p) => p.isAllSizesInStock).length;
    const outOfStockCount = enriched.filter((p) => p.isOutOfStock).length;

    let filtered = enriched.filter((p) => {
      const stockMatch =
        !selectedStock.length ||
        (selectedStock.includes("1") && p.isAllSizesInStock) ||
        (selectedStock.includes("0") && p.isOutOfStock);
      const price = p.price || 0;
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];
      return stockMatch && priceMatch;
    });

    if (sortOption === "price-low")
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortOption === "price-high")
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));

    return {
      paginatedProducts: filtered.slice(0, itemsPerPage),
      totalFound: filtered.length,
      inStockCount,
      outOfStockCount,
    };
  }, [
    products,
    itemsPerPage,
    sortOption,
    selectedStock.join(","),
    priceRange.join("-"),
  ]);

  return {
    products: processedData.paginatedProducts,
    loading: dataLoading || filterLoading,
    error,
    inStockCount: processedData.inStockCount,
    outOfStockCount: processedData.outOfStockCount,
    totalFound: processedData.totalFound,
    maxPriceInRange,
    selectedStock,
    priceRange,
    itemsPerPage,
    sortOption,
    query: rawQuery,
    updateFilters,
  };
};
