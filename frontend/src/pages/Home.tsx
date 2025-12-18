import { useHealthCheck } from '@/hooks/useHealthCheck';

function Home() {
  const { data, isLoading, isError, error } = useHealthCheck();

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1>Frontend React + Vite</h1>
      <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        Projeto configurado com TypeScript, React Router DOM, React Query, Axios e testes
      </p>

      <div style={{ 
        padding: '1.5rem', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h2>Backend Health Check</h2>
        
        {isLoading && <p>Checking backend status...</p>}
        
        {isError && (
          <div style={{ color: '#ff6b6b' }}>
            <p>❌ Error connecting to backend</p>
            <p style={{ fontSize: '0.875rem' }}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}
        
        {data && (
          <div style={{ color: '#51cf66' }}>
            <p>✅ Backend is running!</p>
            <div style={{ 
              marginTop: '1rem', 
              textAlign: 'left',
              backgroundColor: '#1a1a1a',
              padding: '1rem',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Tecnologias Configuradas</h3>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <li>⚡ Vite</li>
          <li>⚛️ React 18</li>
          <li>🔷 TypeScript</li>
          <li>🛣️ React Router DOM</li>
          <li>🔄 React Query</li>
          <li>📡 Axios</li>
          <li>🧪 Vitest + React Testing Library</li>
          <li>🐳 Docker</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
