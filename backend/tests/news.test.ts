import { CreateNewsUseCase } from '../src/application/useCases/CreateNewsUseCase';
import { INewsRepository } from '../src/application/ports/INewsRepository';
import { News } from '../src/domain/entities/News';
import { ValidationError } from '../src/shared/errors/AppError';

describe('CreateNewsUseCase - BDD Tests', () => {
  let createNewsUseCase: CreateNewsUseCase;
  let mockNewsRepository: jest.Mocked<INewsRepository>;

  beforeEach(() => {
    mockNewsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createNewsUseCase = new CreateNewsUseCase(mockNewsRepository);
  });

  describe('Given valid news data', () => {
    it('should create a news article with title and description', async () => {
      // Arrange - Preparar os dados
      const newsData = {
        title: 'Valid News Title',
        description: 'This is a valid description with more than 10 characters',
      };

      const expectedNews = new News(
        '123e4567-e89b-12d3-a456-426614174000',
        newsData.title,
        newsData.description,
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T00:00:00.000Z'),
        undefined
      );

      mockNewsRepository.create.mockResolvedValue(expectedNews);

      // Act - Executar a ação
      const result = await createNewsUseCase.execute(newsData);

      // Assert - Verificar o resultado
      expect(result).toBeDefined();
      expect(result.id).toBe(expectedNews.id);
      expect(result.title).toBe(newsData.title);
      expect(result.description).toBe(newsData.description);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(mockNewsRepository.create).toHaveBeenCalledWith({
        title: newsData.title,
        description: newsData.description,
      });
      expect(mockNewsRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should trim whitespace from title and description before creating', async () => {
      // Arrange
      const newsDataWithSpaces = {
        title: '  Valid News Title  ',
        description: '  This is a valid description with spaces  ',
      };

      const expectedNews = new News(
        '123e4567-e89b-12d3-a456-426614174000',
        'Valid News Title',
        'This is a valid description with spaces',
        new Date(),
        new Date(),
        undefined
      );

      mockNewsRepository.create.mockResolvedValue(expectedNews);

      // Act
      const result = await createNewsUseCase.execute(newsDataWithSpaces);

      // Assert
      expect(result.title).toBe('Valid News Title');
      expect(result.description).toBe('This is a valid description with spaces');
      expect(mockNewsRepository.create).toHaveBeenCalledWith({
        title: 'Valid News Title',
        description: 'This is a valid description with spaces',
      });
    });
  });

  describe('Given invalid news data', () => {
    it('should throw ValidationError when title is missing', async () => {
      // Arrange
      const invalidData = {
        title: '',
        description: 'Valid description with more than 10 characters',
      };

      // Act & Assert
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow(ValidationError);
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow('Title is required');
      expect(mockNewsRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when title is too short', async () => {
      // Arrange
      const invalidData = {
        title: 'Ab',
        description: 'Valid description with more than 10 characters',
      };

      // Act & Assert
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow(ValidationError);
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow(
        'Title must be at least 3 characters long'
      );
      expect(mockNewsRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when title exceeds maximum length', async () => {
      // Arrange
      const longTitle = 'A'.repeat(256); // 256 characters
      const invalidData = {
        title: longTitle,
        description: 'Valid description with more than 10 characters',
      };

      // Act & Assert
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow(ValidationError);
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow(
        'Title must not exceed 255 characters'
      );
      expect(mockNewsRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when description is missing', async () => {
      // Arrange
      const invalidData = {
        title: 'Valid Title',
        description: '',
      };

      // Act & Assert
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow(ValidationError);
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow('Description is required');
      expect(mockNewsRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when description is too short', async () => {
      // Arrange
      const invalidData = {
        title: 'Valid Title',
        description: 'Short',
      };

      // Act & Assert
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow(ValidationError);
      await expect(createNewsUseCase.execute(invalidData)).rejects.toThrow(
        'Description must be at least 10 characters long'
      );
      expect(mockNewsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Given edge cases', () => {
    it('should accept title with exactly 3 characters (minimum valid)', async () => {
      // Arrange
      const newsData = {
        title: 'ABC',
        description: 'Valid description with enough characters',
      };

      const expectedNews = new News(
        '123e4567-e89b-12d3-a456-426614174000',
        newsData.title,
        newsData.description,
        new Date(),
        new Date(),
        undefined
      );

      mockNewsRepository.create.mockResolvedValue(expectedNews);

      // Act
      const result = await createNewsUseCase.execute(newsData);

      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe('ABC');
      expect(mockNewsRepository.create).toHaveBeenCalled();
    });

    it('should accept description with exactly 10 characters (minimum valid)', async () => {
      // Arrange
      const newsData = {
        title: 'Valid Title',
        description: '1234567890', // Exactly 10 characters
      };

      const expectedNews = new News(
        '123e4567-e89b-12d3-a456-426614174000',
        newsData.title,
        newsData.description,
        new Date(),
        new Date(),
        undefined
      );

      mockNewsRepository.create.mockResolvedValue(expectedNews);

      // Act
      const result = await createNewsUseCase.execute(newsData);

      // Assert
      expect(result).toBeDefined();
      expect(result.description).toBe('1234567890');
      expect(mockNewsRepository.create).toHaveBeenCalled();
    });
  });
});

describe('DeleteNewsUseCase - Soft Delete Tests', () => {
  let deleteNewsUseCase: any;
  let mockNewsRepository: jest.Mocked<INewsRepository>;

  beforeEach(() => {
    mockNewsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    
    // Import DeleteNewsUseCase dynamically
    const { DeleteNewsUseCase } = require('../src/application/useCases/DeleteNewsUseCase');
    deleteNewsUseCase = new DeleteNewsUseCase(mockNewsRepository);
  });

  describe('Given a valid news ID', () => {
    it('should perform soft delete successfully', async () => {
      // Arrange
      const newsId = '123e4567-e89b-12d3-a456-426614174000';
      mockNewsRepository.delete.mockResolvedValue(true);

      // Act
      await deleteNewsUseCase.execute(newsId);

      // Assert
      expect(mockNewsRepository.delete).toHaveBeenCalledWith(newsId);
      expect(mockNewsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Given an invalid news ID', () => {
    it('should throw NotFoundError when news does not exist', async () => {
      // Arrange
      const newsId = 'non-existent-id';
      mockNewsRepository.delete.mockResolvedValue(false);

      // Act & Assert
      const { NotFoundError } = require('../src/shared/errors/AppError');
      await expect(deleteNewsUseCase.execute(newsId)).rejects.toThrow(NotFoundError);
    });
  });
});
