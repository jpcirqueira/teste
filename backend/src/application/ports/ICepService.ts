import { Address } from '@domain/entities/Address';

export interface ICepService {
  findByCep(cep: string): Promise<Address | null>;
}
