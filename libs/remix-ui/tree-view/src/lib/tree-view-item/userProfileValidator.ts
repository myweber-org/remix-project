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
}