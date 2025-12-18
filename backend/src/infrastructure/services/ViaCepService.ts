import axios, { AxiosError } from 'axios';
import { ICepService } from '@application/ports/ICepService';
import { Address } from '@domain/entities/Address';
import { ExternalServiceError } from '@shared/errors/AppError';

interface ViaCepResponse {
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
  erro?: boolean;
}

export class ViaCepService implements ICepService {
  private readonly baseURL = 'https://viacep.com.br/ws';
  private readonly timeout = 5000; // 5 segundos

  async findByCep(cep: string): Promise<Address | null> {
    try {
      const response = await axios.get<ViaCepResponse>(
        `${this.baseURL}/${cep}/json/`,
        {
          timeout: this.timeout,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      // ViaCEP retorna { erro: true } quando o CEP não existe
      if (response.data.erro) {
        return null;
      }

      return new Address(
        response.data.cep,
        response.data.logradouro,
        response.data.complemento,
        response.data.bairro,
        response.data.localidade,
        response.data.uf,
        response.data.ibge,
        response.data.gia,
        response.data.ddd,
        response.data.siafi
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.code === 'ECONNABORTED') {
          throw new ExternalServiceError(
            'Timeout ao buscar CEP. Tente novamente.'
          );
        }

        if (axiosError.response?.status === 400) {
          return null;
        }

        if (axiosError.response?.status === 404) {
          return null;
        }

        if (!axiosError.response) {
          throw new ExternalServiceError(
            'Erro de conexão com o serviço de CEP. Verifique sua conexão.'
          );
        }

        throw new ExternalServiceError(
          `Erro ao buscar CEP: ${axiosError.message}`
        );
      }

      throw new ExternalServiceError(
        'Erro inesperado ao buscar CEP'
      );
    }
  }
}
