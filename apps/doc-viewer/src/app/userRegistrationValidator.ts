import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const userRegistrationSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username cannot exceed 50 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: z.string()
        .email('Invalid email address')
        .max(255, 'Email cannot exceed 255 characters'),
    
    password: passwordSchema,
    
    confirmPassword: z.string(),
    
    birthDate: z.date()
        .max(new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 13 years old')
        .optional(),
    
    acceptTerms: z.boolean()
        .refine(val => val === true, 'You must accept the terms and conditions')
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(input: unknown): UserRegistrationInput {
    return userRegistrationSchema.parse(input);
}

export function safeValidateUserRegistration(input: unknown) {
    return userRegistrationSchema.safeParse(input);
}