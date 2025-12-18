import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'));
const CepSearch = lazy(() => import('@/pages/CepSearch'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <h2>Loading...</h2>
  </div>
);

// Create router with routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/cep',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CepSearch />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
]);
