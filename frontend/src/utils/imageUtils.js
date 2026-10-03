export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (http/https/data:image), return it
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Use environment variable for backend URL, or fallback to relative path if proxy is configured
  const backendUrl = import.meta.env.VITE_API_URL || '';
  
  // Ensure we don't double up on slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${backendUrl}${cleanPath}`;
};
