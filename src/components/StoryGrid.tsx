import React, { useMemo, useState, useEffect } from 'react';
import StoryModal from './StoryModal';
import { Story } from '../services/api';

interface StoryGridProps {
  stories: Story[];
  isDeleteMode?: boolean;
  onStorySelect?: (storyId: string) => void;
}

const StoryGrid: React.FC<StoryGridProps> = ({ stories, isDeleteMode = false, onStorySelect }) => {
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Get the current theme from localStorage
  const isLightMode = localStorage.getItem('isLightMode') === 'true';

  // Reset selected stories when delete mode changes
  useEffect(() => {
    setSelectedStories(new Set());
  }, [isDeleteMode]);

  // Generate stable keys for stories that persist across renders
  const storyKeys = useMemo(() => {
    return stories.map(story => ({
      ...story,
      key: story.id || `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
  }, [stories]);

  const handleStoryClick = (storyId: string) => {
    if (isDeleteMode) {
    if (onStorySelect) {
      onStorySelect(storyId);
    }
    
    setSelectedStories(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(storyId)) {
        newSelected.delete(storyId);
      } else {
        newSelected.add(storyId);
      }
      return newSelected;
    });
    } else {
      // Find and set the selected story for the modal
      const story = stories.find(s => s.id === storyId);
      if (story) {
        setSelectedStory(story);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedStory(null);
  };

  if (!stories || stories.length === 0) {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
      }}>
        <div style={{
          width: '120px',
          height: '2px',
          background: isLightMode ? 
            'linear-gradient(to right, transparent, rgba(44, 24, 16, 0.2), rgba(44, 24, 16, 0.2), transparent)' :
            'linear-gradient(to right, transparent, #FFB6C1, #87CEEB, transparent)',
          margin: '0 auto 2.5rem auto',
          borderRadius: '1px'
        }} />
        <div style={{
          fontSize: '1.2rem',
          color: isLightMode ? '#2C1810' : 'rgba(255, 255, 255, 0.8)',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '300',
          textAlign: 'center',
          lineHeight: '1.6',
          maxWidth: '400px',
          margin: '0 auto 2.5rem auto'
        }}>
          Create your first story and begin your journey of memories
        </div>
        <div style={{
          width: '120px',
          height: '2px',
          background: isLightMode ? 
            'linear-gradient(to right, transparent, rgba(44, 24, 16, 0.2), rgba(44, 24, 16, 0.2), transparent)' :
            'linear-gradient(to right, transparent, #87CEEB, #FFB6C1, transparent)',
          margin: '0 auto',
          borderRadius: '1px'
        }} />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600&display=swap');
          
          .story-card-title {
            word-break: keep-all;
            overflow-wrap: break-word;
          }
          
          .story-card-title:lang(ko) {
            font-family: "Noto Sans KR", "Playfair Display", serif;
            line-height: 1.5;
            font-weight: 500;
          }
        `}
      </style>
    <div style={{
      display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 280px))',
      gap: '1.5rem',
      width: '100%',
      padding: '1rem',
      alignItems: 'stretch',
        justifyContent: 'center',
      justifyItems: 'center',
    }}>
      {storyKeys.map((story) => {
        const thumbnailUrl = story.thumbnailUrl || (story.images && story.images.length > 0 ? story.images[0] : '');
        const isSelected = selectedStories.has(story.id);
          const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(story.title || '');
        
        return (
          <div
            key={story.key}
            onClick={() => handleStoryClick(story.id)}
            style={{
                background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(13, 13, 13, 0.9))',
                borderRadius: '20px',
              overflow: 'hidden',
              border: isSelected && isDeleteMode 
                  ? '2px solid #4682B4' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isDeleteMode ? 'pointer' : 'pointer',
              width: '100%',
                maxWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
                height: '320px',
              boxShadow: isSelected && isDeleteMode 
                  ? '0 0 15px rgba(70, 130, 180, 0.5)' 
                  : '0 8px 20px rgba(0, 0, 0, 0.3)',
              position: 'relative',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
            }}
            onMouseOver={(e) => {
              if (!isDeleteMode) {
                const target = e.currentTarget;
                  target.style.transform = 'translateY(-10px)';
                  target.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isDeleteMode) {
                const target = e.currentTarget;
                target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
              }
            }}
          >
            {isDeleteMode && (
              <div style={{
                position: 'absolute',
                  top: '15px',
                  right: '15px',
                  width: '28px',
                  height: '28px',
                borderRadius: '50%',
                  background: isSelected ? '#4682B4' : 'rgba(0, 0, 0, 0.7)',
                  border: '2px solid ' + (isSelected ? '#4682B4' : '#ffffff'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                  fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: isSelected 
                    ? '0 0 10px rgba(70, 130, 180, 0.5)'
                  : '0 0 10px rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                  zIndex: 2,
              }}>
                {isSelected && '✓'}
              </div>
            )}
              <div style={{ 
                height: '200px', 
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}>
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt={story.title || 'Story image'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=No+Image';
                  }}
                    onMouseOver={(e) => {
                      if (!isDeleteMode) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isDeleteMode) {
                        e.currentTarget.style.transform = 'scale(1.0)';
                      }
                    }}
                />
              )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                  height: '100px',
                  pointerEvents: 'none',
                }}/>
            </div>
            <div style={{
                padding: '1.25rem',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(13, 13, 13, 0.8))',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
            }}>
                <h3 
                  className="story-card-title"
                  lang={isKorean ? 'ko' : 'en'}
                  style={{
                margin: '0',
                color: '#fff',
                    fontSize: isKorean ? '1.1rem' : '1.2rem',
                    fontWeight: '600',
                    fontFamily: isKorean ? '"Noto Sans KR", "Playfair Display", serif' : 'Playfair Display, serif',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                    letterSpacing: isKorean ? '0' : '0.02em',
                    lineHeight: '1.4',
              }}>
                {story.title || 'Untitled Story'}
              </h3>
              {story.createdAt && (
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#FFB6C1',
                      display: 'inline-block',
                    }}/>
                <p style={{
                      margin: 0,
                  color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '300',
                      letterSpacing: '0.05em',
                }}>
                  {new Date(story.createdAt).toLocaleDateString()}
                </p>
                  </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default StoryGrid; 