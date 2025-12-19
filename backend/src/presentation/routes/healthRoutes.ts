import { FastifyInstance } from 'fastify';
import { HealthCheckController } from '@presentation/controllers';

export async function healthRoutes(
  server: FastifyInstance,
  healthCheckController: HealthCheckController
): Promise<void> {
  server.get('/health', {
    schema: {
      tags: ['Health'],
      summary: 'Health check endpoint',
      description: 'Returns the health status of the API and database connection',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string', description: 'Overall health status' },
            timestamp: { type: 'string', description: 'ISO timestamp of the check' },
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', description: 'Database connection status' },
                connected: { type: 'boolean', description: 'Whether database is connected' },
              },
            },
          },
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    return healthCheckController.handle(request, reply);
  });
}

