import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address'),
  
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be realistic'),
  
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean(),
    language: z.string().length(2)
  }).optional(),
  
  tags: z.array(z.string())
    .max(10, 'Cannot have more than 10 tags')
    .optional()
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}