import { INewsRepository, CreateNewsData, UpdateNewsData, NewsFilters, PaginationParams, PaginatedNews } from '@application/ports/INewsRepository';
import { News } from '@domain/entities/News';
import { AppDataSource } from '@infrastructure/database';
import { NewsEntity } from '@infrastructure/database/entities/NewsEntity';

export class NewsRepository implements INewsRepository {
  private getRepository() {
    return AppDataSource.getRepository(NewsEntity);
  }

  private mapToDomain(entity: NewsEntity): News {
    return new News(
      entity.id,
      entity.title,
      entity.description,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt
    );
  }

  async create(data: CreateNewsData): Promise<News> {
    const repository = this.getRepository();
    const newsEntity = repository.create({
      title: data.title,
      description: data.description,
    });
    
    const savedEntity = await repository.save(newsEntity);
    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<News | null> {
    const repository = this.getRepository();
    const entity = await repository.findOne({ where: { id } });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToDomain(entity);
  }

  async findAll(filters: NewsFilters, pagination: PaginationParams): Promise<PaginatedNews> {
    const repository = this.getRepository();
    const queryBuilder = repository.createQueryBuilder('news');

    // Apply filters
    if (filters.title) {
      queryBuilder.andWhere('news.title ILIKE :title', { title: `%${filters.title}%` });
    }

    if (filters.description) {
      queryBuilder.andWhere('news.description ILIKE :description', { description: `%${filters.description}%` });
    }

    // Apply pagination
    const skip = (pagination.page - 1) * pagination.limit;
    queryBuilder.skip(skip).take(pagination.limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy('news.created_at', 'DESC');

    const [entities, total] = await queryBuilder.getManyAndCount();
    
    const data = entities.map(entity => this.mapToDomain(entity));
    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
    };
  }

  async update(id: string, data: UpdateNewsData): Promise<News | null> {
    const repository = this.getRepository();
    const entity = await repository.findOne({ where: { id } });
    
    if (!entity) {
      return null;
    }

    // Update only provided fields
    if (data.title !== undefined) {
      entity.title = data.title;
    }
    if (data.description !== undefined) {
      entity.description = data.description;
    }

    const updatedEntity = await repository.save(entity);
    return this.mapToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const repository = this.getRepository();
    
    // Check if the entity exists and is not already soft deleted
    const entity = await repository.findOne({ 
      where: { id },
      withDeleted: true 
    });
    
    if (!entity) {
      return false;
    }
    
    // If already soft deleted, return false
    if (entity.deletedAt) {
      return false;
    }
    
    // Perform soft delete
    const result = await repository.softDelete(id);
    
    return (result.affected ?? 0) > 0;
  }
}
