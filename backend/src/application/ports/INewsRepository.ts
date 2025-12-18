import { News } from '@domain/entities/News';

export interface CreateNewsData {
  title: string;
  description: string;
}

export interface UpdateNewsData {
  title?: string;
  description?: string;
}

export interface NewsFilters {
  title?: string;
  description?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedNews {
  data: News[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface INewsRepository {
  create(data: CreateNewsData): Promise<News>;
  findById(id: string): Promise<News | null>;
  findAll(filters: NewsFilters, pagination: PaginationParams): Promise<PaginatedNews>;
  update(id: string, data: UpdateNewsData): Promise<News | null>;
  delete(id: string): Promise<boolean>;
}
