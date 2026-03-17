import { useState, useMemo, useEffect } from "react";
import { useGetOrdersQuery } from "../../../redux/service/adminOrderApi";

// Added statusFilter as the second parameter
export const useOrdersPagination = (initialLimit = 8, statusFilter = "") => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset to page 1 whenever search or filter changes to avoid "empty page" bugs
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // RTK Query: Pass page, limit, search, and status to the server
  const { data, isLoading, isError, error, isFetching } = useGetOrdersQuery({
    page: currentPage,
    limit: initialLimit,
    search: searchTerm,
    status: statusFilter,
  });

  // Extracting data from response
  const orders = data?.orders || [];
  const pagination = data?.pagination || {
    totalOrders: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  /**
   * Note: We no longer need local useMemo filtering because
   * the server is now handling the search and status filter globally.
   */

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return {
    orders, // Returning global results from server
    pagination,
    currentPage,
    searchTerm,
    isLoading,
    isFetching,
    isError,
    error,
    handlePageChange,
    handleSearchChange,
  };
};
