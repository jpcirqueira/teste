import React, { useEffect, useRef } from 'react';
import { CreateNewsDTO, News } from '@/types';
import { NewsForm } from '@/components/NewsForm';
import styles from './NewsModal.module.css';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNewsDTO) => void;
  isLoading: boolean;
  initialData?: News;
  title: string;
}

export function NewsModal({ isOpen, onClose, onSubmit, isLoading, initialData, title }: NewsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <NewsForm
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}
