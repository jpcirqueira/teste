// Health Check Types
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  database: {
    status: string;
    responseTime: number;
  };
}

// News Types
export interface News {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsDTO {
  title: string;
  description: string;
}

export interface UpdateNewsDTO {
  title?: string;
  description?: string;
}

export interface ListNewsResponse {
  data: News[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Address Types
export interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

// API Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
