import styles from './LoadingSpinner.module.css';

export function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
      <span className={styles.srOnly}>Carregando...</span>
    </div>
  );
}
