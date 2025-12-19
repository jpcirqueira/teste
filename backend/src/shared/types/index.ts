export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  database: {
    connected: boolean;
    message?: string;
  };
}

export interface UseCase<Request, Response> {
  execute(request: Request): Promise<Response>;
}

