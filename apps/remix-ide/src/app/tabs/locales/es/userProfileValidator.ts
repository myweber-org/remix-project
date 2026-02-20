import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true),
  }).default({}),
  createdAt: z.date().default(() => new Date()),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
    }
    throw new Error('Invalid user profile data');
  }
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return UserProfileSchema.parse({
    username,
    email,
  });
}

export { UserProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };typescript
interface UserProfile {
    id: string;
    email: string;
    age?: number;
    preferences: {
        theme: 'light' | 'dark';
        notifications: boolean;
    };
}

type ValidationResult = {
    isValid: boolean;
    errors: string[];
};

class ProfileValidator {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private static readonly MIN_AGE = 13;
    private static readonly MAX_AGE = 120;

    static validate(profile: unknown): ValidationResult {
        const errors: string[] = [];

        if (!this.isObject(profile)) {
            return { isValid: false, errors: ['Profile must be an object'] };
        }

        const userProfile = profile as Record<string, unknown>;

        if (!this.isValidString(userProfile.id)) {
            errors.push('ID must be a non-empty string');
        }

        if (!this.isValidEmail(userProfile.email)) {
            errors.push('Email must be a valid email address');
        }

        if (userProfile.age !== undefined && !this.isValidAge(userProfile.age)) {
            errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
        }

        if (!this.isValidPreferences(userProfile.preferences)) {
            errors.push('Preferences must include theme and notifications');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    private static isObject(value: unknown): value is object {
        return typeof value === 'object' && value !== null;
    }

    private static isValidString(value: unknown): value is string {
        return typeof value === 'string' && value.trim().length > 0;
    }

    private static isValidEmail(value: unknown): boolean {
        return this.isValidString(value) && this.EMAIL_REGEX.test(value);
    }

    private static isValidAge(value: unknown): boolean {
        return typeof value === 'number' && 
               Number.isInteger(value) && 
               value >= this.MIN_AGE && 
               value <= this.MAX_AGE;
    }

    private static isValidPreferences(value: unknown): boolean {
        if (!this.isObject(value)) return false;

        const prefs = value as Record<string, unknown>;
        
        return prefs.theme === 'light' || prefs.theme === 'dark' &&
               typeof prefs.notifications === 'boolean';
    }
}

export { ProfileValidator, type UserProfile, type ValidationResult };
```