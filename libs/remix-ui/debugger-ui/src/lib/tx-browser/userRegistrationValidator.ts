import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const userRegistrationSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username cannot exceed 50 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: z.string()
        .email('Invalid email address')
        .endsWith('@example.com', 'Only example.com domains are allowed for registration'),
    
    password: passwordSchema,
    
    confirmPassword: z.string(),
    
    age: z.number()
        .int('Age must be an integer')
        .min(18, 'You must be at least 18 years old')
        .max(120, 'Age must be realistic'),
    
    termsAccepted: z.boolean()
        .refine(val => val === true, 'You must accept the terms and conditions'),
    
    registrationDate: z.date()
        .default(() => new Date())
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(input: unknown): UserRegistrationData {
    return userRegistrationSchema.parse(input);
}

export function safeValidateUserRegistration(input: unknown) {
    return userRegistrationSchema.safeParse(input);
}