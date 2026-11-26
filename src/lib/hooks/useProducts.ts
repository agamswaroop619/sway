import { useQuery } from "@tanstack/react-query";
import { Item } from "@/lib/features/items/items";
import { getData as getDataFromFirebase } from "@/app/utils/getData";

/**
 * Custom hook for fetching products using React Query
 * 
 * Benefits:
 * - Automatic request deduplication (multiple calls → single fetch)
 * - Built-in caching with stale-while-revalidate pattern
 * - Automatic retry on failure
 * - Background refetch on interval or window focus
 * 
 * Usage:
 *   const { data, isLoading, error } = useProducts();
 */
export function useProducts() {
  return useQuery<Item[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await getDataFromFirebase();
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

/**
 * Custom hook for fetching collections
 * 
 * Caches collection list for 1 hour since collections rarely change
 */
export function useCollections() {
  return useQuery<string[], Error>({
    queryKey: ["collections"],
    queryFn: async () => {
      // This would typically be a separate API call
      // For now, we extract from products data
      const products = await getDataFromFirebase();
      const collectionSet = new Set(products?.map((p) => p.collection) || []);
      return Array.from(collectionSet);
    },
    staleTime: 1000 * 60 * 60, // 1 hour - collections change rarely
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}

/**
 * Custom hook for fetching a single product by ID
 */
export function useProductById(productId: string) {
  return useQuery<Item | undefined, Error>({
    queryKey: ["products", productId],
    queryFn: async () => {
      const products = await getDataFromFirebase();
      return products?.find((p) => p.id === productId);
    },
    enabled: !!productId, // Don't fetch if productId is empty
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
