import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the public_id from a Cloudinary URL
 * @param url Cloudinary URL
 * @returns public_id
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return null;

    let path = urlParts[1];
    
    // Remove version if present (e.g., v1234567890/)
    if (path.match(/^v\d+\//)) {
      path = path.replace(/^v\d+\//, '');
    }

    // Remove extension securely
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }

    return path;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

/**
 * Deletes an image from Cloudinary
 * @param publicId Cloudinary public_id
 */
export const deleteImage = async (publicId: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary delete error:", error);
        reject(error);
      } else {
        console.log("Cloudinary delete result:", result);
        resolve(result);
      }
    });
  });
};

/**
 * Deletes multiple images from Cloudinary
 * @param urls Array of Cloudinary URLs
 */
export const deleteImagesByUrls = async (urls: string[]): Promise<void> => {
  if (!urls || urls.length === 0) return;

  const publicIds = urls
    .map(url => getPublicIdFromUrl(url))
    .filter((id): id is string => id !== null);

  if (publicIds.length === 0) return;

  try {
    // Cloudinary destroy only accepts one public_id at a time in the simple API,
    // or you can use the Admin API for bulk delete. 
    // For simplicity and safety (since we only have a few images per product),
    // we'll delete them one by one.
    await Promise.all(publicIds.map(id => deleteImage(id)));
  } catch (error) {
    console.error("Error in deleteImagesByUrls:", error);
  }
};

export default cloudinary;
