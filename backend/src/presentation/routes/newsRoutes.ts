import { FastifyInstance } from 'fastify';
import { NewsController } from '@presentation/controllers/NewsController';
import { createNewsSchema } from '@presentation/dtos/CreateNewsDTO';
import { updateNewsSchema } from '@presentation/dtos/UpdateNewsDTO';
import { listNewsQuerySchema } from '@presentation/dtos/ListNewsResponseDTO';

const newsIdParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
  required: ['id'],
};

export async function newsRoutes(
  server: FastifyInstance,
  newsController: NewsController
): Promise<void> {
  // Create news
  server.post('/news', {
    schema: {
      tags: ['News'],
      summary: 'Create a new news article',
      description: 'Creates a new news article with title and description',
      body: createNewsSchema,
      response: {
        201: {
          description: 'News article created successfully',
          type: 'object',
          properties: {
            id: { type: 'string', description: 'News article ID' },
            title: { type: 'string', description: 'News title' },
            description: { type: 'string', description: 'News description' },
            createdAt: { type: 'string', description: 'Creation timestamp' },
            updatedAt: { type: 'string', description: 'Last update timestamp' },
          },
        },
        400: {
          description: 'Validation error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request: any, reply) => {
    return newsController.create(request, reply);
  });

  // List news with pagination and filters
  server.get('/news', {
    schema: {
      tags: ['News'],
      summary: 'List news articles',
      description: 'Retrieves a paginated list of news articles with optional filters by title and description',
      querystring: listNewsQuerySchema,
      response: {
        200: {
          description: 'List of news articles with pagination metadata',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'News article ID' },
                  title: { type: 'string', description: 'News title' },
                  description: { type: 'string', description: 'News description' },
                  createdAt: { type: 'string', description: 'Creation timestamp' },
                  updatedAt: { type: 'string', description: 'Last update timestamp' },
                },
              },
            },
            metadata: {
              type: 'object',
              properties: {
                total: { type: 'number', description: 'Total number of news articles' },
                page: { type: 'number', description: 'Current page number' },
                limit: { type: 'number', description: 'Items per page' },
                totalPages: { type: 'number', description: 'Total number of pages' },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request: any, reply) => {
    return newsController.list(request, reply);
  });

  // Get news by ID
  server.get('/news/:id', {
    schema: {
      tags: ['News'],
      summary: 'Get news article by ID',
      description: 'Retrieves a specific news article by its ID',
      params: newsIdParamSchema,
      response: {
        200: {
          description: 'News article found',
          type: 'object',
          properties: {
            id: { type: 'string', description: 'News article ID' },
            title: { type: 'string', description: 'News title' },
            description: { type: 'string', description: 'News description' },
            createdAt: { type: 'string', description: 'Creation timestamp' },
            updatedAt: { type: 'string', description: 'Last update timestamp' },
          },
        },
        404: {
          description: 'News article not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request: any, reply) => {
    return newsController.getById(request, reply);
  });

  // Update news
  server.put('/news/:id', {
    schema: {
      tags: ['News'],
      summary: 'Update news article',
      description: 'Updates an existing news article with new title and/or description',
      params: newsIdParamSchema,
      body: updateNewsSchema,
      response: {
        200: {
          description: 'News article updated successfully',
          type: 'object',
          properties: {
            id: { type: 'string', description: 'News article ID' },
            title: { type: 'string', description: 'News title' },
            description: { type: 'string', description: 'News description' },
            createdAt: { type: 'string', description: 'Creation timestamp' },
            updatedAt: { type: 'string', description: 'Last update timestamp' },
          },
        },
        400: {
          description: 'Validation error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        404: {
          description: 'News article not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request: any, reply) => {
    return newsController.update(request, reply);
  });

  // Delete news
  server.delete('/news/:id', {
    schema: {
      tags: ['News'],
      summary: 'Delete news article',
      description: 'Deletes a news article by its ID',
      params: newsIdParamSchema,
      response: {
        204: {
          type: 'null',
          description: 'News article deleted successfully',
        },
        404: {
          description: 'News article not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request: any, reply) => {
    return newsController.delete(request, reply);
  });
}
