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

function validateUserProfile(input: unknown): UserProfile {
  return userProfileSchema.parse(input);
}

function safeValidateUserProfile(input: unknown) {
  const result = userProfileSchema.safeParse(input);
  return result;
}

export { userProfileSchema, validateUserProfile, safeValidateUserProfile, type UserProfile };