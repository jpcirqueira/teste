import { FastifyInstance } from 'fastify';
import { CepController } from '@presentation/controllers/CepController';
import { GetAddressByCepUseCase } from '@application/useCases/GetAddressByCepUseCase';
import { ViaCepService } from '@infrastructure/services/ViaCepService';

interface CepParams {
  cep: string;
}

export async function cepRoutes(fastify: FastifyInstance): Promise<void> {
  const viaCepService = new ViaCepService();
  const getAddressByCepUseCase = new GetAddressByCepUseCase(viaCepService);
  const cepController = new CepController(getAddressByCepUseCase);

  fastify.get<{ Params: CepParams }>(
    '/cep/:cep',
    {
      schema: {
        tags: ['CEP'],
        summary: 'Search address by CEP',
        description: 'Retrieves address information from a Brazilian postal code (CEP). Accepts format with or without hyphen (e.g., 12345-678 or 12345678)',
        params: {
          type: 'object',
          properties: {
            cep: {
              type: 'string',
              pattern: '^[0-9]{5}-?[0-9]{3}$',
            },
          },
          required: ['cep'],
        },
        response: {
          200: {
            description: 'Address found successfully',
            type: 'object',
            properties: {
              success: { type: 'boolean', description: 'Request success status' },
              data: {
                type: 'object',
                properties: {
                  cep: { type: 'string', description: 'Postal code' },
                  logradouro: { type: 'string', description: 'Street name' },
                  complemento: { type: 'string', description: 'Address complement' },
                  bairro: { type: 'string', description: 'Neighborhood' },
                  localidade: { type: 'string', description: 'City' },
                  uf: { type: 'string', description: 'State abbreviation' },
                  ibge: { type: 'string', description: 'IBGE code' },
                  gia: { type: 'string', description: 'GIA code' },
                  ddd: { type: 'string', description: 'Area code' },
                  siafi: { type: 'string', description: 'SIAFI code' },
                },
              },
            },
          },
          400: {
            description: 'Invalid CEP format',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          404: {
            description: 'CEP not found',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          503: {
            description: 'External service unavailable',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => cepController.getByCep(request, reply)
  );
}
