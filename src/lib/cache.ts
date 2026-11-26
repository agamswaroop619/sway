/**
 * Simple TTL-based cache for API responses
 * Usage: Instead of making duplicate API calls, cache the result
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache entry with TTL (in milliseconds)
   */
  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Clear specific cache key
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Get or fetch data - prevents duplicate API calls
   * Usage: await cache.getOrFetch('collections', () => fetchCollections(), 10 * 60 * 1000)
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number = 5 * 60 * 1000
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) return cached;

    try {
      const data = await fetchFn();
      this.set(key, data, ttlMs);
      return data;
    } catch (error) {
      console.error(`Cache fetch failed for key: ${key}`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

/**
 * Hook-friendly cache wrapper for React components
 * Usage: const collections = useCachedFetch('collections', fetchCollections, 10 * 60 * 1000)
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs: number = 5 * 60 * 1000
): Promise<T> {
  return cacheManager.getOrFetch(key, fetchFn, ttlMs);
}
