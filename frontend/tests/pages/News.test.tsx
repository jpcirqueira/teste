import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import NewsPage from '../../src/pages/News';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '@/hooks/useNews';
import { News, ListNewsResponse } from '@/types';
import { AxiosError } from 'axios';

vi.mock('@/hooks/useNews', () => ({
  useNews: vi.fn(),
  useCreateNews: vi.fn(),
  useUpdateNews: vi.fn(),
  useDeleteNews: vi.fn(),
}));

const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: mockScrollTo,
});

describe('News Page', () => {
  const mockMutateAsync = vi.fn();
  
  const mockNewsData: ListNewsResponse = {
    data: [
      {
        id: '1',
        title: 'First News',
        description: 'First news description',
        createdAt: '2025-12-18T10:00:00.000Z',
        updatedAt: '2025-12-18T10:00:00.000Z',
      },
      {
        id: '2',
        title: 'Second News',
        description: 'Second news description',
        createdAt: '2025-12-18T11:00:00.000Z',
        updatedAt: '2025-12-18T11:00:00.000Z',
      },
    ],
    metadata: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockScrollTo.mockClear();
    
    vi.mocked(useCreateNews).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
    
    vi.mocked(useUpdateNews).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
    
    vi.mocked(useDeleteNews).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
  });

  it('renders main elements', () => {
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    expect(screen.getByText('Notícias')).toBeInTheDocument();
    expect(screen.getByText('Gerencie suas notícias de forma simples e eficiente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar nova notícia/i })).toBeInTheDocument();
  });

  it('renders back to home link', () => {
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    const backLink = screen.getByRole('link', { name: /voltar para home/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('displays error with custom message from API', () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: 'Custom error message' }
      }
    } as AxiosError<{ message: string }>;

    vi.mocked(useNews).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('displays news list when data is available', () => {
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    expect(screen.getByText('First News')).toBeInTheDocument();
    expect(screen.getByText('Second News')).toBeInTheDocument();
  });

  it('displays empty state when no news are available', () => {
    const emptyData: ListNewsResponse = {
      data: [],
      metadata: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };

    vi.mocked(useNews).mockReturnValue({
      data: emptyData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    expect(screen.getByText('Nenhuma notícia encontrada')).toBeInTheDocument();
    expect(screen.getByText('Comece criando sua primeira notícia clicando no botão "Nova Notícia"')).toBeInTheDocument();
  });

  it('submits create form successfully', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({ id: '3', title: 'New News', description: 'New description' });
    
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    const createButton = screen.getByRole('button', { name: /criar nova notícia/i });
    await user.click(createButton);
    
    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    
    await user.type(titleInput, 'New News');
    await user.type(descriptionInput, 'New description');
    
    const submitButton = screen.getByRole('button', { name: /^criar$/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        title: 'New News',
        description: 'New description',
      });
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('opens edit modal with news data when edit button is clicked', async () => {
    const user = userEvent.setup();
    
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    await user.click(editButtons[0]);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Editar Notícia')).toBeInTheDocument();
    
    const titleInput = screen.getByDisplayValue('First News');
    const descriptionInput = screen.getByDisplayValue('First news description');
    
    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it('submits edit form successfully', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({ id: '1', title: 'Updated News', description: 'Updated description' });
    
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    await user.click(editButtons[0]);
    
    const titleInput = screen.getByDisplayValue('First News');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated News');
    
    const submitButton = screen.getByRole('button', { name: /atualizar/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: '1',
        data: {
          title: 'Updated News',
          description: 'First news description',
        },
      });
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('deletes news when delete button is clicked', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce(undefined);
    
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /deletar notícia/i });
    await user.click(deleteButtons[0]);
    
    const confirmButton = await screen.findByText('Sim, deletar');
    await user.click(confirmButton);
    
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith('1');
    });
  });

  it('shows deleting state on news card', async () => {
    const user = userEvent.setup();
    
    vi.mocked(useDeleteNews).mockReturnValue({
      mutateAsync: vi.fn().mockImplementation(() => new Promise(() => {})),
      isPending: true,
    } as any);
    
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
  });

  it('disables previous button on first page', () => {
    const multiPageData: ListNewsResponse = {
      data: mockNewsData.data,
      metadata: {
        total: 25,
        page: 1,
        limit: 10,
        totalPages: 3,
      },
    };
    
    vi.mocked(useNews).mockReturnValue({
      data: multiPageData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    const prevButton = screen.getByRole('button', { name: /página anterior/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', async () => {
    const user = userEvent.setup();
    
    const multiPageData: ListNewsResponse = {
      data: mockNewsData.data,
      metadata: {
        total: 30,
        page: 1,
        limit: 10,
        totalPages: 3,
      },
    };

    const lastPageData: ListNewsResponse = {
      data: mockNewsData.data,
      metadata: {
        total: 30,
        page: 3,
        limit: 10,
        totalPages: 3,
      },
    };
    
    vi.mocked(useNews).mockReturnValue({
      data: multiPageData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
    
    vi.mocked(useNews).mockReturnValue({
      data: lastPageData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);
    
    const nextButton = screen.getByRole('button', { name: /próxima página/i });
    await user.click(nextButton);
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(nextButton).toBeDisabled();
    });
  });

  it('does not show pagination with single page', () => {
    vi.mocked(useNews).mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NewsPage />);
    
    expect(screen.queryByRole('button', { name: /página anterior/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /próxima página/i })).not.toBeInTheDocument();
  });

});
