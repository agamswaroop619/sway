import { QueryClient } from "@tanstack/react-query";

/**
 * Query Client Configuration for React Query
 * 
 * Settings:
 * - staleTime: 5 minutes - Data considered fresh for 5 min (no refetch on mount)
 * - gcTime: 10 minutes - Unused data kept in memory for 10 min
 * - retry: 2 - Retry failed requests twice before giving up
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      refetchOnReconnect: true, // Refetch when connection restored
    },
  },
});
