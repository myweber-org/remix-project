import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  tags: z.array(z.string()).max(10)
});

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(data: unknown): UserProfile | null {
  const result = userProfileSchema.safeParse(data);
  return result.success ? result.data : null;
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return userProfileSchema.parse({
    username,
    email,
    tags: []
  });
}

export { userProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };