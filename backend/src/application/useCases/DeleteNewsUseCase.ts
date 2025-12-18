import { UseCase } from '@shared/types';
import { INewsRepository } from '@application/ports/INewsRepository';
import { NotFoundError } from '@shared/errors/AppError';

export class DeleteNewsUseCase implements UseCase<string, void> {
  constructor(private readonly newsRepository: INewsRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.newsRepository.delete(id);
    
    if (!deleted) {
      throw new NotFoundError(`News with id ${id} not found`);
    }
  }
}
