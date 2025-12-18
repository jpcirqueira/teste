export interface IHealthCheckRepository {
  checkDatabaseConnection(): Promise<boolean>;
}

