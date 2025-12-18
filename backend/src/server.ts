import 'reflect-metadata';
import { env } from '@shared/config/env';
import { createServer } from '@infrastructure/http';
import { initializeDatabase, closeDatabase } from '@infrastructure/database';
import { HealthCheckRepository, NewsRepository, CachedNewsRepository } from '@infrastructure/repositories';
import { InMemoryCacheService } from '@infrastructure/cache';
import { HealthCheckUseCase } from '@application/useCases';
import { CreateNewsUseCase } from '@application/useCases/CreateNewsUseCase';
import { ListNewsUseCase } from '@application/useCases/ListNewsUseCase';
import { GetNewsByIdUseCase } from '@application/useCases/GetNewsByIdUseCase';
import { UpdateNewsUseCase } from '@application/useCases/UpdateNewsUseCase';
import { DeleteNewsUseCase } from '@application/useCases/DeleteNewsUseCase';
import { HealthCheckController, NewsController } from '@presentation/controllers';
import { healthRoutes, newsRoutes, cepRoutes } from '@presentation/routes';

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

    // News feature with caching
    const newsRepository = new NewsRepository();
    const cacheService = new InMemoryCacheService();
    const cachedNewsRepository = env.cache.enabled
      ? new CachedNewsRepository(newsRepository, cacheService, env.cache.ttlSeconds)
      : newsRepository;
    
    const createNewsUseCase = new CreateNewsUseCase(cachedNewsRepository);
    const listNewsUseCase = new ListNewsUseCase(cachedNewsRepository);
    const getNewsByIdUseCase = new GetNewsByIdUseCase(cachedNewsRepository);
    const updateNewsUseCase = new UpdateNewsUseCase(cachedNewsRepository);
    const deleteNewsUseCase = new DeleteNewsUseCase(cachedNewsRepository);
    const newsController = new NewsController(
      createNewsUseCase,
      listNewsUseCase,
      getNewsByIdUseCase,
      updateNewsUseCase,
      deleteNewsUseCase
    );

    // Register routes
    await healthRoutes(server, healthCheckController);
    await newsRoutes(server, newsController);
    await cepRoutes(server);

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
    console.log(`💾 Cache: ${env.cache.enabled ? 'enabled' : 'disabled'} (TTL: ${env.cache.ttlSeconds}s)`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

bootstrap();

