import { z } from 'zod';

const emailSchema = z.string().email('Invalid email format');
const ageSchema = z.number().int().min(18, 'Must be at least 18 years old').max(120, 'Age must be realistic');

export const userProfileSchema = z.object({
  username: z.string().min(3, 'Username too short').max(50, 'Username too long'),
  email: emailSchema,
  age: ageSchema,
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto'])
  }).optional()
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}