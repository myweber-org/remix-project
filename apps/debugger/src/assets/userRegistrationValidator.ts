import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be a reasonable value'),
  
  termsAccepted: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
  
  subscriptionTier: z.enum(['free', 'premium', 'enterprise'])
    .default('free')
});

export type UserRegistrationData = z.infer<typeof UserRegistrationSchema>;

export function validateUserRegistration(input: unknown): UserRegistrationData {
  return UserRegistrationSchema.parse(input);
}

export function safeValidateUserRegistration(input: unknown) {
  return UserRegistrationSchema.safeParse(input);
}