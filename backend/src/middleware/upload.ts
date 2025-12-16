import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

const STORAGE_DRIVER = process.env.STORAGE_DRIVER || 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const memoryStorage = multer.memoryStorage();
let upload: any;

if (STORAGE_DRIVER === 'local') {
  const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
  const diskStorage = multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
  });
  console.log(`[upload] Using local disk storage -> ${uploadsDir}`);
  upload = multer({ storage: diskStorage });
} else {
  // Use memory storage for Cloudinary uploads and upload programmatically from buffers
  console.log('[upload] Using Cloudinary memory storage -> will upload buffers via uploader API');
  upload = multer({ storage: memoryStorage });
}

export const uploadToCloudinary = async (file: Express.Multer.File, folder = 'ttl_videos') => {
  if (!file || !file.buffer) throw new Error('No file buffer provided for Cloudinary upload');
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const res = await cloudinary.uploader.upload(dataUri, { folder, resource_type: 'auto' });
  return res;
};

export const cloudinaryClient = cloudinary;
export default upload;
