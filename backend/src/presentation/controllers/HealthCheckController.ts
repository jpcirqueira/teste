import { FastifyRequest, FastifyReply } from 'fastify';
import { HealthCheckUseCase } from '@application/useCases';
import { HealthCheckResponse } from '@presentation/dtos';

export class HealthCheckController {
  constructor(private readonly healthCheckUseCase: HealthCheckUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.healthCheckUseCase.execute();

      const response: HealthCheckResponse = {
        status: result.status,
        timestamp: result.timestamp.toISOString(),
        uptime: result.uptime,
        database: result.database,
      };

      const statusCode = result.status === 'healthy' ? 200 : 503;

      reply.code(statusCode).send(response);
    } catch (error) {
      reply.code(500).send({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: 0,
        database: {
          connected: false,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
      });
    }
  }
}

