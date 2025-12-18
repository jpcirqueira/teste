import { UseCase } from '@shared/types';
import { ICepService } from '@application/ports/ICepService';
import { Address } from '@domain/entities/Address';
import { NotFoundError, BadRequestError } from '@shared/errors/AppError';

export class GetAddressByCepUseCase implements UseCase<string, Address> {
  constructor(private readonly viaCepService: ICepService) {}

  async execute(cep: string): Promise<Address> {
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, '');

    // Valida se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      throw new BadRequestError('CEP deve conter 8 dígitos');
    }

    // Valida se o CEP contém apenas números
    if (!/^\d+$/.test(cleanCep)) {
      throw new BadRequestError('CEP deve conter apenas números');
    }

    const address = await this.viaCepService.findByCep(cleanCep);
    
    if (!address) {
      throw new NotFoundError(`CEP ${cep} não encontrado`);
    }

    return address;
  }
}
