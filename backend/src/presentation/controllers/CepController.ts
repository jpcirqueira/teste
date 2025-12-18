import { FastifyRequest, FastifyReply } from 'fastify';
import { GetAddressByCepUseCase } from '@application/useCases/GetAddressByCepUseCase';
import { mapToAddressResponse } from '@presentation/dtos/AddressResponseDTO';
import { AppError } from '@shared/errors/AppError';

interface CepParams {
  cep: string;
}

export class CepController {
  constructor(
    private readonly getAddressByCepUseCase: GetAddressByCepUseCase
  ) {}

  async getByCep(
    request: FastifyRequest<{ Params: CepParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      // Indicador de loading state seria gerenciado no frontend
      // Aqui apenas processamos a requisição
      const address = await this.getAddressByCepUseCase.execute(
        request.params.cep
      );
      
      const response = mapToAddressResponse(address);
      reply.code(200).send({
        success: true,
        data: response,
      });
    } catch (error) {
      if (error instanceof AppError) {
        reply.code(error.statusCode).send({
          success: false,
          error: error.name,
          message: error.message,
        });
      } else {
        reply.code(500).send({
          success: false,
          error: 'InternalServerError',
          message: error instanceof Error ? error.message : 'Erro interno do servidor',
        });
      }
    }
  }
}


