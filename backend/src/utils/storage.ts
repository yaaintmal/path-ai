import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';
import deleteFromCloudinary from './cloudinary.ts';

const STORAGE_DRIVER = process.env.STORAGE_DRIVER || 'cloudinary';
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
const SERVER_BASE_URL = (process.env.SERVER_BASE_URL || '').replace(/\/$/, '');
const DEFAULT_HOST = `http://localhost:${process.env.PORT || 3000}`;

export const deleteFromStorage = async (identifier?: string | null) => {
  if (!identifier) return;

  if (STORAGE_DRIVER === 'local') {
    // identifier is filename or relative path
    try {
      const name =
        identifier.includes('/') || identifier.includes('\\')
          ? path.basename(identifier)
          : identifier;
      const full = path.isAbsolute(identifier) ? identifier : path.join(UPLOADS_DIR, name);
      await fs.unlink(full);
    } catch (err) {
      // Swallow deletion errors like before
      console.warn('Failed to delete local file', err);
    }
    return;
  }

  // Fallback to Cloudinary deletion
  try {
    await deleteFromCloudinary(identifier);
  } catch (err) {
    console.warn('Failed to delete from cloudinary via storage wrapper', err);
  }
};

export const computeEtagForFile = async (filePath: string) => {
  try {
    const h = createHash('sha256');
    const stream = (await import('fs')).createReadStream(filePath);
    return await new Promise<string>((resolve, reject) => {
      stream.on('data', (chunk: Buffer | string) =>
        h.update(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      );
      stream.on('end', () => resolve(h.digest('hex')));
      stream.on('error', reject);
    });
  } catch (err) {
    console.warn('Failed to compute etag for file', err);
    return undefined;
  }
};

export const buildPublicUrl = (filenameOrPath: string) => {
  if (STORAGE_DRIVER === 'local') {
    // Expose under /uploads/:filename
    const filename = path.basename(filenameOrPath);
    if (!SERVER_BASE_URL) return `${DEFAULT_HOST}/uploads/${encodeURIComponent(filename)}`;
    return `${SERVER_BASE_URL}/uploads/${encodeURIComponent(filename)}`;
  }

  // For cloudinary fallback, assume identifier is a public id or full URL and return as-is
  return filenameOrPath;
};

export default {
  deleteFromStorage,
  computeEtagForFile,
  buildPublicUrl,
};
