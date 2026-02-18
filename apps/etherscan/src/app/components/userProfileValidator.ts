import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  lastActive: z.date().optional()
});

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(input: unknown): UserProfile | null {
  const result = userProfileSchema.safeParse(input);
  if (result.success) {
    return result.data;
  }
  console.error('Validation failed:', result.error.format());
  return null;
}

export { userProfileSchema, validateUserProfile, type UserProfile };