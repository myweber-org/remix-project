import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true),
  }).default({}),
  createdAt: z.date().default(() => new Date()),
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

function createDefaultProfile(username: string, email: string): UserProfile {
  return UserProfileSchema.parse({
    username,
    email,
  });
}

export { UserProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Please provide a valid email address')
    .endsWith('.com', 'Email must be from a .com domain'),
  
  age: z.number()
    .int('Age must be a whole number')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be realistic'),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().length(2, 'Language code must be 2 characters')
  }).strict(),
  
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(5, 'Maximum 5 tags allowed'),
  
  lastActive: z.date()
    .max(new Date(), 'Last active date cannot be in the future')
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  try {
    return userProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Validation failed:\n${formattedErrors.join('\n')}`);
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
    },
    tags: ['new-user'],
    lastActive: new Date()
  };
}