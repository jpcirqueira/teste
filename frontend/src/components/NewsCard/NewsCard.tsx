import { useState } from 'react';
import { News } from '@/types';
import styles from './NewsCard.module.css';

interface NewsCardProps {
  news: News;
  onEdit: (news: News) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function NewsCard({ news, onEdit, onDelete, isDeleting }: NewsCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(news.id);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{news.title}</h3>
        <div className={styles.actions}>
          <button
            className={styles.editButton}
            onClick={() => onEdit(news)}
            disabled={isDeleting}
            aria-label="Editar notícia"
          >
            Editar
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            disabled={isDeleting}
            aria-label="Deletar notícia"
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </button>
        </div>
      </div>

      <p className={styles.description}>{news.description}</p>

      <div className={styles.footer}>
        <div className={styles.metadata}>
          <span className={styles.metaLabel}>Criado em:</span>
          <span className={styles.metaValue}>{formatDate(news.createdAt)}</span>
        </div>
        {news.updatedAt !== news.createdAt && (
          <div className={styles.metadata}>
            <span className={styles.metaLabel}>Atualizado em:</span>
            <span className={styles.metaValue}>{formatDate(news.updatedAt)}</span>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <p className={styles.confirmMessage}>
              Tem certeza que deseja deletar esta notícia?
            </p>
            <p className={styles.confirmTitle}>"{news.title}"</p>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancel}
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmDelete}
                onClick={handleConfirmDelete}
              >
                Sim, deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
