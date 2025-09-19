import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload image buffer
export async function uploadImageToCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string = 'showsport-blog'
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
        public_id: filename,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
          });
        } else {
          reject(new Error('Upload failed - no result'));
        }
      }
    ).end(buffer);
  });
}

// Helper function to delete image from Cloudinary
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

// Helper function to generate responsive image URLs
export function generateResponsiveImageUrl(
  publicId: string,
  width: number,
  height?: number
): string {
  const transformation = height
    ? `w_${width},h_${height},c_fill,f_auto,q_auto:good`
    : `w_${width},f_auto,q_auto:good`;

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
}
