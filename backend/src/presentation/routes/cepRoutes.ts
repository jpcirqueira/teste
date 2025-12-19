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
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  cep: { type: 'string' },
                  logradouro: { type: 'string' },
                  complemento: { type: 'string' },
                  bairro: { type: 'string' },
                  localidade: { type: 'string' },
                  uf: { type: 'string' },
                  ibge: { type: 'string' },
                  gia: { type: 'string' },
                  ddd: { type: 'string' },
                  siafi: { type: 'string' },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          500: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          503: {
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
