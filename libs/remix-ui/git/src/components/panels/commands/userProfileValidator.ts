import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  lastLogin: z.date().optional()
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile {
  return UserProfileSchema.parse(input);
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    username,
    email,
    preferences: {}
  };
}

export { UserProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };