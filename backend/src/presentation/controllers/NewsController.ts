import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateNewsUseCase } from '@application/useCases/CreateNewsUseCase';
import { ListNewsUseCase } from '@application/useCases/ListNewsUseCase';
import { GetNewsByIdUseCase } from '@application/useCases/GetNewsByIdUseCase';
import { UpdateNewsUseCase } from '@application/useCases/UpdateNewsUseCase';
import { DeleteNewsUseCase } from '@application/useCases/DeleteNewsUseCase';
import { CreateNewsDTO } from '@presentation/dtos/CreateNewsDTO';
import { UpdateNewsDTO } from '@presentation/dtos/UpdateNewsDTO';
import { mapToNewsResponse } from '@presentation/dtos/NewsResponseDTO';
import { ListNewsResponseDTO } from '@presentation/dtos/ListNewsResponseDTO';
import { AppError } from '@shared/errors/AppError';

interface ListNewsQuery {
  page?: number;
  limit?: number;
  title?: string;
  description?: string;
}

interface NewsIdParams {
  id: string;
}

export class NewsController {
  constructor(
    private readonly createNewsUseCase: CreateNewsUseCase,
    private readonly listNewsUseCase: ListNewsUseCase,
    private readonly getNewsByIdUseCase: GetNewsByIdUseCase,
    private readonly updateNewsUseCase: UpdateNewsUseCase,
    private readonly deleteNewsUseCase: DeleteNewsUseCase
  ) {}

  async create(request: FastifyRequest<{ Body: CreateNewsDTO }>, reply: FastifyReply): Promise<void> {
    try {
      const news = await this.createNewsUseCase.execute(request.body);
      const response = mapToNewsResponse(news);
      reply.code(201).send(response);
    } catch (error) {
      if (error instanceof AppError) {
        reply.code(error.statusCode).send({
          error: error.name,
          message: error.message,
        });
      } else {
        reply.code(500).send({
          error: 'InternalServerError',
          message: error instanceof Error ? error.message : 'Internal server error',
        });
      }
    }
  }

  async list(request: FastifyRequest<{ Querystring: ListNewsQuery }>, reply: FastifyReply): Promise<void> {
    try {
      const { page = 1, limit = 10, title, description } = request.query;

      const result = await this.listNewsUseCase.execute({
        filters: { title, description },
        pagination: { page, limit },
      });

      const response: ListNewsResponseDTO = {
        data: result.data.map(mapToNewsResponse),
        metadata: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      };

      reply.code(200).send(response);
    } catch (error) {
      reply.code(500).send({
        error: 'InternalServerError',
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getById(request: FastifyRequest<{ Params: NewsIdParams }>, reply: FastifyReply): Promise<void> {
    try {
      const news = await this.getNewsByIdUseCase.execute(request.params.id);
      const response = mapToNewsResponse(news);
      reply.code(200).send(response);
    } catch (error) {
      if (error instanceof AppError) {
        reply.code(error.statusCode).send({
          error: error.name,
          message: error.message,
        });
      } else {
        reply.code(500).send({
          error: 'InternalServerError',
          message: error instanceof Error ? error.message : 'Internal server error',
        });
      }
    }
  }

  async update(request: FastifyRequest<{ Params: NewsIdParams; Body: UpdateNewsDTO }>, reply: FastifyReply): Promise<void> {
    try {
      const news = await this.updateNewsUseCase.execute({
        id: request.params.id,
        data: request.body,
      });
      const response = mapToNewsResponse(news);
      reply.code(200).send(response);
    } catch (error) {
      if (error instanceof AppError) {
        reply.code(error.statusCode).send({
          error: error.name,
          message: error.message,
        });
      } else {
        reply.code(500).send({
          error: 'InternalServerError',
          message: error instanceof Error ? error.message : 'Internal server error',
        });
      }
    }
  }

  async delete(request: FastifyRequest<{ Params: NewsIdParams }>, reply: FastifyReply): Promise<void> {
    try {
      await this.deleteNewsUseCase.execute(request.params.id);
      reply.code(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        reply.code(error.statusCode).send({
          error: error.name,
          message: error.message,
        });
      } else {
        reply.code(500).send({
          error: 'InternalServerError',
          message: error instanceof Error ? error.message : 'Internal server error',
        });
      }
    }
  }
}
