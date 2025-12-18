import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
      <h2 style={{ marginTop: '1rem' }}>Page Not Found</h2>
      <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        The page you are looking for does not exist.
      </p>
      <Link to="/" style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: '#646cff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        transition: 'background-color 0.25s'
      }}>
        Go back to Home
      </Link>
    </div>
  );
}

export default NotFound;
