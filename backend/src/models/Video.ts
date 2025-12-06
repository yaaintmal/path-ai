import { model, Schema } from 'mongoose';

const languageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    closedCaptionText: { type: String, default: '', required: false },
    closedCaptionVtt: { type: String, default: '', required: false },
  },
  { _id: false }
);

export const videoSchema = new Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    videoPublicId: {
      type: String,
    },
    etag: {
      type: String,
      index: true,
      trim: true,
    },
    originalLanguage: {
      type: languageSchema,
      required: true,
    },
    translations: {
      type: [languageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default model('Video', videoSchema);
