import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
    }}>
      <div className="folder-container" style={{
        maxWidth: '800px',
        width: '100%',
      }}>
        <div style={{
          textAlign: 'center',
        }}>
          <div className="fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 
              className="glitter-text text-gradient"
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: '700',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
                lineHeight: '1.2',
              }}
            >
              Moment4U
            </h1>
          </div>
          
          <div className="fade-in" style={{ animationDelay: '0.4s' }}>
            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
              opacity: 0.9,
              lineHeight: '1.6',
              marginBottom: '2.5rem',
              color: '#e5e5e5',
            }}>
              "Upload up to 4 images to create your diary!"
            </p>
          </div>

          <div className="fade-in" style={{ animationDelay: '0.6s' }}>
            <button 
              className="btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Create Diary
            </button>
          </div>

          <div 
            className="fade-in" 
            style={{ 
              marginTop: '3rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              animationDelay: '0.8s',
              opacity: 0.7,
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>4</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Images Per Diary</p>
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>∞</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Memories</p>
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>1</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Click to Create</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 