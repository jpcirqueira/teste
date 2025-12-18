import { News } from '@domain/entities/News';

export interface NewsResponseDTO {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function mapToNewsResponse(news: News): NewsResponseDTO {
  return {
    id: news.id,
    title: news.title,
    description: news.description,
    createdAt: news.createdAt.toISOString(),
    updatedAt: news.updatedAt.toISOString(),
  };
}
