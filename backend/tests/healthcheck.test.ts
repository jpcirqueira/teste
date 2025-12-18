import { HealthCheckUseCase } from '../src/application/useCases/HealthCheckUseCase';
import { IHealthCheckRepository } from '../src/application/ports/IHealthCheckRepository';

describe('HealthCheckUseCase', () => {
  let healthCheckUseCase: HealthCheckUseCase;
  let mockHealthCheckRepository: jest.Mocked<IHealthCheckRepository>;

  beforeEach(() => {
    mockHealthCheckRepository = {
      checkDatabaseConnection: jest.fn(),
    };
    healthCheckUseCase = new HealthCheckUseCase(mockHealthCheckRepository);
  });

  it('should return healthy status when database is connected', async () => {
    mockHealthCheckRepository.checkDatabaseConnection.mockResolvedValue(true);

    const result = await healthCheckUseCase.execute();

    expect(result.status).toBe('healthy');
    expect(result.database.connected).toBe(true);
    expect(result.database.message).toBe('Database is connected');
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should return unhealthy status when database is not connected', async () => {
    mockHealthCheckRepository.checkDatabaseConnection.mockResolvedValue(false);

    const result = await healthCheckUseCase.execute();

    expect(result.status).toBe('unhealthy');
    expect(result.database.connected).toBe(false);
    expect(result.database.message).toBe('Database connection failed');
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should return unhealthy status when database check throws an error', async () => {
    const errorMessage = 'Connection timeout';
    mockHealthCheckRepository.checkDatabaseConnection.mockRejectedValue(
      new Error(errorMessage)
    );

    const result = await healthCheckUseCase.execute();

    expect(result.status).toBe('unhealthy');
    expect(result.database.connected).toBe(false);
    expect(result.database.message).toBe(errorMessage);
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should track uptime correctly', async () => {
    mockHealthCheckRepository.checkDatabaseConnection.mockResolvedValue(true);

    // Wait a bit to ensure uptime is measurable
    await new Promise((resolve) => setTimeout(resolve, 10));

    const result = await healthCheckUseCase.execute();

    expect(result.uptime).toBeGreaterThan(0);
  });
});

