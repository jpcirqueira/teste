import { CachedNewsRepository } from '../src/infrastructure/repositories/CachedNewsRepository';
import { INewsRepository, NewsFilters, PaginationParams } from '../src/application/ports/INewsRepository';
import { ICacheService } from '../src/application/ports/ICacheService';
import { News } from '../src/domain/entities/News';

describe('CachedNewsRepository', () => {
  let cachedRepository: CachedNewsRepository;
  let mockNewsRepository: jest.Mocked<INewsRepository>;
  let mockCacheService: jest.Mocked<ICacheService>;

  const mockNews = new News(
    '1',
    'Test News',
    'Test Description',
    new Date('2024-01-01'),
    new Date('2024-01-01')
  );

  const mockPaginatedNews = {
    data: [mockNews],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    // Create mock implementations
    mockNewsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      delPattern: jest.fn(),
    };

    cachedRepository = new CachedNewsRepository(
      mockNewsRepository,
      mockCacheService,
      300 // 5 minutes TTL
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return cached value on cache hit', async () => {
      const cachedData = {
        id: mockNews.id,
        title: mockNews.title,
        description: mockNews.description,
        createdAt: mockNews.createdAt,
        updatedAt: mockNews.updatedAt,
        deletedAt: mockNews.deletedAt,
      };

      mockCacheService.get.mockResolvedValue(cachedData);

      const result = await cachedRepository.findById('1');

      expect(result).toBeInstanceOf(News);
      expect(result?.id).toBe(mockNews.id);
      expect(mockCacheService.get).toHaveBeenCalledWith(expect.stringContaining('news:findById:1'));
      expect(mockNewsRepository.findById).not.toHaveBeenCalled();
    });

    it('should fetch from repository on cache miss and store in cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockNewsRepository.findById.mockResolvedValue(mockNews);

      const result = await cachedRepository.findById('1');

      expect(result).toBe(mockNews);
      expect(mockCacheService.get).toHaveBeenCalled();
      expect(mockNewsRepository.findById).toHaveBeenCalledWith('1');
      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.stringContaining('news:findById:1'),
        expect.objectContaining({ id: mockNews.id }),
        300
      );
    });

    it('should cache null result for non-existent item', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockNewsRepository.findById.mockResolvedValue(null);

      const result = await cachedRepository.findById('999');

      expect(result).toBeNull();
      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.stringContaining('news:findById:999'),
        null,
        60 // 1 minute TTL for null results
      );
    });
  });

  describe('findAll', () => {
    const filters: NewsFilters = { title: 'test' };
    const pagination: PaginationParams = { page: 1, limit: 10 };

    it('should return cached value on cache hit', async () => {
      const cachedData = {
        ...mockPaginatedNews,
        data: mockPaginatedNews.data.map(news => ({
          id: news.id,
          title: news.title,
          description: news.description,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt,
          deletedAt: news.deletedAt,
        })),
      };

      mockCacheService.get.mockResolvedValue(cachedData);

      const result = await cachedRepository.findAll(filters, pagination);

      expect(result.data.length).toBe(1);
      expect(result.data[0]).toBeInstanceOf(News);
      expect(mockCacheService.get).toHaveBeenCalled();
      expect(mockNewsRepository.findAll).not.toHaveBeenCalled();
    });

    it('should fetch from repository on cache miss and store in cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockNewsRepository.findAll.mockResolvedValue(mockPaginatedNews);

      const result = await cachedRepository.findAll(filters, pagination);

      expect(result).toBe(mockPaginatedNews);
      expect(mockNewsRepository.findAll).toHaveBeenCalledWith(filters, pagination);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.stringContaining('news:findAll'),
        expect.objectContaining({ total: 1 }),
        300
      );
    });

    it('should generate different cache keys for different filters', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockNewsRepository.findAll.mockResolvedValue(mockPaginatedNews);

      await cachedRepository.findAll({ title: 'test1' }, pagination);
      await cachedRepository.findAll({ title: 'test2' }, pagination);

      const calls = mockCacheService.get.mock.calls;
      expect(calls[0][0]).not.toBe(calls[1][0]);
    });
  });

  describe('create', () => {
    it('should create news and invalidate cache', async () => {
      const createData = { title: 'New News', description: 'New Description' };
      mockNewsRepository.create.mockResolvedValue(mockNews);

      const result = await cachedRepository.create(createData);

      expect(result).toBe(mockNews);
      expect(mockNewsRepository.create).toHaveBeenCalledWith(createData);
      expect(mockCacheService.delPattern).toHaveBeenCalledWith('news:*');
    });
  });

  describe('update', () => {
    it('should update news and invalidate cache', async () => {
      const updateData = { title: 'Updated Title' };
      mockNewsRepository.update.mockResolvedValue(mockNews);

      const result = await cachedRepository.update('1', updateData);

      expect(result).toBe(mockNews);
      expect(mockNewsRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(mockCacheService.delPattern).toHaveBeenCalledWith('news:*');
    });
  });

  describe('delete', () => {
    it('should delete news and invalidate cache when successful', async () => {
      mockNewsRepository.delete.mockResolvedValue(true);

      const result = await cachedRepository.delete('1');

      expect(result).toBe(true);
      expect(mockNewsRepository.delete).toHaveBeenCalledWith('1');
      expect(mockCacheService.delPattern).toHaveBeenCalledWith('news:*');
    });

    it('should not invalidate cache when delete fails', async () => {
      mockNewsRepository.delete.mockResolvedValue(false);

      const result = await cachedRepository.delete('999');

      expect(result).toBe(false);
      expect(mockNewsRepository.delete).toHaveBeenCalledWith('999');
      expect(mockCacheService.delPattern).not.toHaveBeenCalled();
    });
  });

  describe('cache key generation', () => {
    it('should generate consistent keys for same parameters', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockNewsRepository.findAll.mockResolvedValue(mockPaginatedNews);

      const filters: NewsFilters = { title: 'test' };
      const pagination: PaginationParams = { page: 1, limit: 10 };

      await cachedRepository.findAll(filters, pagination);
      await cachedRepository.findAll(filters, pagination);

      const calls = mockCacheService.get.mock.calls;
      expect(calls[0][0]).toBe(calls[1][0]);
    });
  });
});
