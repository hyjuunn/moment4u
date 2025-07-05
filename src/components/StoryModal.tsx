import React from 'react';
import { Story } from '../services/api';

interface StoryModalProps {
  story: Story | null;
  onClose: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ story, onClose }) => {
  if (!story) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay"
      onClick={onClose}
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
        zIndex: 1000,
        padding: '20px'
      }}>
      <div 
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '28px',
            cursor: 'pointer',
            padding: '5px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            fontFamily: 'Poppins, sans-serif',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          ×
        </button>

        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2.5rem',
          marginBottom: '10px',
          color: '#FFB6C1',
          textAlign: 'center',
          fontWeight: '600',
          letterSpacing: '0.02em',
          lineHeight: '1.2'
        }}>
          {story.title}
        </h2>

        <div style={{
          fontFamily: 'Poppins, sans-serif',
          color: '#87CEEB',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '0.95rem',
          fontWeight: '300',
          letterSpacing: '0.05em'
        }}>
          {formatDate(story.createdAt)}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {story.images.map((imageUrl, index) => (
            <div 
              key={index}
              style={{
                width: '100%',
                paddingTop: '100%',
                position: 'relative',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={imageUrl}
                alt={`Story image ${index + 1}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          ))}
        </div>

        <div style={{
          color: '#FFB6C1',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap',
          textAlign: 'justify',
          padding: '0 10px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '1.1rem',
          fontWeight: '300',
          letterSpacing: '0.02em'
        }}>
          {story.content}
        </div>
      </div>
    </div>
  );
};

export default StoryModal; 