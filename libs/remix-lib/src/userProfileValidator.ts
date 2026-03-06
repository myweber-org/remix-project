import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean()
  }).default({
    theme: 'auto',
    notifications: true
  }),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  return UserProfileSchema.parse(input);
}

export function safeValidateUserProfile(input: unknown) {
  return UserProfileSchema.safeParse(input);
}