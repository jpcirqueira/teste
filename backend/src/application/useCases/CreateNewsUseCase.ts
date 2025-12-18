import { UseCase } from '@shared/types';
import { INewsRepository, CreateNewsData } from '@application/ports/INewsRepository';
import { News } from '@domain/entities/News';
import { ValidationError } from '@shared/errors/AppError';

export class CreateNewsUseCase implements UseCase<CreateNewsData, News> {
  constructor(private readonly newsRepository: INewsRepository) {}

  async execute(request: CreateNewsData): Promise<News> {
    if (!request.title || request.title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }
    if (request.title.trim().length < 3) {
      throw new ValidationError('Title must be at least 3 characters long');
    }
    if (request.title.length > 255) {
      throw new ValidationError('Title must not exceed 255 characters');
    }

    if (!request.description || request.description.trim().length === 0) {
      throw new ValidationError('Description is required');
    }
    if (request.description.trim().length < 10) {
      throw new ValidationError('Description must be at least 10 characters long');
    }

    return await this.newsRepository.create({
      title: request.title.trim(),
      description: request.description.trim(),
    });
  }
}
