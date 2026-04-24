import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.MYCLOUDINARYNAME,
  api_key: process.env.CLOUDINARYAPIKEY,
  api_secret: process.env.CLOUDINARYSECRETKEY
});

/**
 * Upload an image to Cloudinary
 * @param {string|Buffer} file - File path or buffer to upload
 * @param {Object} options - Upload options
 * @param {string} options.folder - Cloudinary folder to store the image
 * @param {string} options.public_id - Custom public ID for the image
 * @param {string[]} options.tags - Tags for the image
 * @param {string} options.resourceType - Resource type (image, video, raw, auto)
 * @param {Object} options.transformation - Transformation options
 * @returns {Promise<Object>} Upload result with metadata
 */
export const uploadImage = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: options.folder || 'ai-tool-discovery',
      resource_type: options.resourceType || 'image',
      tags: options.tags || [],
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    // Merge custom options with defaults
    const uploadOptions = { ...defaultOptions, ...options };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, uploadOptions);

    // Return comprehensive metadata
    return {
      success: true,
      cloudinaryId: result.public_id,
      imageUrl: result.secure_url,
      thumbnailUrl: result.thumbnail_url || result.secure_url,
      originalFilename: result.original_filename,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      resourceType: result.resource_type,
      publicId: result.public_id,
      version: result.version,
      signature: result.signature,
      etag: result.etag,
      createdAt: result.created_at,
      tags: result.tags || [],
      url: result.url,
      secureUrl: result.secure_url
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image to Cloudinary',
      details: error
    };
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @param {string} resourceType - Resource type (image, video, raw)
 * @returns {Promise<Object>} Deletion result
 */
export const deleteImage = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete image from Cloudinary'
    };
  }
};

/**
 * Generate a thumbnail URL for an existing image
 * @param {string} publicId - The public ID of the image
 * @param {Object} options - Transformation options
 * @returns {string} Thumbnail URL
 */
export const generateThumbnail = (publicId, options = {}) => {
  const defaultOptions = {
    width: 200,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  };

  const transformOptions = { ...defaultOptions, ...options };

  return cloudinary.url(publicId, transformOptions);
};

export default cloudinary;