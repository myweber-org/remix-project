import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const UserProfileUpdateSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  
  phoneNumber: z.string()
    .regex(phoneRegex, 'Invalid phone number format')
    .optional()
    .nullable(),
  
  birthDate: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format'
    })
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      return date < now;
    }, {
      message: 'Birth date must be in the past'
    })
    .optional()
    .nullable(),
  
  preferences: z.object({
    newsletter: z.boolean().default(false),
    twoFactorAuth: z.boolean().default(false),
    language: z.enum(['en', 'es', 'fr', 'de']).default('en')
  }).optional()
});

export type UserProfileUpdateInput = z.infer<typeof UserProfileUpdateSchema>;

export function validateUserProfileUpdate(data: unknown): UserProfileUpdateInput {
  return UserProfileUpdateSchema.parse(data);
}

export function safeValidateUserProfileUpdate(data: unknown) {
  return UserProfileUpdateSchema.safeParse(data);
}import { z } from 'zod';

const userProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Invalid email address format')
    .endsWith('.com', 'Email must be from a .com domain'),
  
  age: z
    .number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be a realistic value'),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().length(2, 'Language code must be 2 characters')
  }).strict(),
  
  tags: z
    .array(z.string().min(1))
    .max(5, 'Cannot have more than 5 tags')
    .optional()
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  try {
    return userProfileSchema.parse(data);
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