import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '@shared/config/env';
import { NewsEntity } from './entities/NewsEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.database.host,
  port: env.database.port,
  username: env.database.user,
  password: env.database.password,
  database: env.database.name,
  synchronize: env.nodeEnv === 'development',
  logging: env.nodeEnv === 'development',
  entities: [NewsEntity],
  migrations: [],
  subscribers: [],
});

export async function initializeDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connection initialized');
    }
  } catch (error) {
    console.error('❌ Error during Data Source initialization:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ Database connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
}

