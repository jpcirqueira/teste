import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { CreateNewsDTO, News } from '@/types';
import styles from './NewsForm.module.css';

interface NewsFormProps {
  onSubmit: (data: CreateNewsDTO) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: News;
}

export function NewsForm({ onSubmit, onCancel, isLoading, initialData }: NewsFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState({ title: false, description: false });

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const validateTitle = (value: string): string | null => {
    if (value.length === 0) return 'Título é obrigatório';
    if (value.length < 3) return 'Título deve ter no mínimo 3 caracteres';
    if (value.length > 255) return 'Título deve ter no máximo 255 caracteres';
    return null;
  };

  const validateDescription = (value: string): string | null => {
    if (value.length === 0) return 'Descrição é obrigatória';
    if (value.length < 10) return 'Descrição deve ter no mínimo 10 caracteres';
    return null;
  };

  const titleError = touched.title ? validateTitle(title) : null;
  const descriptionError = touched.description ? validateDescription(description) : null;
  const isValid = !validateTitle(title) && !validateDescription(description);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!touched.title) setTouched({ ...touched, title: true });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (!touched.description) setTouched({ ...touched, description: true });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setTouched({ title: true, description: true });
    
    if (isValid) {
      onSubmit({ title, description });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="news-title" className={styles.label}>
          Título
        </label>
        <input
          id="news-title"
          type="text"
          className={`${styles.input} ${titleError ? styles.inputError : ''}`}
          value={title}
          onChange={handleTitleChange}
          onBlur={() => setTouched({ ...touched, title: true })}
          placeholder="Digite o título da notícia"
          maxLength={255}
          disabled={isLoading}
          autoComplete="off"
        />
        {titleError && (
          <span className={styles.errorText} role="alert">
            {titleError}
          </span>
        )}
        <span className={styles.helpText}>
          {title.length}/255 caracteres
        </span>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="news-description" className={styles.label}>
          Descrição
        </label>
        <textarea
          id="news-description"
          className={`${styles.textarea} ${descriptionError ? styles.inputError : ''}`}
          value={description}
          onChange={handleDescriptionChange}
          onBlur={() => setTouched({ ...touched, description: true })}
          placeholder="Digite a descrição da notícia"
          rows={5}
          disabled={isLoading}
        />
        {descriptionError && (
          <span className={styles.errorText} role="alert">
            {descriptionError}
          </span>
        )}
        <span className={styles.helpText}>
          Mínimo 10 caracteres ({description.length} digitados)
        </span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}
