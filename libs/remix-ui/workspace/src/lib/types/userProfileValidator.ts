import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const userProfileUpdateSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address')
    .optional(),
  
  phoneNumber: z.string()
    .regex(phoneRegex, 'Invalid phone number format')
    .optional(),
  
  dateOfBirth: z.string()
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      const minDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
      const maxDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
      return date >= minDate && date <= maxDate;
    }, 'Date of birth must be between 13 and 120 years ago')
    .optional(),
  
  preferences: z.object({
    newsletter: z.boolean().default(false),
    twoFactorAuth: z.boolean().default(false),
    language: z.enum(['en', 'es', 'fr', 'de']).default('en')
  }).optional()
}).refine(
  (data) => data.email || data.phoneNumber,
  {
    message: 'Either email or phone number must be provided',
    path: ['email']
  }
);

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;

export function validateUserProfileUpdate(data: unknown): UserProfileUpdateInput {
  return userProfileUpdateSchema.parse(data);
}