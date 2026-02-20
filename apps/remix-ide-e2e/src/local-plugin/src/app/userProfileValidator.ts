import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean().default(true)
  }).default({
    theme: 'system',
    notifications: true
  }),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(data: unknown): UserProfile | null {
  const result = UserProfileSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  console.error('Validation failed:', result.error.format());
  return null;
}

export { UserProfileSchema, validateUserProfile, type UserProfile };