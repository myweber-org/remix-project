import { z } from 'zod';

const userProfileSchema = z.object({
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

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(data: unknown): UserProfile | null {
  const result = userProfileSchema.safeParse(data);
  return result.success ? result.data : null;
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return userProfileSchema.parse({
    username,
    email
  });
}

export { userProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };