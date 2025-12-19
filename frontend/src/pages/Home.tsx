import { Link } from 'react-router-dom';
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <Link 
          to="/cep" 
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#646cff',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.25s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#535bf2';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#646cff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔍 Buscar CEP
        </Link>
        <Link 
          to="/news" 
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#646cff',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.25s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#535bf2';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#646cff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          📰 Gerenciar Notícias
        </Link>
      </div>

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

    </div>
  );
}

export default Home;
