import { useState, FormEvent, ChangeEvent } from 'react';
import styles from './CepSearchForm.module.css';

interface CepSearchFormProps {
  onSearch: (cep: string) => void;
  isLoading: boolean;
}

export function CepSearchForm({ onSearch, isLoading }: CepSearchFormProps) {
  const [cep, setCep] = useState('');

  const formatCep = (value: string): string => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Apply mask: 00000-000
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Remove mask and validate
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      onSearch(cleanCep);
    }
  };

  const isValid = cep.replace(/\D/g, '').length === 8;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="cep-input" className={styles.label}>
          Digite o CEP
        </label>
        <input
          id="cep-input"
          type="text"
          className={styles.input}
          value={cep}
          onChange={handleChange}
          placeholder="00000-000"
          maxLength={9}
          disabled={isLoading}
          aria-describedby="cep-help"
          autoComplete="postal-code"
        />
        <span id="cep-help" className={styles.helpText}>
          Formato: 00000-000 (apenas números)
        </span>
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={!isValid || isLoading}
        aria-label="Buscar endereço pelo CEP"
      >
        {isLoading ? 'Buscando...' : 'Buscar CEP'}
      </button>
    </form>
  );
}
