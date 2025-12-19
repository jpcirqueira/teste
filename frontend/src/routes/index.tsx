import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('@/pages/Home'));
const CepSearch = lazy(() => import('@/pages/CepSearch'));
const News = lazy(() => import('@/pages/News'));
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
    path: '/news',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <News />
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
