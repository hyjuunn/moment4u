import React from 'react';
import '../styles/global.css';
import { useNavigate } from 'react-router-dom';

const CreateDiaryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      background: 'black',
      color: 'white',
      padding: '0 2rem',
    }}>
      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: 'bold',
        marginTop: '2rem',
        marginBottom: '2rem',
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        display: 'flex',
        gap: '15px',
      }}>
        <span style={{
          color: '#87CEEB',
          textShadow: `
            0 0 1px #87CEEB,
            0 0 2px #87CEEB,
            0 0 21px #87CEEB,
            0 0 30px #00BFFF,
            0 0 50px #00BFFF
          `,
        }}>
          Story
        </span>
        <span style={{
          color: 'white',
          textShadow: `
            0 0 1px #fff,
            0 0 2px #fff,
            0 0 21px #fff,
            0 0 30px #fff,
            0 0 50px #fff
          `,
        }}>
          Dashboard
        </span>
      </h1>
      <div style={{ 
        width: '80%', 
        maxWidth: '1200px', 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          left: '-11rem',
          top: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <button
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(57, 255, 20, 0.15)',
              color: '#39FF14',
              border: '2px solid #39FF14',
              borderRadius: '10px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `
                0 0 2px #39FF14,
                0 0 4px #39FF14,
                0 0 6px #32CD32
              `,
              textShadow: `
                0 0 1px #39FF14,
                0 0 2px #32CD32
              `,
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 3px #39FF14,
                0 0 6px #39FF14,
                0 0 9px #32CD32
              `;
              e.currentTarget.style.textShadow = `
                0 0 2px #39FF14,
                0 0 4px #32CD32
              `;
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(57, 255, 20, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 2px #39FF14,
                0 0 4px #39FF14,
                0 0 6px #32CD32
              `;
              e.currentTarget.style.textShadow = `
                0 0 1px #39FF14,
                0 0 2px #32CD32
              `;
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(57, 255, 20, 0.15)';
            }}
          >
            Create Story
          </button>
          <button
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(255, 0, 0, 0.15)',
              color: '#ff4040',
              border: '2px solid #ff4040',
              borderRadius: '10px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `
                0 0 2px #ff4040,
                0 0 4px #ff4040,
                0 0 6px #ff0000
              `,
              textShadow: `
                0 0 1px #ff4040,
                0 0 2px #ff0000
              `,
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 3px #ff4040,
                0 0 6px #ff4040,
                0 0 9px #ff0000
              `;
              e.currentTarget.style.textShadow = `
                0 0 2px #ff4040,
                0 0 4px #ff0000
              `;
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 2px #ff4040,
                0 0 4px #ff4040,
                0 0 6px #ff0000
              `;
              e.currentTarget.style.textShadow = `
                0 0 1px #ff4040,
                0 0 2px #ff0000
              `;
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.15)';
            }}
          >
            Delete Story
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(255, 192, 203, 0.15)',
              color: '#ff69b4',
              border: '2px solid #ff69b4',
              borderRadius: '10px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `
                0 0 2px #ff69b4,
                0 0 4px #ff69b4,
                0 0 6px #ff1493
              `,
              textShadow: `
                0 0 1px #ff69b4,
                0 0 2px #ff1493
              `,
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 3px #ff69b4,
                0 0 6px #ff69b4,
                0 0 9px #ff1493
              `;
              e.currentTarget.style.textShadow = `
                0 0 2px #ff69b4,
                0 0 4px #ff1493
              `;
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(255, 192, 203, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 2px #ff69b4,
                0 0 4px #ff69b4,
                0 0 6px #ff1493
              `;
              e.currentTarget.style.textShadow = `
                0 0 1px #ff69b4,
                0 0 2px #ff1493
              `;
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 192, 203, 0.15)';
            }}
          >
            Back to Home
          </button>
        </div>
        <div style={{
          width: '90%',
          minHeight: '70vh',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: `
            0 0 2px #fff,
            0 0 4px #fff,
            0 0 8px #fff,
            0 0 16px #fff,
            0 0 32px #fff
          `,
          border: '2px solid white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          {/* Story posts will be added here */}
        </div>
      </div>
    </div>
  );
};

export default CreateDiaryPage; 