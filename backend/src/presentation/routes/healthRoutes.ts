import { FastifyInstance } from 'fastify';
import { HealthCheckController } from '@presentation/controllers';

export async function healthRoutes(
  server: FastifyInstance,
  healthCheckController: HealthCheckController
): Promise<void> {
  server.get('/health', async (request, reply) => {
    return healthCheckController.handle(request, reply);
  });
}

