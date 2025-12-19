import { News } from '@/types';
import { NewsCard } from '@/components/NewsCard';
import styles from './NewsList.module.css';

interface NewsListProps {
  news: News[];
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (news: News) => void;
  onDelete: (id: string) => void;
  deletingId?: string;
}

export function NewsList({
  news,
  currentPage,
  totalPages,
  total,
  onPageChange,
  onEdit,
  onDelete,
  deletingId,
}: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyIcon}>📰</p>
        <p className={styles.emptyTitle}>Nenhuma notícia encontrada</p>
        <p className={styles.emptyMessage}>
          Comece criando sua primeira notícia clicando no botão &quot;Nova Notícia&quot;
        </p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, total);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.summary}>
          Mostrando {startItem}-{endItem} de {total} {total === 1 ? 'notícia' : 'notícias'}
        </p>
      </div>

      <div className={styles.grid}>
        {news.map((item) => (
          <NewsCard
            key={item.id}
            news={item}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingId === item.id}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            ← Anterior
          </button>

          <div className={styles.paginationInfo}>
            <span className={styles.pageIndicator}>
              Página {currentPage} de {totalPages}
            </span>
          </div>

          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
