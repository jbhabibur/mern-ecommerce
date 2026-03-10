import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../../api/apiConfig";

export const useRevenueStats = () => {
  return useQuery({
    queryKey: ["monthly-revenue"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${BASE_URL}/api/analytics/monthly-revenue-stats`,
      );
      return data.success ? data.data : [];
    },
  });
};
