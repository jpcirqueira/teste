import { UseCase } from '@shared/types';
import { INewsRepository, UpdateNewsData } from '@application/ports/INewsRepository';
import { News } from '@domain/entities/News';
import { NotFoundError, ValidationError } from '@shared/errors/AppError';

export interface UpdateNewsRequest {
  id: string;
  data: UpdateNewsData;
}

export class UpdateNewsUseCase implements UseCase<UpdateNewsRequest, News> {
  constructor(private readonly newsRepository: INewsRepository) {}

  async execute(request: UpdateNewsRequest): Promise<News> {
    const existingNews = await this.newsRepository.findById(request.id);
    if (!existingNews) {
      throw new NotFoundError(`News with id ${request.id} not found`);
    }

    if (request.data.title !== undefined) {
      if (request.data.title.trim().length === 0) {
        throw new ValidationError('Title cannot be empty');
      }
      if (request.data.title.trim().length < 3) {
        throw new ValidationError('Title must be at least 3 characters long');
      }
      if (request.data.title.length > 255) {
        throw new ValidationError('Title must not exceed 255 characters');
      }
    }

    if (request.data.description !== undefined) {
      if (request.data.description.trim().length === 0) {
        throw new ValidationError('Description cannot be empty');
      }
      if (request.data.description.trim().length < 10) {
        throw new ValidationError('Description must be at least 10 characters long');
      }
    }

    const updatedData: UpdateNewsData = {};
    if (request.data.title !== undefined) {
      updatedData.title = request.data.title.trim();
    }
    if (request.data.description !== undefined) {
      updatedData.description = request.data.description.trim();
    }

    const updatedNews = await this.newsRepository.update(request.id, updatedData);
    
    if (!updatedNews) {
      throw new NotFoundError(`News with id ${request.id} not found`);
    }

    return updatedNews;
  }
}
