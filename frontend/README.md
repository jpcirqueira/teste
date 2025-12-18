# Frontend - React + Vite + TypeScript

Modern frontend application built with React, Vite, and TypeScript, featuring React Router DOM, React Query, Axios, and comprehensive testing setup.

## Technologies

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React 18** - UI library with latest features
- 🔷 **TypeScript** - Type-safe development
- 🛣️ **React Router DOM v7** - Client-side routing
- 🔄 **TanStack Query (React Query v5)** - Data fetching and caching
- 📡 **Axios** - HTTP client with interceptors
- 🧪 **Vitest** - Fast unit test framework
- 🧪 **React Testing Library** - Component testing utilities
- 🎨 **ESLint** - Code linting
- 🐳 **Docker** - Containerization

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API client configuration
│   │   └── client.ts   # Axios instance with interceptors
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks
│   │   ├── useHealthCheck.ts
│   │   ├── useNews.ts
│   │   └── useCep.ts
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   └── NotFound.tsx
│   ├── routes/         # Router configuration
│   │   └── index.tsx
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── tests/              # Test files
│   ├── setup.ts        # Test configuration
│   └── utils/          # Test utilities
└── ...config files
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL:

```env
VITE_API_URL=http://localhost:3000
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Production Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Docker

### Development with Docker Compose

Start all services (frontend, backend, and database):

```bash
# From project root
docker-compose up -d
```

The frontend will be available at `http://localhost:8080`

### Frontend Only

Build and run frontend container:

```bash
docker build -t frontend .
docker run -p 8080:8080 -e VITE_API_URL=http://localhost:3000 frontend
```

## API Integration

The frontend communicates with the backend API using Axios and React Query.

### Axios Client

The Axios client is configured in `src/api/client.ts` with:

- Base URL configuration from environment variables
- Request/response interceptors for logging
- Error handling for common HTTP status codes
- 10-second timeout

### React Query Hooks

Custom hooks are provided for API operations:

- `useHealthCheck()` - Health check endpoint
- `useNews()` - List all news
- `useNewsById(id)` - Get single news by ID
- `useCreateNews()` - Create news mutation
- `useUpdateNews()` - Update news mutation
- `useDeleteNews()` - Delete news mutation
- `useCep(cep)` - Get address by CEP

Example usage:

```tsx
import { useHealthCheck } from '@/hooks/useHealthCheck';

function Component() {
  const { data, isLoading, isError } = useHealthCheck();
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;
  
  return <div>{data.status}</div>;
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Writing Tests

Tests use Vitest and React Testing Library. Example:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Test Utilities

Use the custom render function from `tests/utils/test-utils.tsx` to render components with all providers (React Query, Router, etc.):

```tsx
import { render } from '../tests/utils/test-utils';
```

## Environment Variables

Environment variables must be prefixed with `VITE_` to be exposed to the application:

- `VITE_API_URL` - Backend API URL (default: `http://localhost:3000`)

## Code Quality

### ESLint

The project uses ESLint with TypeScript and React plugins:

```bash
npm run lint
npm run lint:fix
```

### TypeScript

Type checking:

```bash
npm run type-check
```

## Path Aliases

The project is configured with path aliases for cleaner imports:

```tsx
// Instead of: import { useNews } from '../../../hooks/useNews'
import { useNews } from '@/hooks/useNews';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

ISC

