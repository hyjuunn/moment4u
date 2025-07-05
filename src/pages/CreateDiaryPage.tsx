import React from 'react';
import '../styles/global.css';

const CreateDiaryPage: React.FC = () => {
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
        <button
          style={{
            position: 'absolute',
            left: '-11rem',
            top: '2rem',
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
              0 0 8px #ff69b4,
              0 0 12px #ff1493
            `,
            textShadow: `
              0 0 1px #ff69b4,
              0 0 2px #ff69b4,
              0 0 4px #ff69b4,
              0 0 8px #ff1493
            `,
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = `
              0 0 4px #ff69b4,
              0 0 8px #ff69b4,
              0 0 16px #ff69b4,
              0 0 24px #ff1493
            `;
            e.currentTarget.style.textShadow = `
              0 0 2px #ff69b4,
              0 0 4px #ff69b4,
              0 0 8px #ff69b4,
              0 0 16px #ff1493
            `;
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background = 'rgba(255, 192, 203, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = `
              0 0 2px #ff69b4,
              0 0 4px #ff69b4,
              0 0 8px #ff69b4,
              0 0 12px #ff1493
            `;
            e.currentTarget.style.textShadow = `
              0 0 1px #ff69b4,
              0 0 2px #ff69b4,
              0 0 4px #ff69b4,
              0 0 8px #ff1493
            `;
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(255, 192, 203, 0.15)';
          }}
        >
          Create Story
        </button>
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