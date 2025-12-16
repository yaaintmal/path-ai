/**
 * Simple migration script: download videos that have a `videoPublicId` (Cloudinary) and save them
 * into the local `UPLOADS_DIR`, then update the Video document to set `storagePath` and new `videoUrl`.
 * Use with caution and test on a small subset first.
 */
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import '#db';
import { Video } from '#models';
import { computeEtagForFile } from '#utils';

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

const main = async () => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const videos = await Video.find({ videoPublicId: { $exists: true, $ne: null } });
  console.log(`Found ${videos.length} videos with Cloudinary publicId`);

  for (const v of videos) {
    try {
      const url = v.videoUrl;
      const resp = await fetch(url);
      if (!resp.ok) {
        console.warn('Failed to download', url, resp.status);
        continue;
      }
      const filename = `${Date.now()}-${path.basename(url).replace(/\s+/g, '_')}`;
      const dest = path.join(UPLOADS_DIR, filename);
      const buffer = Buffer.from(await resp.arrayBuffer());
      await fs.writeFile(dest, buffer);
      const etag = await computeEtagForFile(dest);
      v.storagePath = filename as any;
      v.videoUrl = `${process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 3000}`}/uploads/${encodeURIComponent(
        filename
      )}`;
      if (etag) v.etag = etag as any;
      await v.save();
      console.log('Migrated', v._id.toString());
    } catch (err) {
      console.error('Migration error for', v._id?.toString(), err);
    }
  }
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
