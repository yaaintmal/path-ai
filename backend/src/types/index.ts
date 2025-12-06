import { userSchema } from '#models/User';
import { videoSchema } from '#models/Video';
import type { InferSchemaType } from 'mongoose';

export type VideoType = InferSchemaType<typeof videoSchema>;
export type UserType = InferSchemaType<typeof userSchema>;

export type MessageResponse = {
  message: string;
};
