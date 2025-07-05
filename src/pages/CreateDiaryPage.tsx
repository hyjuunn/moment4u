import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { useNavigate } from 'react-router-dom';

const CreateDiaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let fadeTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;
    
    if (showPopup) {
      // Start fade out after 1.7 seconds
      fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 1700);

      // Hide popup after fade out animation (2 seconds + 0.3 seconds for fade out)
      hideTimer = setTimeout(() => {
        setShowPopup(false);
        setIsFading(false);
      }, 2000);
    }

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [showPopup]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap" rel="stylesheet" />
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
              onClick={() => navigate('/')}
              style={{
                padding: '0.6rem 1.2rem',
                background: 'rgba(255, 192, 203, 0.15)',
                color: '#ff69b4',
                border: '2px solid #ff69b4',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: '500',
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
                fontFamily: 'Quicksand, sans-serif',
                letterSpacing: '0.5px',
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
                e.currentTarget.style.letterSpacing = '1px';
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
                e.currentTarget.style.letterSpacing = '0.5px';
              }}
            >
              Main Page
            </button>
            <button
              onClick={() => setShowPopup(true)}
              style={{
                padding: '0.6rem 1.2rem',
                background: 'rgba(0, 191, 255, 0.15)',
                color: '#00BFFF',
                border: '2px solid #00BFFF',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `
                  0 0 2px #00BFFF,
                  0 0 4px #00BFFF,
                  0 0 6px #1E90FF
                `,
                textShadow: `
                  0 0 1px #00BFFF,
                  0 0 2px #1E90FF
                `,
                fontFamily: 'Quicksand, sans-serif',
                letterSpacing: '0.5px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 0 3px #00BFFF,
                  0 0 6px #00BFFF,
                  0 0 9px #1E90FF
                `;
                e.currentTarget.style.textShadow = `
                  0 0 2px #00BFFF,
                  0 0 4px #1E90FF
                `;
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'rgba(0, 191, 255, 0.25)';
                e.currentTarget.style.letterSpacing = '1px';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 0 2px #00BFFF,
                  0 0 4px #00BFFF,
                  0 0 6px #1E90FF
                `;
                e.currentTarget.style.textShadow = `
                  0 0 1px #00BFFF,
                  0 0 2px #1E90FF
                `;
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(0, 191, 255, 0.15)';
                e.currentTarget.style.letterSpacing = '0.5px';
              }}
            >
              Language
            </button>
            <button
              style={{
                padding: '0.6rem 1.2rem',
                background: 'rgba(57, 255, 20, 0.15)',
                color: '#39FF14',
                border: '2px solid #39FF14',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: '500',
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
                fontFamily: 'Quicksand, sans-serif',
                letterSpacing: '0.5px',
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
                e.currentTarget.style.letterSpacing = '1px';
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
                e.currentTarget.style.letterSpacing = '0.5px';
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
                fontWeight: '500',
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
                fontFamily: 'Quicksand, sans-serif',
                letterSpacing: '0.5px',
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
                e.currentTarget.style.letterSpacing = '1px';
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
                e.currentTarget.style.letterSpacing = '0.5px';
              }}
            >
              Delete Story
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
            position: 'relative',
          }}>
            {showPopup && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 0, 0, 0.9)',
                  padding: '1.5rem 2.5rem',
                  borderRadius: '15px',
                  border: '2px solid #FFFF00',
                  color: '#FFFF00',
                  fontSize: '1.2rem',
                  fontFamily: 'Quicksand, sans-serif',
                  zIndex: 1000,
                  boxShadow: `
                    0 0 5px #FFFF00,
                    0 0 10px #FFFF00,
                    0 0 15px #FFD700
                  `,
                  textShadow: `
                    0 0 1px #FFFF00,
                    0 0 2px #FFD700
                  `,
                  animation: isFading ? 'popupFadeOut 0.3s ease-in-out forwards' : 'popupFadeIn 0.3s ease-in-out',
                  textAlign: 'center',
                }}
                onClick={() => setShowPopup(false)}
              >
                We only support Korean at this time.
              </div>
            )}
            {/* Story posts will be added here */}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes popupFadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -60%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
          @keyframes popupFadeOut {
            from {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
            to {
              opacity: 0;
              transform: translate(-50%, -40%);
            }
          }
        `}
      </style>
    </>
  );
};

export default CreateDiaryPage; 