import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/global.css';
import { useNavigate } from 'react-router-dom';
import StoryGrid from '../components/StoryGrid';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SortDropdown from '../components/SortDropdown';
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [isLightMode, setIsLightMode] = useState(() => {
    const savedMode = localStorage.getItem('isLightMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const glitterContainer = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { label: 'Newest', value: 'date-desc' },
    { label: 'Oldest', value: 'date-asc' },
    { label: 'A-Z', value: 'title-asc' },
    { label: 'Z-A', value: 'title-desc' },
  ];

  const sortedStories = useMemo(() => {
    const sorted = [...stories];
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'title-asc':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title-desc':
        return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      default:
        return sorted;
    }
  }, [stories, sortBy]);

  useEffect(() => {
    fetchStories();
    fetchImages();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const createSingleGlitter = () => {
      const glitter = document.createElement('div');
      const size = Math.random() * 15 + 5;
      const startX = Math.random() * window.innerWidth;
      const duration = Math.random() * 3 + 2;

      glitter.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${isLightMode ? 
          'radial-gradient(circle at 30% 30%, #FFD700, #FFA500)' : 
          'radial-gradient(circle at 30% 30%, #FFB6C1, #87CEEB)'};
        opacity: ${isLightMode ? '0.4' : '0.2'};
        border-radius: 50%;
        pointer-events: none;
        bottom: -${size}px;
        left: ${startX}px;
        animation: glitterFloat ${duration}s linear;
      `;

      glitterContainer.current?.appendChild(glitter);

      glitter.addEventListener('animationend', () => {
        glitter.remove();
      });
    };

    // Create initial batch - reduced from 30 to 15
    for (let i = 0; i < 15; i++) {
      setTimeout(createSingleGlitter, Math.random() * 3000);
    }

    // Continuously create new glitters - reduced frequency from 300ms to 800ms
    const interval = setInterval(() => {
      createSingleGlitter();
    }, 800);

    return () => {
      clearInterval(interval);
    };
  }, [isLightMode]);

  useEffect(() => {
    localStorage.setItem('isLightMode', JSON.stringify(isLightMode));
    document.body.style.backgroundColor = isLightMode ? '#faf4f7' : '#121212';
  }, [isLightMode]);

  useEffect(() => {
    let errorTimer: NodeJS.Timeout;
    
    if (showError) {
      errorTimer = setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimer);
    };
  }, [showError]);

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

    if (files.length > 4) {
      setErrorMessage('You can only upload up to 4 images at once');
      setShowError(true);
      if (event.target) {
        event.target.value = ''; // Reset file input
      }
      return;
    }

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
        
        // Refresh the stories list after successful creation
        await fetchStories();
      }
    } catch (error) {
      console.error('Failed to generate story:', error);
      setErrorMessage('An error occurred while processing your images');
      setShowError(true);
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = ''; // Reset file input
      }
    }
  };

  const handleStorySelect = (storyId: string) => {
    setSelectedStories(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(storyId)) {
        newSelected.delete(storyId);
      } else {
        newSelected.add(storyId);
      }
      return newSelected;
    });
  };

  const handleDeleteClick = async () => {
    if (isDeleteMode) {
      // If already in delete mode, check if there are stories to delete
      if (selectedStories.size > 0) {
        setShowDeleteConfirm(true);
      } else {
        // If no stories selected, just exit delete mode
        setIsDeleteMode(false);
      }
    } else {
      // Enter delete mode
      setIsDeleteMode(true);
      setSelectedStories(new Set());
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // Create an array to track failed deletions
      const failedDeletions: string[] = [];
      
      // Log the stories we're about to delete
      console.log('Selected stories for deletion:', Array.from(selectedStories));
      console.log('Current stories:', stories);
      
      // Delete stories one by one to handle errors individually
      for (const storyId of Array.from(selectedStories)) {
        try {
          console.log('Attempting to delete story with ID:', storyId);
          await deleteStory(storyId);
          console.log('Successfully deleted story from API:', storyId);
          
          // Update stories list immediately after successful deletion
          setStories(prev => {
            console.log('Updating stories list after deletion. Current:', prev);
            const updated = prev.filter(story => story.id !== storyId);
            console.log('Updated stories list:', updated);
            return updated;
          });
        } catch (error) {
          console.error(`Failed to delete story ${storyId}:`, error);
          failedDeletions.push(storyId);
        }
      }
      
      // Show error message if any deletions failed
      if (failedDeletions.length > 0) {
        alert(`Failed to delete ${failedDeletions.length} stories. Please try again later.`);
      }
      
      // Refresh the stories list from the server
      await fetchStories();
    } catch (error) {
      console.error('Error in delete operation:', error);
      alert('An error occurred while deleting stories. Please try again.');
    }

    // Clear selected stories and exit delete mode
    setSelectedStories(new Set());
    setIsDeleteMode(false);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const isSmallScreen = windowWidth < 1100;

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh',
      backgroundColor: isLightMode ? '#faf4f7' : '#121212',
      transition: 'background-color 0.3s ease'
    }}>
      <style>
        {`
          @keyframes glitterFloat {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: ${isLightMode ? 0.4 : 0.2};
            }
            50% {
              opacity: ${isLightMode ? 0.6 : 0.3};
            }
            100% {
              transform: translateY(-${window.innerHeight}px) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>
      <div ref={glitterContainer} className="glitter-container" />
      <button
        onClick={() => setIsLightMode((prev: boolean) => !prev)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '0.6em 1.2em',
          fontSize: '0.9rem',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '500',
          letterSpacing: '0.05em',
          backgroundColor: isLightMode ? '#E68FAC' : 'transparent',
          color: isLightMode ? 'white' : '#FFB6C1',
          border: `2px solid ${isLightMode ? 'transparent' : '#FFB6C1'}`,
          borderRadius: '50px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 5px 15px ${isLightMode ? 'rgba(230, 143, 172, 0.4)' : 'rgba(255, 182, 193, 0.2)'}`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isLightMode ? '🌙 Dark' : '☀️ Light'}
      </button>
      <div style={{
        padding: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap" rel="stylesheet" />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          minHeight: '100vh',
          position: 'relative',
          color: isLightMode ? '#2C1810' : 'white'
        }}>
          <h1 style={{
            fontSize: '2.8rem',
            marginBottom: '1rem',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '600',
            letterSpacing: '0.02em',
            color: isLightMode ? '#E68FAC' : '#FFB6C1',
            textAlign: 'center',
            textShadow: isLightMode ? 
              '0 2px 4px rgba(230, 143, 172, 0.3)' : 
              '0 0 15px rgba(255, 182, 193, 0.5)'
          }}>
            Story Dashboard
          </h1>
          <div style={{
            width: '250px',
            height: '2px',
            background: isLightMode ?
              'linear-gradient(to right, transparent, rgba(230, 143, 172, 0.8) 20%, rgba(230, 143, 172, 0.8) 80%, transparent)' :
              'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.8) 80%, transparent)',
            margin: '0 auto 2rem auto',
            borderRadius: '1px'
          }} />

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '0.8em 2em',
                fontSize: '1.1rem',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                letterSpacing: '0.05em',
                backgroundColor: '#87CEEB',
                color: '#121212',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(135, 206, 235, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Back to Main
            </button>

            <button
              onClick={handleCreateStory}
              style={{
                padding: '0.8em 2em',
                fontSize: '1.1rem',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                letterSpacing: '0.05em',
                backgroundColor: '#FFB6C1',
                color: '#121212',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 182, 193, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Create Story
            </button>

            <button
              onClick={handleDeleteClick}
              style={{
                padding: '0.8em 2em',
                fontSize: '1.1rem',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                letterSpacing: '0.05em',
                backgroundColor: isDeleteMode ? '#4682B4' : '#87CEEB',
                color: '#121212',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 5px 15px ${isDeleteMode ? 'rgba(70, 130, 180, 0.4)' : 'rgba(135, 206, 235, 0.4)'}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isDeleteMode ? 'Finish Delete' : 'Delete Stories'}
            </button>
          </div>

          <div style={{
            ...(isSmallScreen ? {
              position: 'relative',
              marginBottom: '1rem'
            } : {
              position: 'absolute',
              right: '2rem',
              top: '11.5rem'
            }),
            opacity: 0.7,
            zIndex: 1000,
            display: stories.length > 0 ? 'block' : 'none'
          }}>
            <SortDropdown
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              isLightMode={isLightMode}
            />
          </div>

          <div style={{
            position: 'relative',
            marginTop: '1rem',
            marginBottom: '2rem',
            height: (isUploading || isAnalyzing || isGeneratingStory) ? '40px' : '0',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            {(isUploading || isAnalyzing || isGeneratingStory) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #FFB6C1, #87CEEB)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                letterSpacing: '0.02em',
                fontWeight: '500',
                animation: 'fadeInOut 2s infinite'
              }}>
                <span>
                  {isUploading ? 'Uploading your memories' : 
                   isAnalyzing ? 'Analyzing your story' : 
                   'Creating your story'}
                </span>
                <span style={{ animation: 'ellipsis 1.5s infinite' }}>...</span>
              </div>
            )}
          </div>

          <style>
            {`
              @keyframes fadeInOut {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
              
              @keyframes ellipsis {
                0% { opacity: 0.3; }
                50% { opacity: 1; }
                100% { opacity: 0.3; }
              }

              @keyframes slideDown {
                0% {
                  transform: translate(-50%, -100%);
                  opacity: 0;
                }
                100% {
                  transform: translate(-50%, 0);
                  opacity: 1;
                }
              }
            `}
          </style>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          
          <StoryGrid
            stories={sortedStories}
            isDeleteMode={isDeleteMode}
            onStorySelect={handleStorySelect}
          />
        </div>

        {showDeleteConfirm && (
          <DeleteConfirmModal
            count={selectedStories.size}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>

      {/* Error Message Popup */}
      {showError && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: '15px 25px',
            borderRadius: '12px',
            background: isLightMode 
              ? 'linear-gradient(135deg, #ff6b6b, #ff8787)'
              : 'linear-gradient(135deg, #2c3e50, #3498db)',
            color: '#ffffff',
            boxShadow: isLightMode
              ? '0 4px 15px rgba(255, 107, 107, 0.3)'
              : '0 4px 15px rgba(44, 62, 80, 0.3)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default CreateDiaryPage; 