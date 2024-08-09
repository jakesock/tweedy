import { z } from "zod";
import { MAX_NUM_FILES_PER_UPLOAD } from "./constants";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(/^[a-zA-z0-9_-]+$/, "Only letters, numbers, - and _ allowed"),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z
    .array(z.string())
    .max(MAX_NUM_FILES_PER_UPLOAD, `Cannot have more than ${MAX_NUM_FILES_PER_UPLOAD} attachments`),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Cannot be larger than 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
