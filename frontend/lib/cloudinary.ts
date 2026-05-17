import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the public_id from a Cloudinary URL
 * @param url Cloudinary URL
 * @returns public_id
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // Typical URL: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[public_id].[ext]
    // Or with folders: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/folder1/folder2/[public_id].[ext]
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    // The public_id starts after the version part (which starts with 'v')
    // and ends before the extension
    const remainingParts = parts.slice(uploadIndex + 2); // skip 'upload' and 'v12345'
    const lastPart = remainingParts[remainingParts.length - 1];
    const fileNameWithoutExtension = lastPart.split('.')[0];
    
    // Join folders if any
    const folders = remainingParts.slice(0, -1);
    return [...folders, fileNameWithoutExtension].join('/');
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

/**
 * Deletes an image from Cloudinary
 * @param publicId Cloudinary public_id
 */
export const deleteImage = async (publicId: string): Promise<any> => {
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
