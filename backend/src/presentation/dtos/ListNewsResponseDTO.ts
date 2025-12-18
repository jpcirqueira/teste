import { NewsResponseDTO } from './NewsResponseDTO';

export interface ListNewsResponseDTO {
  data: NewsResponseDTO[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const listNewsQuerySchema = {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      minimum: 1,
      default: 1,
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10,
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
};
