import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

export function ErrorMessage({ message, title = 'Erro' }: ErrorMessageProps) {
  return (
    <div className={styles.errorContainer} role="alert">
      <div className={styles.errorIcon}>⚠️</div>
      <div className={styles.errorContent}>
        <h3 className={styles.errorTitle}>{title}</h3>
        <p className={styles.errorMessage}>{message}</p>
      </div>
    </div>
  );
}
