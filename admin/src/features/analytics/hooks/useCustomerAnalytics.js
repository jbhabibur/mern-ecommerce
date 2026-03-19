import { useState, useEffect, useCallback, useMemo } from "react";
import { useGetCustomerInsightsQuery } from "../../../redux/service/analyticsApi";

/**
 * Custom Hook for managing Paginated Customer Analytics.
 * Handles customer list merging and extracts chart/stat data.
 */
export const useCustomerAnalytics = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [customerList, setCustomerList] = useState([]);

  // Fetch data from API based on current page
  const { data, isLoading, isFetching } = useGetCustomerInsightsQuery({
    page: currentPage,
    limit: 8,
  });

  // Extract pagination and stats from the response
  const pagination = data?.data?.pagination || {};
  const stats = data?.data?.stats || {};

  /**
   * Memoized Chart Data
   * This ensures charts only re-render when the actual data changes.
   */
  const growthData = useMemo(() => data?.data?.growthData || [], [data]);
  const retentionData = useMemo(() => data?.data?.retentionData || [], [data]);

  useEffect(() => {
    const newCustomers = data?.data?.customers;

    if (newCustomers && newCustomers.length > 0) {
      if (currentPage === 1) {
        // Reset list on first page (or search/reset)
        setCustomerList(newCustomers);
      } else {
        // Append unique customers only to prevent duplicates during infinite scroll
        setCustomerList((prev) => {
          const existingIds = new Set(prev.map((c) => c.id || c.email));
          const uniqueNewItems = newCustomers.filter(
            (c) => !existingIds.has(c.id || c.email),
          );
          return [...prev, ...uniqueNewItems];
        });
      }
    }
  }, [data, currentPage]);

  /**
   * Trigger next page fetch
   */
  const loadMore = useCallback(() => {
    if (pagination.hasMore && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination.hasMore, isFetching]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setCustomerList([]);
  }, []);

  return {
    stats,
    growthData,
    retentionData,
    customers: customerList,
    pagination,
    isLoading,
    isFetchingMore: isFetching && currentPage > 1,
    loadMore,
    reset,
  };
};
