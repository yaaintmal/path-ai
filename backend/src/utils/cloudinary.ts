import { cloudinaryClient } from '#middleware';

const deleteFromCloudinary = async (publicId: string | null | undefined) => {
  if (!publicId) return;

  try {
    await cloudinaryClient.uploader.destroy(publicId, { resource_type: 'video' });
  } catch (err) {
    // Swallow deletion errors so they don't block API responses
    console.error('Failed to delete asset from Cloudinary', err);
  }
};

export default deleteFromCloudinary;
