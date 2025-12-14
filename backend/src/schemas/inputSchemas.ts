import { z } from 'zod';
import { Types } from 'mongoose';
import type { MessageResponse } from '#types';

const ObjectIdStringSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'must be a 24 character hex string' })
  .refine((val) => Types.ObjectId.isValid(val), { message: 'must be a valid ObjectId' });

const EmailSchema = z
  .string()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'email must be a valid email address',
  })
  .min(5)
  .max(30);

const PasswordSchema = z
  .string({ error: 'password must be a string' })
  .min(8, { message: 'password must be at least 8 characters long' })
  .max(16, { message: 'password must be at most 16 characters long' })
  .regex(/[a-z]/, { message: 'password must include a lowercase letter' })
  .regex(/[A-Z]/, { message: 'password must include an uppercase letter' })
  .regex(/\d/, { message: 'password must include a number' })
  .regex(/[^A-Za-z0-9\s]/, {
    message: 'password must include a special character',
  });

export const IdParamSchema = z.object({
  id: ObjectIdStringSchema,
});

// User Schemas
export const UserInputSchema = z
  .object({
    name: z.string().min(2),
    email: EmailSchema,
    password: PasswordSchema,
    roles: z.array(z.string()).default(['user']),
  })
  .strict();

export type UserInputDTO = z.infer<typeof UserInputSchema>;
export type UserDTO = Omit<UserInputDTO, 'password'> & { id: string };

export const UserUpdateInputSchema = z
  .object({
    name: z.string().min(2),
    email: EmailSchema,
    roles: z.array(z.string()).default(['user']),
  })
  .strict();

export type UserUpdateInputDTO = z.infer<typeof UserUpdateInputSchema>;
export type UserUpdateDTO = UserUpdateInputDTO & { id: string };

// Authentication Schemas
// For login, we don't validate password format - just that it's a non-empty string
// The actual validation happens by comparing with the stored hash
export const AuthLoginSchema = z
  .object({
    email: EmailSchema,
    password: z.string().min(1, { message: 'password is required' }),
  })
  .strict();

export type LoginInputDTO = z.infer<typeof AuthLoginSchema>;
export type LoginDTO = LoginInputDTO;

// For registration, we allow simpler passwords for existing users
export const AuthRegisterSchema = z
  .object({
    email: EmailSchema,
    password: z.string().min(6, { message: 'password must be at least 6 characters' }),
    name: z.string().min(1, { message: 'name is required' }),
  })
  .strict();

export type RegisterInputDTO = z.infer<typeof AuthRegisterSchema>;
export type RegisterDTO = RegisterInputDTO;

export const ChangeUserPasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: 'password must be a string' })
      .min(1, { message: 'current password is required' }),
    newPassword: PasswordSchema,
    confirmNewPassword: z
      .string({ error: 'password must be a string' })
      .min(1, { message: 'confirm new password is required' }),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'passwords must match',
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    path: ['newPassword'],
    message: 'new password must be different from current password',
  })
  .strict();

export type ChangePasswordInputDTO = z.infer<typeof ChangeUserPasswordSchema>;
export type ChangePasswordDTO = MessageResponse;

// Learning/Bookmark Schemas
export const BookmarkInputSchema = z
  .object({
    title: z.string().min(1),
    type: z.enum(['topic', 'subtopic']).default('topic'),
  })
  .strict();

export type BookmarkInputDTO = z.infer<typeof BookmarkInputSchema>;

export const LearnedTopicInputSchema = z
  .object({
    title: z.string().min(1),
    type: z.enum(['topic', 'subtopic']).default('topic'),
    score: z.number().min(0).max(100).default(0),
  })
  .strict();

export type LearnedTopicInputDTO = z.infer<typeof LearnedTopicInputSchema>;

// Video Schemas
export const VideoInputSchema = z
  .object({
    videoUrl: z.string().url().optional(),
    targetLanguage: z.string().min(2).optional(),
  })
  .strict();

export type VideoInputDTO = z.infer<typeof VideoInputSchema>;
export type LanguageDTO = {
  name: string;
  closedCaptionText?: string;
  closedCaptionVtt?: string;
};

export type VideoDTO = VideoInputDTO & {
  id: string;
  originalLanguage: LanguageDTO;
  translations: Array<Pick<LanguageDTO, 'name' | 'closedCaptionVtt'>>;
};

export const VideoUpdateInputSchema = z
  .object({
    translations: z
      .array(
        z
          .object({
            name: z.string().min(1),
            closedCaptionVtt: z.string().optional().default(''),
          })
          .strict()
      )
      .min(1, { message: 'At least one translation is required' }),
  })
  .strict();

export type VideoUpdateInputDTO = z.infer<typeof VideoUpdateInputSchema>;

// Timer/Learning Session Schemas
export const TimerStartSessionSchema = z
  .object({
    goal: z
      .string({ error: 'goal must be a string' })
      .min(1, { message: 'goal is required' })
      .max(200, { message: 'goal must not exceed 200 characters' })
      .trim()
      .regex(/^[^<>]*$/, { message: 'goal must not contain HTML tags' }),
    learningPath: z
      .string()
      .min(1, { message: 'learningPath must not be empty if provided' })
      .max(200, { message: 'learningPath must not exceed 200 characters' })
      .trim()
      .regex(/^[^<>]*$/, { message: 'learningPath must not contain HTML tags' })
      .optional(),
  })
  .strict();

export type TimerStartSessionDTO = z.infer<typeof TimerStartSessionSchema>;
