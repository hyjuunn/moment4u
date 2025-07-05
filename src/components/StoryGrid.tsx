import React, { useMemo } from 'react';

interface Story {
  id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  images: string[];
  createdAt: string;
}

interface StoryGridProps {
  stories: Story[];
}

const StoryGrid: React.FC<StoryGridProps> = ({ stories }) => {
  // Generate stable keys for stories that persist across renders
  const storyKeys = useMemo(() => {
    return stories.map(story => ({
      ...story,
      key: story.id || `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
  }, [stories]);

  if (!stories || stories.length === 0) {
    return (
      <div style={{
        width: '100%',
        padding: '1rem',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        No stories yet. Create your first story!
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.5rem',
      width: '100%',
      padding: '1rem',
      alignItems: 'stretch',
      justifyItems: 'center',
    }}>
      {storyKeys.map((story) => {
        const thumbnailUrl = story.thumbnailUrl || (story.images && story.images.length > 0 ? story.images[0] : '');
        
        return (
          <div
            key={story.key}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '220px',
              display: 'flex',
              flexDirection: 'column',
              height: '280px', // Reduced height
            }}
            onMouseOver={(e) => {
              const target = e.currentTarget;
              target.style.transform = 'translateY(-5px)';
              target.style.boxShadow = '0 8px 16px rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
            }}
          >
            <div style={{ height: '160px', width: '100%' }}> {/* Reduced image height */}
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt={story.title || 'Story image'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=No+Image';
                  }}
                />
              )}
            </div>
            <div style={{
              padding: '0.75rem',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                margin: '0',
                color: '#fff',
                fontSize: '1.1rem', // Slightly reduced font size
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {story.title || 'Untitled Story'}
              </h3>
              {story.createdAt && (
                <p style={{
                  margin: '0.5rem 0 0',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem', // Slightly reduced font size
                }}>
                  {new Date(story.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StoryGrid; 