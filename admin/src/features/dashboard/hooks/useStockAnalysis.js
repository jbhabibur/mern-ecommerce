import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../../api/apiConfig";

export const useStockAnalysis = (page = 1) => {
  return useQuery({
    queryKey: ["stock-analysis", page],
    queryFn: async () => {
      const { data } = await axios.get(
        `${BASE_URL}/api/analytics/stock-analysis?page=${page}`,
      );

      return data.success ? data : { data: [], totalPages: 1 };
    },
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });
};
