import { useState, useMemo, useEffect } from "react";
import { useGetOrdersQuery } from "../../../redux/service/adminOrderApi";

// Added statusFilter as the second parameter
export const useOrdersPagination = (initialLimit = 8, statusFilter = "") => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // 1. Notun state debounced value-r jonno
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 2. Debounce logic: User type kora thamanor 500ms por search trigger hobe
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset to page 1 whenever search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  // RTK Query: search-e ekhon debouncedSearch pass korbe
  const { data, isLoading, isError, error, isFetching } = useGetOrdersQuery({
    page: currentPage,
    limit: initialLimit,
    search: debouncedSearch, // Passing the delayed search term
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return {
    orders,
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
