import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean().default(true),
  }),
  createdAt: z.date(),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
  return UserProfileSchema.parse(data);
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    id: crypto.randomUUID(),
    username,
    email,
    preferences: {
      theme: 'system',
      notifications: true,
    },
    createdAt: new Date(),
  };
}

export { UserProfile, validateUserProfile, createDefaultProfile };