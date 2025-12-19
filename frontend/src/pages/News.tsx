import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '@/hooks/useNews';
import { NewsList } from '@/components/NewsList';
import { NewsModal } from '@/components/NewsModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { CreateNewsDTO, News } from '@/types';
import { AxiosError } from 'axios';
import styles from './News.module.css';

function NewsPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, error } = useNews(page, 10, true);
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();

  const handleOpenCreateModal = () => {
    setEditingNews(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (news: News) => {
    setEditingNews(news);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(undefined);
  };

  const handleSubmit = async (formData: CreateNewsDTO) => {
    try {
      if (editingNews) {
        await updateMutation.mutateAsync({
          id: editingNews.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting news:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Error deleting news:', err);
    } finally {
      setDeletingId(undefined);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getErrorMessage = (): string => {
    if (!error) return 'Erro desconhecido';

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as AxiosError<{ message: string }>;
      
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }

      const status = axiosError.response?.status;
      switch (status) {
        case 404:
          return 'Recurso não encontrado.';
        case 500:
          return 'Erro interno do servidor. Tente novamente mais tarde.';
        default:
          return 'Erro ao carregar notícias. Tente novamente.';
      }
    }

    if (typeof error === 'object' && error !== null && 'request' in error) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Erro ao carregar notícias. Tente novamente.';
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        ← Voltar para Home
      </Link>
      
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Notícias</h1>
            <p className={styles.subtitle}>
              Gerencie suas notícias de forma simples e eficiente
            </p>
          </div>
          <button
            className={styles.createButton}
            onClick={handleOpenCreateModal}
            aria-label="Criar nova notícia"
          >
            + Nova Notícia
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {isLoading && <LoadingSpinner />}

        {isError && <ErrorMessage message={getErrorMessage()} />}

        {data && !isLoading && (
          <NewsList
            news={data.data}
            currentPage={page}
            totalPages={data.metadata.totalPages}
            total={data.metadata.total}
            onPageChange={handlePageChange}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        initialData={editingNews}
        title={editingNews ? 'Editar Notícia' : 'Nova Notícia'}
      />
    </div>
  );
}

export default NewsPage;
