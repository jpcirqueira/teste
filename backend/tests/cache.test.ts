import { InMemoryCacheService } from '../src/infrastructure/cache/InMemoryCacheService';

describe('InMemoryCacheService', () => {
  let cacheService: InMemoryCacheService;

  beforeEach(() => {
    // Create a new cache service before each test with short cleanup interval for testing
    cacheService = new InMemoryCacheService(100);
  });

  afterEach(() => {
    // Clean up after each test
    cacheService.destroy();
  });

  describe('get and set', () => {
    it('should set and get a value', async () => {
      await cacheService.set('test:key', 'test value');
      const value = await cacheService.get<string>('test:key');
      expect(value).toBe('test value');
    });

    it('should return null for non-existent key', async () => {
      const value = await cacheService.get('non:existent');
      expect(value).toBeNull();
    });

    it('should store and retrieve complex objects', async () => {
      const testObject = {
        id: '1',
        name: 'Test',
        nested: { value: 42 },
      };

      await cacheService.set('test:object', testObject);
      const retrieved = await cacheService.get<typeof testObject>('test:object');

      expect(retrieved).toEqual(testObject);
    });

    it('should overwrite existing value', async () => {
      await cacheService.set('test:key', 'first value');
      await cacheService.set('test:key', 'second value');
      
      const value = await cacheService.get<string>('test:key');
      expect(value).toBe('second value');
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire value after TTL', async () => {
      await cacheService.set('test:expiring', 'will expire', 1); // 1 second TTL
      
      // Value should exist immediately
      let value = await cacheService.get<string>('test:expiring');
      expect(value).toBe('will expire');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Value should be expired
      value = await cacheService.get<string>('test:expiring');
      expect(value).toBeNull();
    });

    it('should not expire value without TTL', async () => {
      await cacheService.set('test:permanent', 'no expiration');
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 500));

      const value = await cacheService.get<string>('test:permanent');
      expect(value).toBe('no expiration');
    });

    it('should clean expired entries automatically', async () => {
      // Set multiple values with short TTL
      await cacheService.set('test:expire1', 'value1', 0.1); // 100ms
      await cacheService.set('test:expire2', 'value2', 0.1);
      await cacheService.set('test:permanent', 'value3');

      // Wait for expiration and cleanup
      await new Promise(resolve => setTimeout(resolve, 300));

      const stats = cacheService.getStats();
      expect(stats.keys).toContain('test:permanent');
      expect(stats.keys).not.toContain('test:expire1');
      expect(stats.keys).not.toContain('test:expire2');
    });
  });

  describe('del', () => {
    it('should delete a specific key', async () => {
      await cacheService.set('test:key1', 'value1');
      await cacheService.set('test:key2', 'value2');

      await cacheService.del('test:key1');

      expect(await cacheService.get('test:key1')).toBeNull();
      expect(await cacheService.get('test:key2')).toBe('value2');
    });

    it('should not throw error when deleting non-existent key', async () => {
      await expect(cacheService.del('non:existent')).resolves.not.toThrow();
    });
  });

  describe('delPattern', () => {
    beforeEach(async () => {
      // Setup test data
      await cacheService.set('news:list:1', 'news list 1');
      await cacheService.set('news:list:2', 'news list 2');
      await cacheService.set('news:item:123', 'news item 123');
      await cacheService.set('users:list:1', 'users list 1');
      await cacheService.set('other:key', 'other value');
    });

    it('should delete all keys matching wildcard pattern', async () => {
      await cacheService.delPattern('news:*');

      expect(await cacheService.get('news:list:1')).toBeNull();
      expect(await cacheService.get('news:list:2')).toBeNull();
      expect(await cacheService.get('news:item:123')).toBeNull();
      expect(await cacheService.get('users:list:1')).toBe('users list 1');
      expect(await cacheService.get('other:key')).toBe('other value');
    });

    it('should delete keys matching specific pattern', async () => {
      await cacheService.delPattern('news:list:*');

      expect(await cacheService.get('news:list:1')).toBeNull();
      expect(await cacheService.get('news:list:2')).toBeNull();
      expect(await cacheService.get('news:item:123')).toBe('news item 123');
      expect(await cacheService.get('users:list:1')).toBe('users list 1');
    });

    it('should handle pattern with no matches', async () => {
      await cacheService.delPattern('nonexistent:*');

      // All original keys should still exist
      expect(await cacheService.get('news:list:1')).toBe('news list 1');
      expect(await cacheService.get('users:list:1')).toBe('users list 1');
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      await cacheService.set('key3', 'value3');

      const stats = cacheService.getStats();

      expect(stats.size).toBe(3);
      expect(stats.keys).toEqual(expect.arrayContaining(['key1', 'key2', 'key3']));
    });

    it('should return empty stats for empty cache', () => {
      const stats = cacheService.getStats();

      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      await cacheService.set('key3', 'value3');

      cacheService.clear();

      const stats = cacheService.getStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('destroy', () => {
    it('should stop cleanup interval and clear cache', async () => {
      await cacheService.set('key1', 'value1');
      
      cacheService.destroy();

      const stats = cacheService.getStats();
      expect(stats.size).toBe(0);
    });
  });
});
