import { FastifyInstance } from 'fastify';
import { CepController } from '@presentation/controllers/CepController';
import { GetAddressByCepUseCase } from '@application/useCases/GetAddressByCepUseCase';
import { ViaCepService } from '@infrastructure/services/ViaCepService';

export async function cepRoutes(fastify: FastifyInstance): Promise<void> {
  const viaCepService = new ViaCepService();
  const getAddressByCepUseCase = new GetAddressByCepUseCase(viaCepService);
  const cepController = new CepController(getAddressByCepUseCase);

  fastify.get(
    '/cep/:cep',
    {
      schema: {
        description: 'Busca endereço por CEP usando a API ViaCEP',
        tags: ['cep'],
        params: {
          type: 'object',
          properties: {
            cep: {
              type: 'string',
              description: 'CEP a ser consultado (com ou sem máscara)',
              pattern: '^[0-9]{5}-?[0-9]{3}$',
            },
          },
          required: ['cep'],
        },
        response: {
          200: {
            description: 'Endereço encontrado com sucesso',
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
            description: 'CEP inválido',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          404: {
            description: 'CEP não encontrado',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          503: {
            description: 'Serviço externo indisponível',
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
