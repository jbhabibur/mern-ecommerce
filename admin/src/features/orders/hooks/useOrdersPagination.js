import { useState, useMemo } from "react";
import { useGetOrdersQuery } from "../../../redux/service/adminOrderApi";

export const useOrdersPagination = (initialLimit = 8) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // RTK Query: Fetching data from server based on page
  const { data, isLoading, isError, error, isFetching } = useGetOrdersQuery({
    page: currentPage,
    limit: initialLimit,
  });

  // Extracting data from response
  const orders = data?.orders || [];
  const pagination = data?.pagination || {
    totalOrders: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Searching logic (Since search happens on the fetched page data)
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const s = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        o._id.toLowerCase().includes(s) ||
        o.billingAddress?.fullName?.toLowerCase().includes(s) ||
        o.billingAddress?.phoneNumber?.includes(s),
    );
  }, [orders, searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  return {
    orders: filteredOrders,
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
