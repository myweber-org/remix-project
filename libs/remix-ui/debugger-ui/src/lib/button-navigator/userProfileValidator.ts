import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean().default(true),
  }),
  createdAt: z.date(),
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

const sampleData = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  username: 'john_doe',
  email: 'john@example.com',
  age: 25,
  preferences: {
    theme: 'dark',
    notifications: false,
  },
  createdAt: new Date(),
};

const validatedProfile = validateUserProfile(sampleData);
if (validatedProfile) {
  console.log('Profile is valid:', validatedProfile);
}