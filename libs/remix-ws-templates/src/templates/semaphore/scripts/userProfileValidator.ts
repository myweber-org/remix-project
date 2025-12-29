import { z } from 'zod';

const addressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().regex(/^\d{5}$/, 'Invalid postal code format'),
    country: z.enum(['US', 'CA', 'GB', 'DE', 'FR'])
});

const userProfileSchema = z.object({
    id: z.string().uuid(),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username cannot exceed 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    age: z.number().int().min(18, 'Must be at least 18 years old').max(120, 'Invalid age'),
    isActive: z.boolean().default(true),
    preferences: z.object({
        theme: z.enum(['light', 'dark', 'system']).default('system'),
        notifications: z.boolean().default(true),
        language: z.enum(['en', 'es', 'fr', 'de']).default('en')
    }),
    addresses: z.array(addressSchema).min(1, 'At least one address is required'),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().optional()
}).refine(
    (data) => data.updatedAt ? data.updatedAt >= data.createdAt : true,
    { message: 'Updated date cannot be before creation date' }
);

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
    return userProfileSchema.parse(input);
}

export function safeValidateUserProfile(input: unknown) {
    return userProfileSchema.safeParse(input);
}

export function createDefaultProfile(username: string, email: string): Partial<UserProfile> {
    return {
        username,
        email,
        age: 18,
        preferences: {},
        addresses: []
    };
}