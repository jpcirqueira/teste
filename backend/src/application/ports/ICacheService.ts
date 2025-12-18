/**
 * Cache Service Port
 * Defines the contract for cache operations
 */
export interface ICacheService {
  /**
   * Get a value from cache
   * @param key - The cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set a value in cache
   * @param key - The cache key
   * @param value - The value to cache
   * @param ttlSeconds - Time to live in seconds (optional)
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Delete a specific key from cache
   * @param key - The cache key to delete
   */
  del(key: string): Promise<void>;

  /**
   * Delete all keys matching a pattern
   * @param pattern - The pattern to match (e.g., "news:*")
   */
  delPattern(pattern: string): Promise<void>;
}
