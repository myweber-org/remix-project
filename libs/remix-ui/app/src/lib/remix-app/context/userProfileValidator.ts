import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true),
  }).default({
    theme: 'auto',
    notifications: true,
  }),
  lastActive: z.date().optional(),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile | null {
  const result = UserProfileSchema.safeParse(input);
  return result.success ? result.data : null;
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    id: crypto.randomUUID(),
    username,
    email,
    preferences: {
      theme: 'auto',
      notifications: true,
    },
  };
}

export { UserProfileSchema, type UserProfile, validateUserProfile, createDefaultProfile };