import React from 'react';

interface DeleteConfirmModalProps {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ count, onConfirm, onCancel }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100,
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(13, 13, 13, 0.95))',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          animation: 'slideUp 0.4s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid #ff4444',
          }}
        >
          <span role="img" aria-label="warning" style={{ fontSize: '24px' }}>⚠️</span>
        </div>

        <h2
          style={{
            margin: '0 0 10px 0',
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: '600',
            fontFamily: 'Playfair Display, serif',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          Confirm Deletion
        </h2>

        <p
          style={{
            margin: '0 0 30px 0',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.1rem',
            fontFamily: 'Poppins, sans-serif',
            textAlign: 'center',
            lineHeight: '1.6',
            fontWeight: '300',
            letterSpacing: '0.02em',
          }}
        >
          Are you sure you want to delete {count} selected {count === 1 ? 'story' : 'stories'}? This action cannot be undone.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '0.8em 2em',
              fontSize: '1rem',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              letterSpacing: '0.05em',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: '0.8em 2em',
              fontSize: '1rem',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              letterSpacing: '0.05em',
              backgroundColor: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#ff6666';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 68, 68, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#ff4444';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default DeleteConfirmModal; 