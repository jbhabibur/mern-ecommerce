import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../api/apiConfig";

export const useTopPerformingItems = () => {
  return useQuery({
    queryKey: ["topPerformingItems"],
    queryFn: async () => {
      // Retrieve auth token from local storage
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${BASE_URL}/api/analytics/top-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);

      // Returns the data array from backend response
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // Cache remains fresh for 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });
};
