import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../../api/apiConfig";

export const useAddress = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // --- 1. Fetch Addresses (Query) ---
  const {
    data: addresses = [],
    isLoading: loading,
    error,
    refetch: refresh,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/address`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    },
    enabled: !!token,
  });

  // --- 2. Create Address (Mutation) ---
  const addMutation = useMutation({
    mutationFn: async (newAddress) => {
      const response = await fetch(`${BASE_URL}/api/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      if (!response.ok) throw new Error("Failed to add address");
      const result = await response.json();
      return result.data;
    },
    onSuccess: (newAddr) => {
      // Optimistically update the list by adding the new address to cache
      queryClient.setQueryData(["addresses"], (old) => [
        ...(old || []),
        newAddr,
      ]);
    },
  });

  // --- 3. Update Address (Mutation) ---
  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const response = await fetch(`${BASE_URL}/api/address/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Update failed");

      const result = await response.json();
      return result.data;
    },
    onSuccess: (updatedAddress) => {
      // Update the specific address in the cache without full reload
      queryClient.setQueryData(["addresses"], (oldAddresses) => {
        return oldAddresses.map((addr) =>
          addr._id === updatedAddress._id ? updatedAddress : addr,
        );
      });
    },
  });

  // --- 4. Delete Address (Mutation) ---
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${BASE_URL}/api/address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Delete failed");
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the deleted address from the cache
      queryClient.setQueryData(["addresses"], (old) =>
        old.filter((addr) => addr._id !== deletedId),
      );
    },
  });

  return {
    addresses,
    loading,
    error: error?.message,
    refresh,
    // API Actions
    addAddressApi: (data) => addMutation.mutateAsync(data),
    updateAddressApi: (id, updatedData) =>
      updateMutation.mutateAsync({ id, updatedData }),
    deleteAddressApi: (id) => deleteMutation.mutateAsync(id),
    // Loading States
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
