// Use environment variable with fallback for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://googleml.kro.kr:8000';

// Add CORS headers to all requests
const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Origin': window.location.origin
};

export interface ImageResponse {
  story_id: string;
  image_path: string;
  image_number: number;
  created_at: string;
  description: string;
}

export interface UploadResponse {
  story_id: string;
  image_urls: string[];
  image_count: number;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  images: string[];
  createdAt: string;
}

export interface StoryGenerationResponse {
  story: string;
  title?: string;  // Making title optional since it will be added after story generation
}

export interface CreateStoryRequest {
  story_title: string;
  story_text: string;
  image_urls: string[];
  story_id: string;  // Added as required by the API
}

export const analyzeImageWithBlip = async (imageUrl: string): Promise<string> => {
  try {
    if (!imageUrl) {
      throw new Error('Image URL is required for BLIP analysis');
    }

    console.log('\n--- BLIP Analysis Start ---');
    console.log('Analyzing image URL:', imageUrl);
    
    // Log the full URL being called
    const apiUrl = `${API_BASE_URL}/api/v1/blip/analyze?image_url=${encodeURIComponent(imageUrl)}`;
    console.log('Calling BLIP API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    const responseText = await response.text();
    console.log('Raw BLIP response:', responseText);

    if (!response.ok) {
      console.error('BLIP analysis failed with status:', response.status);
      console.error('Error response:', responseText);
      throw new Error(`Failed to analyze image: ${response.status} ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse BLIP response:', e);
      throw new Error('Invalid JSON response from BLIP API');
    }

    if (!data.success || !data.description) {
      throw new Error('Invalid BLIP response format: missing description or success flag');
    }

    console.log('BLIP API Response:', {
      status: response.status,
      data: data
    });
    console.log('--- BLIP Analysis End ---\n');
    return data.description;
  } catch (error) {
    console.error('BLIP analysis error:', error);
    throw error;
  }
};

export const analyzeImagesSequentially = async (images: ImageResponse[]): Promise<string> => {
  try {
    if (!images || images.length === 0) {
      throw new Error('No images provided for analysis');
    }

    console.log('\n=== Starting Sequential Image Analysis ===');
    console.log('Raw images data:', JSON.stringify(images, null, 2));
    console.log('Processing', images.length, 'images');
    
    const sortedImages = [...images].sort((a, b) => a.image_number - b.image_number);
    console.log('Images sorted by number:', JSON.stringify(sortedImages.map(img => ({
      number: img.image_number,
      path: img.image_path,
      story_id: img.story_id
    })), null, 2));
    
    const descriptions: string[] = [];

    for (let i = 0; i < sortedImages.length; i++) {
      const image = sortedImages[i];
      if (!image.image_path) {
        console.error(`Missing image path for image ${i + 1}:`, image);
        continue;
      }

      console.log(`\nProcessing image ${i + 1}/${sortedImages.length}`);
      console.log('Image details:', {
        number: image.image_number,
        path: image.image_path,
        story_id: image.story_id
      });

      try {
        const description = await analyzeImageWithBlip(image.image_path);
        console.log(`Description for image ${i + 1}:`, description);
        descriptions.push(`${i + 1}. ${description}`);
      } catch (error) {
        console.error(`Failed to analyze image ${i + 1}:`, error);
        descriptions.push(`${i + 1}. [Analysis failed]`);
      }
    }

    const finalResult = descriptions.join(' | ');
    console.log('\nFinal combined description:', finalResult);
    console.log('=== Sequential Image Analysis Complete ===\n');
    return finalResult;
  } catch (error) {
    console.error('Sequential analysis error:', error);
    throw error;
  }
};

export const getImages = async (): Promise<ImageResponse[]> => {
  try {
    console.log('Fetching images from:', `${API_BASE_URL}/v2/images/`);
    const response = await fetch(`${API_BASE_URL}/v2/images/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Request failed with status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`Failed to get images: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('GET response:', data);
    return data;
  } catch (error) {
    console.error('GET error:', error);
    throw error;
  }
};

export const uploadImages = async (images: File[]): Promise<ImageResponse[]> => {
  if (images.length > 4) {
    throw new Error('Maximum 4 images can be uploaded at once');
  }

  const formData = new FormData();
  images.forEach((image) => {
    formData.append('files', image);
  });

  try {
    console.log('Uploading images to:', `${API_BASE_URL}/v2/images/upload`);
    const response = await fetch(`${API_BASE_URL}/v2/images/upload`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed with status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`Failed to upload images: ${response.status} ${errorText}`);
    }

    const data: UploadResponse = await response.json();
    console.log('Raw upload response:', JSON.stringify(data, null, 2));
    
    // Convert the upload response to ImageResponse format
    const imageResponses: ImageResponse[] = data.image_urls.map((url, index) => ({
      story_id: data.story_id,
      image_path: url,
      image_number: index + 1,
      created_at: new Date().toISOString(),
      description: '' // This will be filled by BLIP analysis
    }));

    console.log('Converted to ImageResponse format:', JSON.stringify(imageResponses, null, 2));
    return imageResponses;

  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getAllStories = async (): Promise<Story[]> => {
  try {
    console.log('Fetching stories from:', `${API_BASE_URL}/api/v1/stories/`);
    const response = await fetch(`${API_BASE_URL}/api/v1/stories/`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Request failed with status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch stories: ${response.status} ${errorText}`);
    }

    const rawData = await response.json();
    console.log('Raw stories response:', rawData);

    // Transform the API response to match our Story interface
    const stories: Story[] = rawData.map((story: any) => {
      // Use _id from the API response
      const storyId = story._id;
      
      if (!storyId) {
        console.error('Story missing ID:', story);
        throw new Error('Story from API is missing _id');
      }

      return {
        id: storyId,
        title: story.story_title || '',
        content: story.story_text || '',
        thumbnailUrl: story.image_urls && story.image_urls.length > 0 ? story.image_urls[0] : '',
        images: story.image_urls || [],
        createdAt: story.created_at || new Date().toISOString()
      };
    });

    console.log('Transformed stories:', stories);
    return stories;
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    throw error;
  }
};

export const deleteStory = async (storyId: string): Promise<void> => {
  try {
    console.log('Deleting story with ID:', storyId);
    console.log('Delete URL:', `${API_BASE_URL}/api/v1/stories/${storyId}`);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/stories/${storyId}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log('Delete response:', responseText);

    if (!response.ok) {
      console.error('Delete request failed with status:', response.status);
      console.error('Error response:', responseText);
      throw new Error(`Failed to delete story: ${response.status} ${responseText}`);
    }

    console.log('Story successfully deleted from API');
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
};

export const generateTitle = async (storyText: string): Promise<string> => {
  try {
    console.log('Generating title for story:', storyText);
    const response = await fetch(`${API_BASE_URL}/api/v1/openai/generate-story-title`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
      },
      body: storyText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Title generation failed with status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`Failed to generate title: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Title generation response:', data);
    return data.title || data; // Handle both {title: string} and direct string response
  } catch (error) {
    console.error('Title generation error:', error);
    throw error;
  }
};

export const generateStory = async (imageDescriptions: string): Promise<StoryGenerationResponse> => {
  try {
    console.log('Generating story for descriptions:', imageDescriptions);
    const response = await fetch(`${API_BASE_URL}/api/v1/openai/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
      },
      body: imageDescriptions
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Story generation failed with status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`Failed to generate story: ${response.status} ${errorText}`);
    }

    const storyData = await response.json();
    console.log('Story generation response:', storyData);

    // Generate title from the story
    const title = await generateTitle(storyData.story);
    console.log('Generated title:', title);

    // Return both story and title
    return {
      story: storyData.story,
      title: title
    };
  } catch (error) {
    console.error('Story generation error:', error);
    throw error;
  }
};

export const createStory = async (title: string, content: string, images: string[], storyId: string): Promise<Story> => {
  try {
    console.log('Creating new story with:', { title, content, images, storyId });
    
    const requestBody: CreateStoryRequest = {
      story_title: title,
      story_text: content,
      image_urls: images,
      story_id: storyId
    };

    const response = await fetch(`${API_BASE_URL}/api/v1/stories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Story creation failed with status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`Failed to create story: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Story creation response:', data);
    return data;
  } catch (error) {
    console.error('Story creation error:', error);
    throw error;
  }
}; 