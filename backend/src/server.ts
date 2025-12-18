import 'reflect-metadata';
import { env } from '@shared/config/env';
import { createServer } from '@infrastructure/http';
import { initializeDatabase, closeDatabase } from '@infrastructure/database';
import { HealthCheckRepository } from '@infrastructure/repositories';
import { HealthCheckUseCase } from '@application/useCases';
import { HealthCheckController } from '@presentation/controllers';
import { healthRoutes } from '@presentation/routes';

async function bootstrap() {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Create server instance
    const server = await createServer();

    // Dependency injection setup
    const healthCheckRepository = new HealthCheckRepository();
    const healthCheckUseCase = new HealthCheckUseCase(healthCheckRepository);
    const healthCheckController = new HealthCheckController(healthCheckUseCase);

    // Register routes
    await healthRoutes(server, healthCheckController);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n${signal} received, closing server gracefully...`);
        try {
          await server.close();
          await closeDatabase();
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    });

    // Start server
    await server.listen({
      port: env.port,
      host: '0.0.0.0',
    });

    console.log(`🚀 Server is running on port ${env.port}`);
    console.log(`📊 Environment: ${env.nodeEnv}`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

bootstrap();

