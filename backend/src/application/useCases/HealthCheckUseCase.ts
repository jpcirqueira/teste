import { UseCase, HealthCheckResult } from '@shared/types';
import { IHealthCheckRepository } from '@application/ports';

export class HealthCheckUseCase implements UseCase<void, HealthCheckResult> {
  private startTime: number;

  constructor(private readonly healthCheckRepository: IHealthCheckRepository) {
    this.startTime = Date.now();
  }

  async execute(): Promise<HealthCheckResult> {
    try {
      const isDatabaseConnected = await this.healthCheckRepository.checkDatabaseConnection();
      const uptime = Date.now() - this.startTime;

      return {
        status: isDatabaseConnected ? 'healthy' : 'unhealthy',
        timestamp: new Date(),
        uptime,
        database: {
          connected: isDatabaseConnected,
          message: isDatabaseConnected ? 'Database is connected' : 'Database connection failed',
        },
      };
    } catch (error) {
      const uptime = Date.now() - this.startTime;
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        uptime,
        database: {
          connected: false,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}

