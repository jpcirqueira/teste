import { Address } from '@/types';
import styles from './AddressCard.module.css';

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Endereço Encontrado</h2>
      
      <div className={styles.grid}>
        <div className={styles.field}>
          <span className={styles.label}>CEP</span>
          <span className={styles.value}>{address.cep}</span>
        </div>

        {address.logradouro && (
          <div className={styles.field}>
            <span className={styles.label}>Logradouro</span>
            <span className={styles.value}>{address.logradouro}</span>
          </div>
        )}

        {address.complemento && (
          <div className={styles.field}>
            <span className={styles.label}>Complemento</span>
            <span className={styles.value}>{address.complemento}</span>
          </div>
        )}

        {address.bairro && (
          <div className={styles.field}>
            <span className={styles.label}>Bairro</span>
            <span className={styles.value}>{address.bairro}</span>
          </div>
        )}

        <div className={styles.field}>
          <span className={styles.label}>Cidade/UF</span>
          <span className={styles.value}>
            {address.localidade} - {address.uf}
          </span>
        </div>

        {address.ddd && (
          <div className={styles.field}>
            <span className={styles.label}>DDD</span>
            <span className={styles.value}>{address.ddd}</span>
          </div>
        )}

        {address.ibge && (
          <div className={styles.field}>
            <span className={styles.label}>Código IBGE</span>
            <span className={styles.value}>{address.ibge}</span>
          </div>
        )}

        {address.siafi && (
          <div className={styles.field}>
            <span className={styles.label}>Código SIAFI</span>
            <span className={styles.value}>{address.siafi}</span>
          </div>
        )}
      </div>
    </div>
  );
}
