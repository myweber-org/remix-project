
import { z } from 'zod';

const emailSchema = z.string().email().max(255);
const usernameSchema = z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/);
const ageSchema = z.number().int().min(18).max(120).optional();
const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().length(2).default('en')
});

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  username: usernameSchema,
  age: ageSchema,
  preferences: preferencesSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}