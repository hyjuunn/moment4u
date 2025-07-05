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
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchStories();
    fetchImages();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Force a re-render on resize/zoom
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        
        // Refresh the stories list after successful creation
        await fetchStories();
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
      // If already in delete mode, perform deletion
      if (selectedStories.size > 0) {
        const confirmDelete = window.confirm(
          `Are you sure you want to delete ${selectedStories.size} selected ${
            selectedStories.size === 1 ? 'story' : 'stories'
          }?`
        );
        
        if (confirmDelete) {
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
        }
      }
      // Clear selected stories and exit delete mode
      setSelectedStories(new Set());
      setIsDeleteMode(false);
    } else {
      // Enter delete mode
      setIsDeleteMode(true);
      // Clear any previously selected stories when entering delete mode
      setSelectedStories(new Set());
    }
  };

  const renderDescription = () => {
    if (isAnalyzing) {
      return <p>Analyzing images...</p>;
    }
    if (isGeneratingStory) {
      return <p>Generating story...</p>;
    }
    return null;  // Don't render anything after generation is complete
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap" rel="stylesheet" />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          marginBottom: '2rem',
          fontFamily: 'Playfair Display, serif',
          fontWeight: '600',
          letterSpacing: '0.02em',
          color: '#FFB6C1',
          textAlign: 'center',
          textShadow: '0 0 15px rgba(255, 182, 193, 0.5)'
        }}>
          Story Dashboard
        </h1>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
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
              backgroundColor: isDeleteMode ? '#ff4444' : '#87CEEB',
              color: '#121212',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 5px 15px ${isDeleteMode ? 'rgba(255, 68, 68, 0.4)' : 'rgba(135, 206, 235, 0.4)'}`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isDeleteMode ? 'Finish Delete' : 'Delete Stories'}
          </button>
        </div>

        {isUploading && (
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '1.1rem',
            color: '#87CEEB',
            textAlign: 'center',
            margin: '1rem 0'
          }}>
            Uploading images...
          </p>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />

        {renderDescription()}
        
        <StoryGrid
          stories={stories}
          isDeleteMode={isDeleteMode}
          onStorySelect={handleStorySelect}
        />
      </div>
    </>
  );
};

export default CreateDiaryPage; 