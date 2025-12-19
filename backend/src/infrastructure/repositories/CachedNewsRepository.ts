import { 
  INewsRepository, 
  CreateNewsData, 
  UpdateNewsData, 
  NewsFilters, 
  PaginationParams, 
  PaginatedNews 
} from '@application/ports/INewsRepository';
import { ICacheService } from '@application/ports/ICacheService';
import { News } from '@domain/entities/News';

/**
 * Cached News Repository using Decorator Pattern
 * Wraps the original NewsRepository with caching capabilities
 */
export class CachedNewsRepository implements INewsRepository {
  private readonly CACHE_PREFIX = 'news';
  private readonly defaultTTL: number;

  constructor(
    private readonly newsRepository: INewsRepository,
    private readonly cacheService: ICacheService,
    cacheTTLSeconds: number = 300 // Default 5 minutes
  ) {
    this.defaultTTL = cacheTTLSeconds;
  }

  /**
   * Generate a unique cache key based on operation and parameters
   */
  private generateCacheKey(operation: string, ...params: any[]): string {
    const paramsString = params
      .map(param => {
        if (typeof param === 'object' && param !== null) {
          return JSON.stringify(param);
        }
        return String(param);
      })
      .join(':');

    return `${this.CACHE_PREFIX}:${operation}:${paramsString}`;
  }

  /**
   * Invalidate all news-related cache entries
   */
  private async invalidateCache(): Promise<void> {
    await this.cacheService.delPattern(`${this.CACHE_PREFIX}:*`);
  }

  async create(data: CreateNewsData): Promise<News> {
    const result = await this.newsRepository.create(data);
    // Invalidate cache after creating new news
    await this.invalidateCache();
    return result;
  }

  async findById(id: string): Promise<News | null> {
    const cacheKey = this.generateCacheKey('findById', id);
    
    // Try to get from cache
    const cached = await this.cacheService.get<News | null>(cacheKey);
    if (cached !== null) {
      console.log(`[Cache HIT] ${cacheKey}`);
      // Reconstruct News domain object from cached data
      if (cached) {
        return new News(
          cached.id,
          cached.title,
          cached.description,
          cached.createdAt,
          cached.updatedAt,
          cached.deletedAt
        );
      }
      return null;
    }

    console.log(`[Cache MISS] ${cacheKey}`);
    // Get from repository
    const result = await this.newsRepository.findById(id);
    
    // Store in cache (store as plain object)
    if (result) {
      const cacheData = {
        id: result.id,
        title: result.title,
        description: result.description,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        deletedAt: result.deletedAt,
      };
      await this.cacheService.set(cacheKey, cacheData, this.defaultTTL);
    } else {
      // Cache null result to prevent repeated queries for non-existent items
      await this.cacheService.set(cacheKey, null, 60); // Cache null for 1 minute
    }
    
    return result;
  }

  async findAll(filters: NewsFilters, pagination: PaginationParams): Promise<PaginatedNews> {
    const cacheKey = this.generateCacheKey('findAll', filters, pagination);
    
    // Try to get from cache
    const cached = await this.cacheService.get<PaginatedNews>(cacheKey);
    if (cached !== null) {
      console.log(`[Cache HIT] ${cacheKey}`);
      // Reconstruct News domain objects from cached data
      return {
        ...cached,
        data: cached.data.map(item => new News(
          item.id,
          item.title,
          item.description,
          item.createdAt,
          item.updatedAt,
          item.deletedAt
        )),
      };
    }

    console.log(`[Cache MISS] ${cacheKey}`);
    // Get from repository
    const result = await this.newsRepository.findAll(filters, pagination);
    
    // Store in cache (convert to plain objects)
    const cacheData = {
      ...result,
      data: result.data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      })),
    };
    await this.cacheService.set(cacheKey, cacheData, this.defaultTTL);
    
    return result;
  }

  async update(id: string, data: UpdateNewsData): Promise<News | null> {
    const result = await this.newsRepository.update(id, data);
    // Invalidate cache after updating news
    await this.invalidateCache();
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.newsRepository.delete(id);
    // Invalidate cache after deleting news
    if (result) {
      await this.invalidateCache();
    }
    return result;
  }
}
