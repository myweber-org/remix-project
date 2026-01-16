import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Please provide a valid email address'),
  
  age: z
    .number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be a reasonable value'),
  
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean(),
    language: z.string().default('en')
  }).optional(),
  
  tags: z
    .array(z.string())
    .max(5, 'Cannot have more than 5 tags')
    .optional()
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

export function createDefaultProfile(): Partial<UserProfile> {
  return {
    preferences: {
      theme: 'auto',
      notifications: true,
      language: 'en'
    },
    tags: []
  };
}