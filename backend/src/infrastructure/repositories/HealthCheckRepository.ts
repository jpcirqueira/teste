import { IHealthCheckRepository } from '@application/ports';
import { AppDataSource } from '@infrastructure/database';

export class HealthCheckRepository implements IHealthCheckRepository {
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      if (!AppDataSource.isInitialized) {
        return false;
      }
      
      // Execute a simple query to check database connectivity
      await AppDataSource.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

