import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return UserProfileSchema.parse({
    username,
    email,
    preferences: {}
  });
}

export { UserProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateAge(age: number): boolean {
    return age >= 18 && age <= 120;
  }

  static validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name.trim()) {
      errors.push('Name is required');
    }

    if (!this.validateEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validateAge(profile.age)) {
      errors.push('Age must be between 18 and 120');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

const sampleProfile: UserProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  isActive: true
};

const validationResult = UserProfileValidator.validateProfile(sampleProfile);
console.log('Profile valid:', validationResult.isValid);
if (!validationResult.isValid) {
  console.log('Validation errors:', validationResult.errors);
}