import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  return UserProfileSchema.parse(input);
}

export function safeValidateUserProfile(input: unknown) {
  return UserProfileSchema.safeParse(input);
}