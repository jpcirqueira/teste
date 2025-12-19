import { UseCase } from '@shared/types';
import { INewsRepository, NewsFilters, PaginationParams, PaginatedNews } from '@application/ports/INewsRepository';

export interface ListNewsRequest {
  filters: NewsFilters;
  pagination: PaginationParams;
}

export class ListNewsUseCase implements UseCase<ListNewsRequest, PaginatedNews> {
  constructor(private readonly newsRepository: INewsRepository) {}

  async execute(request: ListNewsRequest): Promise<PaginatedNews> {
    const page = Math.max(1, request.pagination.page);
    const limit = Math.min(Math.max(1, request.pagination.limit), 100);

    return await this.newsRepository.findAll(request.filters, { page, limit });
  }
}
