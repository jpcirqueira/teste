import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import CepSearch from '../../src/pages/CepSearch';
import { useCep } from '@/hooks/useCep';
import { Address } from '@/types';
import { AxiosError } from 'axios';

vi.mock('@/hooks/useCep', () => ({
  useCep: vi.fn()
}));

describe('CepSearch Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render elements', () => {
    vi.mocked(useCep).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    expect(screen.getByRole('heading', { name: 'Buscar CEP' })).toBeInTheDocument();
    expect(screen.getByText('Consulte endereços brasileiros através do CEP')).toBeInTheDocument();
    expect(screen.getByLabelText('Digite o CEP')).toBeInTheDocument();
  });

  it('renders back to home link', () => {
    vi.mocked(useCep).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    const backLink = screen.getByRole('link', { name: /voltar para home/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('displays initial empty state', () => {
    vi.mocked(useCep).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    expect(screen.getByText('Digite um CEP acima para começar a busca')).toBeInTheDocument();
  });

  it('displays error for 400 status (invalid CEP)', () => {
    const mockError = {
      response: {
        status: 400,
        data: {}
      }
    } as AxiosError;

    vi.mocked(useCep).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('CEP inválido. Verifique o formato e tente novamente.')).toBeInTheDocument();
  });

  it('displays error for 404 status (CEP not found)', () => {
    const mockError = {
      response: {
        status: 404,
        data: {}
      }
    } as AxiosError;

    vi.mocked(useCep).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    expect(screen.getByText('CEP não encontrado. Verifique se o CEP está correto.')).toBeInTheDocument();
  });

  it('displays error for 503 status (service unavailable)', () => {
    const mockError = {
      response: {
        status: 503,
        data: {}
      }
    } as AxiosError;

    vi.mocked(useCep).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    expect(screen.getByText('Serviço temporariamente indisponível. Tente novamente em alguns instantes.')).toBeInTheDocument();
  });

  it('displays error for 500 status (internal server error)', () => {
    const mockError = {
      response: {
        status: 500,
        data: {}
      }
    } as AxiosError;

    vi.mocked(useCep).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    expect(screen.getByText('Erro interno do servidor. Tente novamente mais tarde.')).toBeInTheDocument();
  });

  it('displays error with custom message from API', () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: 'Custom error message' }
      }
    } as AxiosError<{ message: string }>;

    vi.mocked(useCep).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('displays success state with address data', () => {
    const mockAddress: Address = {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      complemento: '',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107'
    };

    vi.mocked(useCep).mockReturnValue({
      data: mockAddress,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<CepSearch />);
    
    expect(screen.getByText('Endereço Encontrado')).toBeInTheDocument();
    expect(screen.getByText('01310-100')).toBeInTheDocument();
    expect(screen.getByText('Avenida Paulista')).toBeInTheDocument();
    expect(screen.getByText('Bela Vista')).toBeInTheDocument();
    expect(screen.getByText('São Paulo - SP')).toBeInTheDocument();
  });
});
