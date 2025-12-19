import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/components/LoadingFallback';

const Home = lazy(() => import('@/pages/Home'));
const CepSearch = lazy(() => import('@/pages/CepSearch'));
const News = lazy(() => import('@/pages/News'));
const NotFound = lazy(() => import('@/pages/NotFound'));

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
