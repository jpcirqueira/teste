export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: {
    connected: boolean;
    message?: string;
  };
}

