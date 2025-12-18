import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCep } from '@/hooks/useCep';
import { CepSearchForm } from '@/components/CepSearchForm';
import { AddressCard } from '@/components/AddressCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import styles from './CepSearch.module.css';
import { AxiosError } from 'axios';

function CepSearch() {
  const [searchCep, setSearchCep] = useState('');
  const { data, isLoading, isError, error } = useCep(searchCep);

  const handleSearch = (cep: string) => {
    setSearchCep(cep);
  };

  const getErrorMessage = (): string => {
    if (!error) return 'Erro desconhecido';

    // Check if it's an Axios error with response
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as AxiosError<{ message: string }>;
      
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }

      // Handle status codes
      const status = axiosError.response?.status;
      switch (status) {
        case 400:
          return 'CEP inválido. Verifique o formato e tente novamente.';
        case 404:
          return 'CEP não encontrado. Verifique se o CEP está correto.';
        case 503:
          return 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
        case 500:
          return 'Erro interno do servidor. Tente novamente mais tarde.';
        default:
          return 'Erro ao buscar CEP. Tente novamente.';
      }
    }

    // Check if it's a network error
    if (typeof error === 'object' && error !== null && 'request' in error) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }

    // Fallback to error message if available
    if (error instanceof Error) {
      return error.message;
    }

    return 'Erro ao buscar CEP. Tente novamente.';
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        ← Voltar para Home
      </Link>
      
      <header className={styles.header}>
        <h1 className={styles.title}>Buscar CEP</h1>
        <p className={styles.subtitle}>
          Consulte endereços brasileiros através do CEP
        </p>
      </header>

      <div className={styles.content}>
        <CepSearchForm onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && <LoadingSpinner />}

        {isError && <ErrorMessage message={getErrorMessage()} />}

        {data && !isLoading && <AddressCard address={data} />}

        {!searchCep && !isLoading && !isError && (
          <div className={styles.emptyState}>
            <p>Digite um CEP acima para começar a busca</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CepSearch;
