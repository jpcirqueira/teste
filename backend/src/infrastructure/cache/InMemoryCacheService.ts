import { ICacheService } from '@application/ports/ICacheService';

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

/**
 * In-Memory Cache Service Implementation
 * Simple cache implementation using a Map with TTL support
 */
export class InMemoryCacheService implements ICacheService {
  private cache: Map<string, CacheEntry<any>>;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor(cleanupIntervalMs: number = 60000) {
    this.cache = new Map();
    this.cleanupInterval = null;
    
    // Start automatic cleanup of expired entries
    this.startCleanup(cleanupIntervalMs);
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(intervalMs: number): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanExpiredEntries();
    }, intervalMs);
  }

  /**
   * Clean all expired entries from cache
   */
  private cleanExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt !== null && entry.expiresAt <= now) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Check if an entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    if (entry.expiresAt === null) {
      return false;
    }
    return entry.expiresAt <= Date.now();
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds !== undefined
      ? Date.now() + (ttlSeconds * 1000)
      : null;

    this.cache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async delPattern(pattern: string): Promise<void> {
    // Convert pattern to regex (e.g., "news:*" becomes /^news:.*$/)
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    const regex = new RegExp(`^${regexPattern}$`);

    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Deleted ${keysToDelete.length} keys matching pattern: ${pattern}`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Stop cleanup interval and clear cache
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}
