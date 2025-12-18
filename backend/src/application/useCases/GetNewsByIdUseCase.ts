import { UseCase } from '@shared/types';
import { INewsRepository } from '@application/ports/INewsRepository';
import { News } from '@domain/entities/News';
import { NotFoundError } from '@shared/errors/AppError';

export class GetNewsByIdUseCase implements UseCase<string, News> {
  constructor(private readonly newsRepository: INewsRepository) {}

  async execute(id: string): Promise<News> {
    const news = await this.newsRepository.findById(id);
    
    if (!news) {
      throw new NotFoundError(`News with id ${id} not found`);
    }

    return news;
  }
}
