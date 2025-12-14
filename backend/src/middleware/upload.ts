import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

const STORAGE_DRIVER = process.env.STORAGE_DRIVER || 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'ttl_videos',
      resource_type: 'auto',
    },
  } as any);
  console.log('[upload] Using Cloudinary storage -> folder: ttl_videos');

  upload = multer({ storage });
}

export const cloudinaryClient = cloudinary;
export default upload;
