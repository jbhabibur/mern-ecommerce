import { QueryClient } from "@tanstack/react-query";

/**
 * Global React Query configuration
 * Placed in the config folder as it defines the behavior of the data layer.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains "fresh" for 5 minutes (Industry Standard)
      staleTime: 1000 * 60 * 5,
      // Cache stays in memory for 30 minutes
      gcTime: 1000 * 60 * 30,
      // Prevents refetching when window is refocused
      refetchOnWindowFocus: false,
      // Retries failed API calls once
      retry: 1,
    },
  },
});
