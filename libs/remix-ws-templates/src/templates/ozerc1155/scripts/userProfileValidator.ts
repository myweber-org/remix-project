import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address format')
    .endsWith('.com', 'Email must be from a .com domain'),
  
  age: z.number()
    .int('Age must be a whole number')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be realistic'),
  
  subscriptionTier: z.enum(['free', 'premium', 'enterprise'], {
    errorMap: () => ({ message: 'Invalid subscription tier selected' })
  }),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    language: z.string().default('en')
  }).optional()
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(input);
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
      newsletter: false,
      theme: 'auto',
      language: 'en'
    }
  };
}