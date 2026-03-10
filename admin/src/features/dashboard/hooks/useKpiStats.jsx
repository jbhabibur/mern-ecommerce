import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../api/apiConfig";

/**
 * Hook to fetch unified KPI statistics including revenue and order counts.
 */
export const useKpiStats = () => {
  return useQuery({
    queryKey: ["kpiStats"], // Updated key for better semantic meaning
    queryFn: async () => {
      // Retrieve auth token from local storage
      const token = localStorage.getItem("token");

      // Updated endpoint to match the new route name
      const { data } = await axios.get(`${BASE_URL}/api/analytics/kpi-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Meme", data.data);

      // Returns the unified stats object (totalRevenue, todayOrders, pendingOrders, etc.)
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    retry: 2, // Retry failed requests twice
  });
};
