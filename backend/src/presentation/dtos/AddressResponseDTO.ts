import { Address } from '@domain/entities/Address';

export interface AddressResponseDTO {
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

export const mapToAddressResponse = (address: Address): AddressResponseDTO => ({
  cep: address.cep,
  logradouro: address.logradouro,
  complemento: address.complemento,
  bairro: address.bairro,
  localidade: address.localidade,
  uf: address.uf,
  ibge: address.ibge,
  gia: address.gia,
  ddd: address.ddd,
  siafi: address.siafi,
});


