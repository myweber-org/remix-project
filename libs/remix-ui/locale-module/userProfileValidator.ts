import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().regex(/^\d{5}$/, 'Invalid postal code format'),
  country: z.enum(['US', 'CA', 'GB', 'AU'])
});

const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  age: z.number().int().min(18, 'Must be at least 18 years old').max(120, 'Invalid age'),
  isActive: z.boolean().default(true),
  preferences: z.object({
    newsletter: z.boolean().default(false),
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    language: z.string().default('en')
  }),
  addresses: z.array(addressSchema).min(1, 'At least one address is required'),
  metadata: z.record(z.string(), z.any()).optional()
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type Address = z.infer<typeof addressSchema>;

export class ProfileValidator {
  static validateProfile(data: unknown): UserProfile {
    return userProfileSchema.parse(data);
  }

  static validatePartialProfile(data: unknown): Partial<UserProfile> {
    return userProfileSchema.partial().parse(data);
  }

  static getValidationErrors(data: unknown): string[] {
    const result = userProfileSchema.safeParse(data);
    if (result.success) {
      return [];
    }
    return result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
  }

  static createDefaultProfile(username: string, email: string): UserProfile {
    return {
      id: crypto.randomUUID(),
      username,
      email,
      age: 18,
      isActive: true,
      preferences: {
        newsletter: false,
        theme: 'auto',
        language: 'en'
      },
      addresses: [{
        street: '',
        city: '',
        postalCode: '',
        country: 'US'
      }]
    };
  }
}