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
      body: createNewsSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
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
      querystring: listNewsQuerySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
            metadata: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
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
      params: newsIdParamSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
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
      params: newsIdParamSchema,
      body: updateNewsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
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
      params: newsIdParamSchema,
      response: {
        204: {
          type: 'null',
          description: 'No content',
        },
      },
    },
  }, async (request: any, reply) => {
    return newsController.delete(request, reply);
  });
}
