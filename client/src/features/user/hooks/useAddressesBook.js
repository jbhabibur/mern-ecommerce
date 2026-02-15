import { useState, useEffect, useCallback } from "react";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/address", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch");
      setAddresses(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- NEW: Toggle Default Logic ---
  const toggleDefault = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/address/${addressId}/set-default`,
        {
          method: "PATCH", // or PUT depending on your backend
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Refresh the list so the UI reflects the change
      await fetchAddresses();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    isLoading,
    error,
    refreshAddresses: fetchAddresses,
    toggleDefault,
  };
};
