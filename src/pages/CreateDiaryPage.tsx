import React, { useState, useEffect, useRef } from 'react';
import '../styles/global.css';
import { useNavigate } from 'react-router-dom';
import StoryGrid from '../components/StoryGrid';
import { 
  uploadImages, 
  getAllStories, 
  deleteStory, 
  Story, 
  ImageResponse, 
  getImages, 
  analyzeImagesSequentially,
  generateStory,
  StoryGenerationResponse,
  createStory 
} from '../services/api';

const CreateDiaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImageResponse[]>([]);
  const [combinedDescription, setCombinedDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<StoryGenerationResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStories();
    fetchImages();
  }, []);

  const fetchStories = async () => {
    try {
      const fetchedStories = await getAllStories();
      setStories(fetchedStories);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const images = await getImages();
      setUploadedImages(images);
      console.log('Fetched images:', images);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

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

  const handleCreateStory = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadedImages = await uploadImages(Array.from(files));
      console.log('Successfully uploaded images:', uploadedImages);
      setUploadedImages(uploadedImages);

      // Start analyzing images
      setIsAnalyzing(true);
      const description = await analyzeImagesSequentially(uploadedImages);
      setCombinedDescription(description);
      setIsAnalyzing(false);

      // Generate story
      setIsGeneratingStory(true);
      const storyResult = await generateStory(description);
      setGeneratedStory(storyResult);
      setIsGeneratingStory(false);

      // Save the story
      if (storyResult.title && storyResult.story && uploadedImages.length > 0) {
        const imageUrls = uploadedImages.map(img => img.image_path);
        const storyId = uploadedImages[0].story_id;
        await createStory(storyResult.title, storyResult.story, imageUrls, storyId);
        console.log('Story saved successfully!');
      }
    } catch (error) {
      console.error('Failed to generate story:', error);
      // Handle error appropriately
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = ''; // Reset file input
      }
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      await deleteStory(storyId);
      setStories(prev => prev.filter(story => story.id !== storyId));
    } catch (error) {
      console.error('Failed to delete story:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  const renderDescription = () => {
    if (isAnalyzing) {
      return <p>Analyzing images...</p>;
    }
    if (isGeneratingStory) {
      return <p>Generating story...</p>;
    }
    return (
      <>
        {combinedDescription && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Image Analysis:</h3>
            <p>{combinedDescription}</p>
          </div>
        )}
        {generatedStory && (
          <div>
            {generatedStory.title && (
              <h2 style={{ 
                color: '#FFB6C1',
                marginTop: '20px',
                marginBottom: '10px',
                fontSize: '24px'
              }}>
                {generatedStory.title}
              </h2>
            )}
            <h3 style={{ 
              color: '#87CEEB',
              marginTop: '20px'
            }}>Generated Story:</h3>
            <p style={{
              color: '#FFB6C1',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              marginTop: '10px'
            }}>{generatedStory.story}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap" rel="stylesheet" />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        background: 'black',
        color: 'white',
        position: 'relative',
        overflow: 'auto',
        padding: '1rem',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 'bold',
          margin: '1rem 0 3rem 0',
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          display: 'flex',
          gap: '15px',
          textAlign: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
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
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0',
          position: 'relative',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          gap: '1rem',
          boxSizing: 'border-box',
        }}>
          {/* Button Container */}
          <div style={{
            width: window.innerWidth < 768 ? '100%' : '140px',
            marginRight: window.innerWidth < 768 ? '0' : '1rem',
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'row' : 'column',
            gap: '1rem',
            alignSelf: 'flex-start',
            position: window.innerWidth < 768 ? 'relative' : 'sticky',
            top: '2rem',
            flexWrap: window.innerWidth < 768 ? 'wrap' : 'nowrap',
            justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start',
            boxSizing: 'border-box',
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
                width: '100%',
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
                width: '100%',
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
              onClick={handleCreateStory}
              style={{
                padding: '0.6rem 1.2rem',
                background: 'rgba(57, 255, 20, 0.15)',
                color: '#39FF14',
                border: '2px solid #39FF14',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: '500',
                cursor: isUploading ? 'not-allowed' : 'pointer',
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
                opacity: isUploading ? 0.7 : 1,
                width: '100%',
              }}
              disabled={isUploading}
              onMouseOver={(e) => {
                if (!isUploading) {
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
                }
              }}
              onMouseOut={(e) => {
                if (!isUploading) {
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
                }
              }}
            >
              {isUploading ? 'Creating...' : 'Create Story'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => {
                if (stories.length > 0 && window.confirm('Are you sure you want to delete all stories?')) {
                  stories.forEach(story => handleDeleteStory(story.id));
                }
              }}
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
                width: '100%',
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

          {/* Main Content Container */}
          <div style={{
            flex: '1',
            maxWidth: '800px',
            minHeight: '60vh',
            maxHeight: window.innerWidth < 768 ? '100%' : '75vh',
            borderRadius: '20px',
            padding: '1.5rem',
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
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            boxSizing: 'border-box',
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
            {stories.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.2rem',
                fontFamily: 'Quicksand, sans-serif'
              }}>
                <h3 style={{
                  color: '#FFB6C1',
                  marginBottom: '1rem',
                  textShadow: '0 0 10px rgba(255, 182, 193, 0.5)'
                }}>No stories yet</h3>
                <p>Create your first story by clicking the "Create Story" button!</p>
              </div>
            ) : (
              <>
                <StoryGrid stories={stories} />
                {renderDescription()}
              </>
            )}
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

          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
            width: 8px;
          }

          div::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }

          div::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>
    </>
  );
};

export default CreateDiaryPage; 