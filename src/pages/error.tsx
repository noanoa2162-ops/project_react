import { useNavigate } from "react-router-dom";

interface ErrorProps {
  message?: string;
} 
const Error: React.FC<ErrorProps> = ({ message }) => {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '50px',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', color: '#e74c3c', margin: '20px 0' }}>404</h1>
      <h2 style={{ fontSize: '24px', color: '#2c3e50', margin: '20px 0' }}>
        {message || "עמוד לא נמצא"}
      </h2>
      <p style={{ fontSize: '16px', color: '#7f8c8d', marginBottom: '30px' }}>
        מצטערים, העמוד שחיפשת אינו קיים.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2980b9')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3498db')}
      >
        חזור לדף הבית
      </button>
    </div>
  );
};
export default Error;