
interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly MIN_AGE = 18;
  private readonly MAX_AGE = 120;

  validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  validateAge(age: number): boolean {
    return age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name.trim()) {
      errors.push('Name is required');
    }

    if (!this.validateEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validateAge(profile.age)) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  createValidProfile(name: string, email: string, age: number): UserProfile | null {
    const profile: UserProfile = {
      name: name,
      email: email,
      age: age,
      isActive: true
    };

    const validation = this.validateProfile(profile);
    
    if (validation.isValid) {
      return profile;
    }
    
    console.warn('Profile creation failed:', validation.errors);
    return null;
  }
}

const validator = new UserProfileValidator();

const testProfile = validator.createValidProfile(
  'John Doe',
  'john.doe@example.com',
  30
);

if (testProfile) {
  console.log('Valid profile created:', testProfile);
}import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true),
  }),
  lastActive: z.date().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export class ProfileValidationError extends Error {
  constructor(message: string, public readonly details: z.ZodIssue[]) {
    super(message);
    this.name = 'ProfileValidationError';
  }
}

export function validateUserProfile(data: unknown): UserProfile {
  const result = UserProfileSchema.safeParse(data);
  
  if (!result.success) {
    const errorMessages = result.error.issues.map(issue => 
      `${issue.path.join('.')}: ${issue.message}`
    ).join('; ');
    
    throw new ProfileValidationError(
      `Invalid profile data: ${errorMessages}`,
      result.error.issues
    );
  }
  
  return result.data;
}

export function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    id: crypto.randomUUID(),
    username,
    email,
    preferences: {
      theme: 'auto',
      notifications: true,
    },
    lastActive: new Date(),
  };
}