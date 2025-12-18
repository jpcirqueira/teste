import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  nodeEnv: string;
  port: number;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

export const env: EnvConfig = {
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  port: parseInt(getEnvVariable('PORT', '3000'), 10),
  database: {
    host: getEnvVariable('DATABASE_HOST', 'localhost'),
    port: parseInt(getEnvVariable('DATABASE_PORT', '5432'), 10),
    user: getEnvVariable('DATABASE_USER', 'postgres'),
    password: getEnvVariable('DATABASE_PASSWORD', 'postgres'),
    name: getEnvVariable('DATABASE_NAME', 'app_db'),
  },
};

